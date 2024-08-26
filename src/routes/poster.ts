import express from "express";
import {
    authenticateUser,
    cancelUser, changeUserEmail, changeUserName, checkEmailAvailability, checkNameAvailablility,
    createUser,
    deleteUser, getUserFromToken,
    sendVerificationEndpoint,
    verifyUser
} from "../controllers/poster.controller";

const router = express.Router();

router.post("/create", createUser)
router.get("/authenticate", authenticateUser)
router.post("/sendVerificationEmail", sendVerificationEndpoint)
router.get("/verify", verifyUser)
router.get("/cancel", cancelUser)
router.delete("/delete", deleteUser)

router.get("/fromToken", getUserFromToken)
router.patch("/changeName", changeUserName)
router.patch("/changeEmail", changeUserEmail)

router.get("/nameAvailable", checkNameAvailablility)
router.get("/emailAvailable", checkEmailAvailability)

export default router;