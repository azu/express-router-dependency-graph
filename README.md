# express-router-dependency-graph

Create dependency graph for express routing.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install express-router-dependency-graph

## Usage

    Usage
      $ express-router-dependency-graph --rootDir=path/to/src
 
    Options
      --rootDir               [Path:String] path to root dir of source code [required]
      --rootBaseUrl           [Path:String] if pass it, replace rootDir with rootDirBaseURL in output.
      --format                ["json" | "markdown"] output format. Default: json

    Examples
      $ express-router-dependency-graph --rootDir=./src/

## Example

Example output: `markdown`

- File: file path
- Method: get | post | put | delete | `use`(express's use)
- Routing: routing path name
- Middlewares: used middlewares
- FilePath: source code position

| File                                     | Method | Routing                                          | Middlewares                                                                                                                                 | FilePath                                         |
| ---------------------------------------- | ------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| user/index.ts                            |        |                                                  |                                                                                                                                             |                                                  |
|                                          | get    | /getUserById                                     | requireView                                                                                                                              | user/index.ts#L1-3                           |
|                                          | get    | /getUserList                                     | requireView                                                                                                                              | user/index.ts#L4-6                         |
|                                          | post   | /updateUserById                                      | requireEdit                                                                                                                              | user/index.ts#L8-10                          |
|                                          | post   | /deleteUserById                                  | requireEdit                                                                                                                              | user/index.ts#L12-20                        |
| game/index.ts                       |        |                                                  |                                                                                                                                             |                                                  |
|                                          | get    | /getGameList                                | requireView                                                                                                                              | game/index.ts#L1-3                   |
|                                          | get    | /getGameById                                | requireView                                                                                                                              | game/index.ts#L4-6                     |
|                                          | post   | /updateGameById                                 | requireEdit                                                                                                                              | game/index.ts#L8-10                     |
|                                          | post   | /deleteGameById                             | requireEdit                                                                                                                              | game/index.ts#L12-20                   |

## Changelog

See [Releases page](https://github.com/azu/express-router-dependency-graph/releases).

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
