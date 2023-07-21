import meow from "meow";
import { analyzeDependencies } from "./index.js";
import { globby } from "globby";

export const cli = meow(
    `
    Usage
      $ express-router-dependency-graph --rootDir=path/to/project
 
    Options
      --cwd                   [Path:String] current working directory. Default: process.cwd()
      --rootBaseUrl           [Path:String] if pass it, replace rootDir with rootDirBaseURL in output.
      --format                ["json" | "markdown"] output format. Default: json

    Examples
      $ express-router-dependency-graph "src/**/*.ts"
      # change rootDir to rootDirBaseURL
      $ express-router-dependency-graph "src/**/*.ts" --rootBaseUrl="https://github.com/owner/repo/tree/master/src"
      # include node_modules
      $ express-router-dependency-graph "src/**/*.ts" --noDefaultExcludes
`,
    {
        flags: {
            cwd: {
                type: "string",
                isRequired: true,
                default: process.cwd()
            },
            rootBaseUrl: {
                type: "string",
                default: ""
            },
            noDefaultExcludes: {
                type: "boolean",
                default: false
            },
            excludes: {
                type: "string",
                isMultiple: true,
                default: [
                    "!**/node_modules/**",
                    "!**/dist/**",
                    "!**/build/**",
                    "!**/coverage/**",
                    "!**/test/**",
                    "!**/__tests__/**"
                ]
            },
            format: {
                type: "string",
                default: "json"
            }
        },
        importMeta: import.meta,
        autoHelp: true,
        autoVersion: true
    }
);

export const run = async (
    input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const filePaths = await globby(flags.noDefaultExclude ? input : input.concat(flags.excludes), {
        cwd: flags.cwd
    });
    const result = await analyzeDependencies({
        cwd: flags.cwd,
        filePaths,
        rootBaseUrl: flags.rootBaseUrl,
        outputFormat: flags.format as "json" | "markdown"
    });
    return {
        stdout: typeof result === "object" ? JSON.stringify(result) : result,
        stderr: null,
        exitStatus: 0
    };
};
