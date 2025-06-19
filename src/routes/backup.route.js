import { Router } from "express";
import backupController from "#controllers/backup.controller.js";

const backupRouter = Router();

backupRouter.get("/manual", (req, res) => {
    const { token } = req.query;
    if (token === process.env.BACKUP_TOKEN) {
        backupController();
        return res.status(200).send("Backup iniciado com sucesso.");
    } else {
        return res.status(401).send("Token inválido.");
    }
});

export default backupRouter;