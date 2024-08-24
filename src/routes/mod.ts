import express from "express";
import {addDownload, checkAvailability, createMod, getAllMods} from "../controllers/mod.controller";

const router = express.Router();

router.post("/create", createMod)
router.get("/checkAvailability", checkAvailability)
router.get("/getAll", getAllMods)
router.post("/addDownload", addDownload)
export default router;