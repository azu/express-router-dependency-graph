import express from "express";
import game from "./game";
// @ts-ignore: IT IS NOT FOUND!!
import WRONG_PATH from "#/#/#";
const app = express();
const port = 3000;
app.use("/game", game);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
