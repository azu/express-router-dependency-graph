import { Router } from "express";

const app = Router();

app.get("/get", (req, res) => {
    res.set("key", req.get("host"));
});
export default app;
