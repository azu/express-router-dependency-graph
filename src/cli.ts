import meow from "meow";
import { analyzeDependencies, formatMarkdown } from "./index.js";
import { globby } from "globby";

const defaultExcludes = [
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/build/**",
    "!**/coverage/**",
    "!**/test/**",
    "!**/__tests__/**"
];
export const cli = meow(
    `
    Usage
      $ express-router-dependency-graph [input]
 
    Options
      --cwd                   [Path:String] current working directory. Default: process.cwd()
      --rootBaseUrl           [Path:String] if pass it, replace rootDir with rootDirBaseURL in output.
      --format                ["json" | "markdown"] output format. Default: markdown

    Examples
      # analyze all ts files in src directory
      $ express-router-dependency-graph "src/**/*.ts"
      # analyze all ts files in src directory and output json
      $ express-router-dependency-graph "src/**/*.ts" --format=json
      # analyze all js and ts files in src directory
      $ express-router-dependency-graph "src/**/*.ts" "src/**/*.js"
      # change base url of output
      $ express-router-dependency-graph "src/**/*.ts" --rootBaseUrl="https://github.com/owner/repo/tree/master/src"
      # include node_modules
      # ${JSON.stringify(defaultExcludes)} is excluded by default  
      $ express-router-dependency-graph "src/**/*.ts" --no-default-excludes
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
            defaultExcludes: {
                type: "boolean",
                default: true
            },
            excludes: {
                type: "string",
                isMultiple: true,
                default: defaultExcludes
            },
            format: {
                type: "string",
                default: "markdown"
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
    const filePaths = await globby(flags.defaultExcludes ? input.concat(flags.excludes) : input, {
        cwd: flags.cwd
    });
    const results = await analyzeDependencies({
        cwd: flags.cwd,
        filePaths
    });
    if (flags.format === "json") {
        return {
            stdout: JSON.stringify(results),
            stderr: null,
            exitStatus: 0
        };
    } else if (flags.format === "markdown") {
        return {
            stdout: formatMarkdown({
                cwd: flags.cwd,
                rootBaseUrl: flags.rootBaseUrl,
                results
            }),
            stderr: null,
            exitStatus: 0
        };
    }
    throw new Error(`Unknown format: ${flags.format}`);
};
