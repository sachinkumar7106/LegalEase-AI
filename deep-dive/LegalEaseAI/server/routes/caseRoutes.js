import express from "express";
import { getCases, createCase, updateCase, deleteCase } from "../controllers/caseController.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();

// All case routes require authentication
router.use(requireAuth);

router.get("/", getCases);
router.post("/", createCase);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);

export default router;
