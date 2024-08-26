import express from "express";
import {
    addDownload, approveModUpdate,
    checkAvailability,
    createMod,
    getAllMods,
    requestModUpdate,
    verifyMod
} from "../controllers/mod.controller";

const router = express.Router();

router.post("/create", createMod)
router.get("/checkAvailability", checkAvailability)
router.get("/getAll", getAllMods)
router.post("/addDownload", addDownload)
router.post("/verify", verifyMod)
router.patch("/update", requestModUpdate)
router.patch("/approveUpdate", approveModUpdate)
export default router;