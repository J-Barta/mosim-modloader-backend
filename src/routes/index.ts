import express from "express";
import poster from "./poster";
import mod from "./mod";

const router = express.Router();

router.use("/poster", poster)
router.use("/mod", mod)

router.get("/", (req, res) => {
    res.status(200).send("I'm alive!!!")
})


export default router;