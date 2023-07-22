import path from "node:path";
import assert from "node:assert";
import { analyzeDependencies, formatMarkdown } from "../src/index.js";
import { globby } from "globby";
import fs from "node:fs";

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
const fixturesDir = path.join(__dirname, "snapshots");
describe("Snapshot testing", () => {
    fs.readdirSync(fixturesDir).map((caseName) => {
        const normalizedTestName = caseName.replace(/-/g, " ");
        it(`Test ${normalizedTestName}`, async function () {
            const fixtureDir = path.join(fixturesDir, caseName);
            const jsonResults = await analyzeDependencies({
                filePaths: await globby(["**/*.{js,ts}"], { cwd: fixtureDir }),
                cwd: fixtureDir
            });
            const mdResults = formatMarkdown({
                results: jsonResults,
                cwd: fixtureDir,
                rootBaseUrl: ""
            });
            const expectedMdFilePath = path.join(fixtureDir, "output.md");
            const expectedJsonFilePath = path.join(fixtureDir, "output.json");
            // Usage: update snapshots
            // UPDATE_SNAPSHOT=1 npm test
            if (process.env.UPDATE_SNAPSHOT) {
                fs.writeFileSync(expectedMdFilePath, mdResults, "utf-8");
                fs.writeFileSync(expectedJsonFilePath, JSON.stringify(jsonResults, null, 4), "utf-8");
                this.skip();
                return;
            }
            // compare input and output
            assert.strictEqual(mdResults, fs.readFileSync(expectedMdFilePath, "utf-8"));
            assert.deepStrictEqual(
                normalize(jsonResults, fixtureDir),
                normalize(JSON.parse(fs.readFileSync(expectedJsonFilePath, "utf-8")), fixtureDir)
            );
        });
    });
});
