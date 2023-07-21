# express-router-dependency-graph

Create dependency graph for express routing.

## Install

Install with [npm](https://www.npmjs.com/):

    npx express-router-dependency-graph "src/**/*.ts"

## Usage

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
      # analyze all js and files in src directory
      $ express-router-dependency-graph "src/**/*.ts" "src/**/*.js"
      # change rootDir to rootDirBaseURL to output
      $ express-router-dependency-graph "src/**/*.ts" --rootBaseUrl="https://github.com/owner/repo/tree/master/src"
      # include node_modules
      # node_modules, dist, build, test, __tests__ are excluded by default
      $ express-router-dependency-graph "src/**/*.ts" --noDefaultExcludes

## Example

Example output: `--format=markdown`

- File: file path
- Method: get | post | put | delete | `use`(express's use)
- Routing: routing path name
- Middlewares: used middlewares
  - Note: `app.use("/test", () => { ... })` is shown "Anonymous Function" middleware
- FilePath: source code position

| File         | Method | Routing         | Middlewares  | FilePath            |
| ------------ | ------ | --------------- | ------------ |---------------------|
| src/game.ts  |        |                 |              |                     |
|              | get    | /getGameById    | requireRead  | src/game.ts#L11-L12 |
|              | get    | /getGameList    | requireRead  | src/game.ts#L13-L14 |
|              | post   | /updateGameById | requireWrite | src/game.ts#L15-L16 |
|              | delete | /deleteGameById | requireWrite | src/game.ts#L17-L18 |
| src/index.ts |        |                 |              |                     |
|              | use    | /user           | user         | src/index.ts#L8-L8  |
|              | use    | /game           | game         | src/index.ts#L9-L9  |
| src/user.ts  |        |                 |              |                     |
|              | get    | /getUserById    | requireRead  | src/user.ts#L10-L11 |
|              | get    | /getUserList    | requireRead  | src/user.ts#L12-L13 |
|              | post   | /updateUserById | requireWrite | src/user.ts#L14-L15 |
|              | delete | /deleteUserById | requireWrite | src/user.ts#L16-L17 |`

Example output: `--format=json`

```json5
[
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
]
```

## Changelog

See [Releases page](https://github.com/azu/express-router-dependency-graph/releases).

## Related

- [node.js - How to get all registered routes in Express? - Stack Overflow](https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express)
    - Almost approach require runtime approach

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/express-router-dependency-graph/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- azu: [GitHub](https://github.com/azu), [Twitter](https://twitter.com/azu_re)

## License

MIT © azu
