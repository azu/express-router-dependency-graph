| File         | Method | Routing         | Middlewares  | FilePath            |
| ------------ | ------ | --------------- | ------------ | ------------------- |
| src/game.ts  |        |                 |              |                     |
|              | get    | /getGameById    | requireRead  | src/game.ts#L11-L11 |
|              | get    | /getGameList    | requireRead  | src/game.ts#L12-L12 |
|              | post   | /updateGameById | requireWrite | src/game.ts#L13-L13 |
|              | delete | /deleteGameById | requireWrite | src/game.ts#L14-L14 |
| src/index.ts |        |                 |              |                     |
|              | use    | /game           | game         | src/index.ts#L7-L7  |