import { Router } from "express";

const app = Router();

app.get("/get", (req) => {
    const host = req.get("host"); // it is not router
});
export default app;
