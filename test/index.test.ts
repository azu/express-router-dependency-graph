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
|              | get    | /getGameById    | requireRead  | src/game.ts#L11-11 |
|              | get    | /getGameList    | requireRead  | src/game.ts#L12-12 |
|              | post   | /updateGameById | requireWrite | src/game.ts#L13-13 |
|              | delete | /deleteGameById | requireWrite | src/game.ts#L14-14 |
| src/index.ts |        |                 |              |                    |
|              | use    | /user           | user         | src/index.ts#L8-8  |
|              | use    | /game           | game         | src/index.ts#L9-9  |
| src/user.ts  |        |                 |              |                    |
|              | get    | /getUserById    | requireRead  | src/user.ts#L10-10 |
|              | get    | /getUserList    | requireRead  | src/user.ts#L11-11 |
|              | post   | /updateUserById | requireWrite | src/user.ts#L12-12 |
|              | delete | /deleteUserById | requireWrite | src/user.ts#L13-13 |`
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
                        loc: { start: { line: 11, column: 0 }, end: { line: 11, column: 49 } }
                    },
                    {
                        method: "get",
                        path: "/getGameList",
                        middlewares: ["requireRead"],
                        range: [339, 388],
                        loc: { start: { line: 12, column: 0 }, end: { line: 12, column: 49 } }
                    },
                    {
                        method: "post",
                        path: "/updateGameById",
                        middlewares: ["requireWrite"],
                        range: [390, 444],
                        loc: { start: { line: 13, column: 0 }, end: { line: 13, column: 54 } }
                    },
                    {
                        method: "delete",
                        path: "/deleteGameById",
                        middlewares: ["requireWrite"],
                        range: [446, 502],
                        loc: { start: { line: 14, column: 0 }, end: { line: 14, column: 56 } }
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
                        range: [287, 336],
                        loc: { start: { line: 10, column: 0 }, end: { line: 10, column: 49 } }
                    },
                    {
                        method: "get",
                        path: "/getUserList",
                        middlewares: ["requireRead"],
                        range: [338, 387],
                        loc: { start: { line: 11, column: 0 }, end: { line: 11, column: 49 } }
                    },
                    {
                        method: "post",
                        path: "/updateUserById",
                        middlewares: ["requireWrite"],
                        range: [389, 443],
                        loc: { start: { line: 12, column: 0 }, end: { line: 12, column: 54 } }
                    },
                    {
                        method: "delete",
                        path: "/deleteUserById",
                        middlewares: ["requireWrite"],
                        range: [445, 501],
                        loc: { start: { line: 13, column: 0 }, end: { line: 13, column: 56 } }
                    }
                ]
            }
        ]);
    });
});
