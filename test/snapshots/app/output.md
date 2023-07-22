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
|              | delete | /deleteUserById | requireWrite | src/user.ts#L13-L13 |