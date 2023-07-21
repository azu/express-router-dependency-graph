import { parse } from "@babel/parser";
import path from "node:path";
import fs from "node:fs/promises";
import query from "esquery";
import { markdownTable } from "markdown-table";

const findRouting = async ({ AST, fileContent }: { AST: any; fileContent: string }) => {
    try {
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
const toAbsolute = (cwd: string, f: string) => {
    return path.resolve(cwd, f);
};

const hasImportExpress = (AST: any) => {
    // import express from "express";
    if (query(AST, "ImportDeclaration[source.value='express']").length > 0) {
        return true;
    }
    // const express = require("express");
    if (query(AST, "CallExpression[callee.name='require'][arguments.0.value='express']").length > 0) {
        return true;
    }
    // const express = await import("express");
    if (query(AST, "ImportExpression[source.value='express']").length > 0) {
        return true;
    }
    return false;
};

interface AnalyzeDependencyParams {
    filePath: string;
}

export async function analyzeDependency({ filePath }: AnalyzeDependencyParams) {
    const fileContent = await fs.readFile(filePath, "utf-8");
    try {
        const AST = parse(fileContent, {
            sourceType: "module",
            plugins: ["jsx", "typescript"]
        });
        if (!hasImportExpress(AST)) {
            return [];
        }
        return findRouting({ AST, fileContent });
    } catch (e) {
        console.error("Error while analyzing", filePath);
        console.error(e);
        return [];
    }
}

export async function analyzeDependencies({
    outputFormat,
    filePaths,
    rootBaseUrl = "",
    cwd
}: {
    filePaths: string[];
    rootBaseUrl: string;
    outputFormat: "markdown" | "json";
    cwd: string;
}) {
    const toRelative = (f: string) => {
        return path.relative(cwd, f);
    };
    const allResults = await Promise.all(
        filePaths.map(async (filePath) => {
            const absoluteFilePath = toAbsolute(cwd, filePath);
            return {
                filePath: absoluteFilePath,
                routers: await analyzeDependency({ filePath: absoluteFilePath })
            };
        })
    );
    if (outputFormat === "markdown") {
        const table = [["File", "Method", "Routing", "Middlewares", "FilePath"]];
        for (const result of allResults) {
            if (result.routers.length === 0) {
                continue;
            }
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
