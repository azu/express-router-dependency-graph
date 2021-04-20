import meow from "meow";
import * as path from "path";
import { analyzeDependency } from "./index";

export const cli = meow(
    `
    Usage
      $ express-router-dependency-graph --rootDir=path/to/src
 
    Options
      --rootDir               [Path:String] path to root dir of source code [required]
      --rootBaseUrl           [Path:String] if pass it, replace rootDir with rootDirBaseURL in output.
      --format                ["json" | "markdown"] output format. Default: json

    Examples
      $ express-router-dependency-graph --rootDir=./src/
`,
    {
        flags: {
            rootDir: {
                type: "string",
                isRequired: true
            },
            rootBaseUrl: {
                type: "string",
                default: ""
            },
            format: {
                type: "string",
                default: "json"
            }
        },
        autoHelp: true,
        autoVersion: true
    }
);

export const run = async (
    _input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const result = await analyzeDependency({
        rootDir: path.resolve(process.cwd(), flags.rootDir),
        rootBaseUrl: flags.rootBaseUrl,
        outputFormat: flags.format as "json" | "markdown"
    });
    return {
        stdout: result,
        stderr: null,
        exitStatus: 0
    };
};
