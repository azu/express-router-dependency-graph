import express from "express";
import user from "./user";
import game from "./game";

const app = express();
const port = 3000;
// handlers
app.use("/user", user);
app.use("/game", game);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
