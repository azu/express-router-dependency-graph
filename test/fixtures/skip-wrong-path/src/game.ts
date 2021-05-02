import express, { Request, Response, NextFunction } from "express";

const router = express.Router();
const requireRead = (_req: Request, _res: Response, next: NextFunction) => {
    next();
};
const requireWrite = (_req: Request, _res: Response, next: NextFunction) => {
    next();
};

router.get("/getGameById", requireRead, () => {});
router.get("/getGameList", requireRead, () => {});
router.post("/updateGameById", requireWrite, () => {});
router.delete("/deleteGameById", requireWrite, () => {});
export default router;
