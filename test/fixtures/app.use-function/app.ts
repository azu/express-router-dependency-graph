import { Router } from "express";
const app = Router();
app.post("/getEvents", async (req, res, next) => {});

app.use("/useEvents", async (req, res, next) => {
    // use anonymous function
});

export = app;
