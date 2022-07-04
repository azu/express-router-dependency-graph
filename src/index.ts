import { cruise, IReporterOutput } from "dependency-cruiser";
import { IDependency, IModule } from "dependency-cruiser/types/cruise-result";
import { parse } from "@babel/parser";
import path from "path";
import fs from "fs/promises";
import query from "esquery";
// @ts-ignore
import markdownTable from "markdown-table";

const findRouting = async (filePath: string) => {
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const AST = parse(fileContent, {
            sourceType: "module",
            plugins: ["jsx", "typescript"]
        });
        const search = (method: "get" | "post" | "delete" | "put" | "use", AST: any) => {
            const selector = `CallExpression:has(MemberExpression > Identifier[name="${method}"])`;
            const results = query(AST, selector);
            // router.{get,post,delete,put,use}
            return results.flatMap((node: any) => {
                const pathValue =
                    node.arguments[0] !== undefined &&
                    node.arguments[0].type === "StringLiteral" &&
                    node.arguments[0].value;
                if (!pathValue) {
                    return []; // skip: it will only includes middleware
                }
                const middlewareArguments =
                    method === "use"
                        ? // @ts-ignore
                          node.arguments?.slice(1) ?? []
                        : // @ts-ignore
                          node.arguments?.slice(1, node.arguments.length - 1) ?? [];
                const middlewares = middlewareArguments.map((arg: { start: number; end: number }) => {
                    return fileContent.slice(arg.start, arg.end);
                });
                return [
                    {
                        method,
                        path: pathValue,
                        middlewares,
                        // @ts-ignore
                        range: [node.start, node.end] as [number, number],
                        // @ts-ignore
                        loc: node.loc as {
                            start: { line: number; column: number };
                            end: { line: number; column: number };
                        }
                    }
                ];
            });
        };
        const methods = ["get", "post", "delete", "put", "use"] as const;
        return methods.flatMap((method) => {
            return search(method, AST);
        });
    } catch {
        return [];
    }
};
const toAbsolute = (f: string) => {
    return path.resolve(process.cwd(), f);
};

export async function analyzeDependency({
    outputFormat,
    rootDir,
    rootBaseUrl = "",
    includeOnly,
    doNotFollow
}: {
    rootDir: string;
    rootBaseUrl: string;
    outputFormat: "markdown" | "json";
    includeOnly?: string | string[];
    doNotFollow?: string | string[];
}) {
    const ROOT_DIR = rootDir;
    const hasImportExpress = (dep: IDependency) => {
        return (
            (dep.dependencyTypes.includes("npm") || dep.dependencyTypes.includes("npm-dev")) && dep.module === "express"
        );
    };
    const underTheRoot = (module: IModule) => {
        return toAbsolute(module.source).startsWith(ROOT_DIR);
    };
    const hasModuleImportExpress = (module: IModule) => {
        return module.dependencies.some((dep) => hasImportExpress(dep));
    };
    const toRelative = (f: string) => {
        return path.relative(ROOT_DIR, toAbsolute(f));
    };
    const ARRAY_OF_FILES_AND_DIRS_TO_CRUISE: string[] = [ROOT_DIR];
    const cruiseResult: IReporterOutput = cruise(ARRAY_OF_FILES_AND_DIRS_TO_CRUISE, {
        includeOnly,
        doNotFollow
    });
    if (typeof cruiseResult.output !== "object") {
        throw new Error("NO OUTPUT");
    }
    const modules = cruiseResult.output.modules.filter(hasModuleImportExpress).filter(underTheRoot);
    const allResults = await Promise.all(
        modules.map(async (mo) => {
            return {
                filePath: toAbsolute(mo.source),
                routers: await findRouting(toAbsolute(mo.source))
            };
        })
    );
    if (outputFormat === "markdown") {
        const table = [["File", "Method", "Routing", "Middlewares", "FilePath"]];
        for (const result of allResults) {
            table.push([`${rootBaseUrl}${toRelative(result.filePath)}`]);
            result.routers.forEach((router) => {
                table.push([
                    "",
                    router.method,
                    router.path,
                    router.middlewares.join(", ").split(/\r?\n/g).join(" "),
                    `${rootBaseUrl}${toRelative(result.filePath)}#L${router.loc.start.line}-L${router.loc.end.line}`
                ]);
            });
        }
        return markdownTable(table);
    } else {
        return allResults;
    }
}
