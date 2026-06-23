import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { getProteinScore } from "../services/nutrition";

const router = Router();
router.use(requireAuth);

router.get("/nutrition/protein-score", async (req: AuthRequest, res) => {
  const result = await getProteinScore(req.userId!);
  res.json(result);
});

export { router as nutritionRouter };
