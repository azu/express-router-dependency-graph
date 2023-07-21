import path from "node:path";
import assert from "node:assert";
import { analyzeDependencies } from "../src/index.js";
import { globby } from "globby";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pathReplacer = (dirPath: string) => {
    return function replacer(key: string, value: any) {
        if (key === "filePath") {
            return value.replace(dirPath, "<root>");
        }
        return value;
    };
};
const normalize = (o: object | string, rootDir: string) => {
    return JSON.parse(JSON.stringify(o, pathReplacer(rootDir)));
};

describe("app snapshot", function () {
    it("test", async () => {
        const rootDir = path.join(__dirname, "fixtures/app");
        const jsonResults = await analyzeDependencies({
            filePaths: await globby(["**/*.ts"], { cwd: rootDir }),
            cwd: rootDir,
            rootBaseUrl: "",
            outputFormat: "json"
        });
        const mdResults = await analyzeDependencies({
            filePaths: await globby(["**/*.ts"], { cwd: rootDir }),
            cwd: rootDir,
            rootBaseUrl: "",
            outputFormat: "markdown"
        });
        assert.strictEqual(
            mdResults,
            `\
| File         | Method | Routing         | Middlewares  | FilePath            |
| ------------ | ------ | --------------- | ------------ | ------------------- |
| src/game.ts  |        |                 |              |                     |
|              | get    | /getGameById    | requireRead  | src/game.ts#L11-L11 |
|              | get    | /getGameList    | requireRead  | src/game.ts#L12-L12 |
|              | post   | /updateGameById | requireWrite | src/game.ts#L13-L13 |
|              | delete | /deleteGameById | requireWrite | src/game.ts#L14-L14 |
| src/index.ts |        |                 |              |                     |
|              | use    | /user           | user         | src/index.ts#L8-L8  |
|              | use    | /game           | game         | src/index.ts#L9-L9  |
| src/user.ts  |        |                 |              |                     |
|              | get    | /getUserById    | requireRead  | src/user.ts#L10-L10 |
|              | get    | /getUserList    | requireRead  | src/user.ts#L11-L11 |
|              | post   | /updateUserById | requireWrite | src/user.ts#L12-L12 |
|              | delete | /deleteUserById | requireWrite | src/user.ts#L13-L13 |`
        );
        assert.deepStrictEqual(normalize(jsonResults, rootDir), [
            {
                filePath: "<root>/src/game.ts",
                routers: [
                    {
                        method: "get",
                        path: "/getGameById",
                        middlewares: ["requireRead"],
                        range: [288, 337],
                        loc: {
                            start: { line: 11, column: 0, index: 288 },
                            end: { line: 11, column: 49, index: 337 }
                        }
                    },
                    {
                        method: "get",
                        path: "/getGameList",
                        middlewares: ["requireRead"],
                        range: [339, 388],
                        loc: {
                            start: { line: 12, column: 0, index: 339 },
                            end: { line: 12, column: 49, index: 388 }
                        }
                    },
                    {
                        method: "post",
                        path: "/updateGameById",
                        middlewares: ["requireWrite"],
                        range: [390, 444],
                        loc: {
                            start: { line: 13, column: 0, index: 390 },
                            end: { line: 13, column: 54, index: 444 }
                        }
                    },
                    {
                        method: "delete",
                        path: "/deleteGameById",
                        middlewares: ["requireWrite"],
                        range: [446, 502],
                        loc: {
                            start: { line: 14, column: 0, index: 446 },
                            end: { line: 14, column: 56, index: 502 }
                        }
                    }
                ]
            },
            {
                filePath: "<root>/src/index.ts",
                routers: [
                    {
                        method: "use",
                        path: "/user",
                        middlewares: ["user"],
                        range: [140, 162],
                        loc: {
                            start: { line: 8, column: 0, index: 140 },
                            end: { line: 8, column: 22, index: 162 }
                        }
                    },
                    {
                        method: "use",
                        path: "/game",
                        middlewares: ["game"],
                        range: [164, 186],
                        loc: {
                            start: { line: 9, column: 0, index: 164 },
                            end: { line: 9, column: 22, index: 186 }
                        }
                    }
                ]
            },
            {
                filePath: "<root>/src/user.ts",
                routers: [
                    {
                        method: "get",
                        path: "/getUserById",
                        middlewares: ["requireRead"],
                        range: [287, 336],
                        loc: {
                            start: { line: 10, column: 0, index: 287 },
                            end: { line: 10, column: 49, index: 336 }
                        }
                    },
                    {
                        method: "get",
                        path: "/getUserList",
                        middlewares: ["requireRead"],
                        range: [338, 387],
                        loc: {
                            start: { line: 11, column: 0, index: 338 },
                            end: { line: 11, column: 49, index: 387 }
                        }
                    },
                    {
                        method: "post",
                        path: "/updateUserById",
                        middlewares: ["requireWrite"],
                        range: [389, 443],
                        loc: {
                            start: { line: 12, column: 0, index: 389 },
                            end: { line: 12, column: 54, index: 443 }
                        }
                    },
                    {
                        method: "delete",
                        path: "/deleteUserById",
                        middlewares: ["requireWrite"],
                        range: [445, 501],
                        loc: {
                            start: { line: 13, column: 0, index: 445 },
                            end: { line: 13, column: 56, index: 501 }
                        }
                    }
                ]
            }
        ]);
    });
    it("skip wrong path", async () => {
        const rootDir = path.join(__dirname, "fixtures/skip-wrong-path");
        const jsonResults = await analyzeDependencies({
            filePaths: await globby(["**/*.ts"], { cwd: rootDir }),
            cwd: rootDir,
            rootBaseUrl: "",
            outputFormat: "json"
        });
        assert.deepStrictEqual(normalize(jsonResults, rootDir), [
            {
                filePath: "<root>/src/game.ts",
                routers: [
                    {
                        method: "get",
                        path: "/getGameById",
                        middlewares: ["requireRead"],
                        range: [288, 337],
                        loc: {
                            start: { line: 11, column: 0, index: 288 },
                            end: { line: 11, column: 49, index: 337 }
                        }
                    },
                    {
                        method: "get",
                        path: "/getGameList",
                        middlewares: ["requireRead"],
                        range: [339, 388],
                        loc: {
                            start: { line: 12, column: 0, index: 339 },
                            end: { line: 12, column: 49, index: 388 }
                        }
                    },
                    {
                        method: "post",
                        path: "/updateGameById",
                        middlewares: ["requireWrite"],
                        range: [390, 444],
                        loc: {
                            start: { line: 13, column: 0, index: 390 },
                            end: { line: 13, column: 54, index: 444 }
                        }
                    },
                    {
                        method: "delete",
                        path: "/deleteGameById",
                        middlewares: ["requireWrite"],
                        range: [446, 502],
                        loc: {
                            start: { line: 14, column: 0, index: 446 },
                            end: { line: 14, column: 56, index: 502 }
                        }
                    }
                ]
            },
            {
                filePath: "<root>/src/index.ts",
                routers: [
                    {
                        method: "use",
                        path: "/game",
                        middlewares: ["game"],
                        range: [167, 189],
                        loc: {
                            start: { line: 7, column: 0, index: 167 },
                            end: { line: 7, column: 22, index: 189 }
                        }
                    }
                ]
            }
        ]);
    });
    it("test app.use function", async () => {
        const rootDir = path.join(__dirname, "fixtures/app.use-function");
        const mdResults = await analyzeDependencies({
            filePaths: await globby(["**/*.ts"], { cwd: rootDir }),
            cwd: rootDir,
            rootBaseUrl: "",
            outputFormat: "markdown"
        });
        assert.strictEqual(
            mdResults,
            `\
| File   | Method | Routing    | Middlewares        | FilePath     |
| ------ | ------ | ---------- | ------------------ | ------------ |
| app.ts |        |            |                    |              |
|        | post   | /getEvents |                    | app.ts#L3-L4 |
|        | use    | /useEvents | Anonymous Function | app.ts#L6-L8 |`
        );
    });
});
