import path from "path";
import { analyzeDependency } from "../src";
import assert from "assert";

const pathReplacer = (dirPath: string) => {
    return function replacer(key: string, value: any) {
        if (key === "filePath") {
            return value.replace(dirPath, "<root>");
        }
        return value;
    };
};
const normalize = (o: object, rootDir: string) => {
    return JSON.parse(JSON.stringify(o, pathReplacer(rootDir)));
};

describe("app snapshot", function () {
    it("test", async () => {
        const rootDir = path.join(__dirname, "fixtures/app");
        const jsonResults = await analyzeDependency({
            rootDir: rootDir,
            rootBaseUrl: "",
            outputFormat: "json"
        });
        const mdResults = await analyzeDependency({
            rootDir: rootDir,
            rootBaseUrl: "",
            outputFormat: "markdown"
        });
        assert.strictEqual(
            mdResults,
            `\
| File         | Method | Routing         | Middlewares  | FilePath           |
| ------------ | ------ | --------------- | ------------ | ------------------ |
| src/game.ts  |        |                 |              |                    |
|              | get    | /getGameById    | requireRead  | src/game.ts#L11-12 |
|              | get    | /getGameList    | requireRead  | src/game.ts#L13-14 |
|              | post   | /updateGameById | requireWrite | src/game.ts#L15-16 |
|              | delete | /deleteGameById | requireWrite | src/game.ts#L17-18 |
| src/index.ts |        |                 |              |                    |
|              | use    | /user           | user         | src/index.ts#L8-8  |
|              | use    | /game           | game         | src/index.ts#L9-9  |
| src/user.ts  |        |                 |              |                    |
|              | get    | /getUserById    | requireRead  | src/user.ts#L10-11 |
|              | get    | /getUserList    | requireRead  | src/user.ts#L12-13 |
|              | post   | /updateUserById | requireWrite | src/user.ts#L14-15 |
|              | delete | /deleteUserById | requireWrite | src/user.ts#L16-17 |`
        );
        assert.deepStrictEqual(normalize(jsonResults, rootDir), [
            {
                filePath: "<root>/src/game.ts",
                routers: [
                    {
                        method: "get",
                        path: "/getGameById",
                        middlewares: ["requireRead"],
                        range: [288, 338],
                        loc: { start: { line: 11, column: 0 }, end: { line: 12, column: 2 } }
                    },
                    {
                        method: "get",
                        path: "/getGameList",
                        middlewares: ["requireRead"],
                        range: [340, 390],
                        loc: { start: { line: 13, column: 0 }, end: { line: 14, column: 2 } }
                    },
                    {
                        method: "post",
                        path: "/updateGameById",
                        middlewares: ["requireWrite"],
                        range: [392, 447],
                        loc: { start: { line: 15, column: 0 }, end: { line: 16, column: 2 } }
                    },
                    {
                        method: "delete",
                        path: "/deleteGameById",
                        middlewares: ["requireWrite"],
                        range: [449, 506],
                        loc: { start: { line: 17, column: 0 }, end: { line: 18, column: 2 } }
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
                        loc: { start: { line: 8, column: 0 }, end: { line: 8, column: 22 } }
                    },
                    {
                        method: "use",
                        path: "/game",
                        middlewares: ["game"],
                        range: [164, 186],
                        loc: { start: { line: 9, column: 0 }, end: { line: 9, column: 22 } }
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
                        range: [287, 337],
                        loc: { start: { line: 10, column: 0 }, end: { line: 11, column: 2 } }
                    },
                    {
                        method: "get",
                        path: "/getUserList",
                        middlewares: ["requireRead"],
                        range: [339, 389],
                        loc: { start: { line: 12, column: 0 }, end: { line: 13, column: 2 } }
                    },
                    {
                        method: "post",
                        path: "/updateUserById",
                        middlewares: ["requireWrite"],
                        range: [391, 446],
                        loc: { start: { line: 14, column: 0 }, end: { line: 15, column: 2 } }
                    },
                    {
                        method: "delete",
                        path: "/deleteUserById",
                        middlewares: ["requireWrite"],
                        range: [448, 505],
                        loc: { start: { line: 16, column: 0 }, end: { line: 17, column: 2 } }
                    }
                ]
            }
        ]);
    });
});
