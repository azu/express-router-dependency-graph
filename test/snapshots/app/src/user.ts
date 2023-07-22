import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
const requireRead = (_req: Request, _res: Response, next: NextFunction) => {
    next();
};
const requireWrite = (_req: Request, _res: Response, next: NextFunction) => {
    next();
};

router.get("/getUserById", requireRead, () => {});
router.get("/getUserList", requireRead, () => {});
router.post("/updateUserById", requireWrite, () => {});
router.delete("/deleteUserById", requireWrite, () => {});
export default router;
