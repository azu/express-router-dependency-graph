import meow from "meow";
import * as path from "path";
import { analyzeDependency } from "./index";

export const cli = meow(
    `
    Usage
      $ express-router-dependency-graph --rootDir=path/to/project
 
    Options
      --includeOnly           [String] only include modules satisfying a pattern. https://github.com/sverweij/dependency-cruiser/blob/develop/doc/cli.md#--include-only-only-include-modules-satisfying-a-pattern 
      --doNotFollow           [String] don't cruise modules adhering to this pattern any further. https://github.com/sverweij/dependency-cruiser/blob/develop/doc/cli.md#./options-reference.md#donotfollow-dont-cruise-modules-any-further
      --rootDir               [Path:String] path to root dir of source code [required]
      --rootBaseUrl           [Path:String] if pass it, replace rootDir with rootDirBaseURL in output.
      --format                ["json" | "markdown"] output format. Default: json

    Examples
      $ express-router-dependency-graph --rootDir=./
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
            includeOnly: {
                type: "string",
                isMultiple: true
            },
            doNotFollow: {
                type: "string",
                isMultiple: true,
                default: ["^node_modules"] as unknown as string
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
        outputFormat: flags.format as "json" | "markdown",
        includeOnly: flags.includeOnly,
        doNotFollow: flags.doNotFollow
    });
    return {
        stdout: flags.format === "json" ? JSON.stringify(result) : result,
        stderr: null,
        exitStatus: 0
    };
};
