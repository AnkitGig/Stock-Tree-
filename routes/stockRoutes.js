import express from "express"
import { getStockList, getStockDetails, searchStocks } from "../controllers/stockController.js"

const router = express.Router()

// Public routes (for demo purposes)
router.get("/stocks", getStockList)
router.get("/stocks/search", searchStocks)
router.get("/stocks/:symbol", getStockDetails)

// Protected routes (uncomment when implementing real authentication)
// router.use(authMiddleware);
// router.get('/stocks', authMiddleware, getStockList);
// router.get('/stocks/:symbol', authMiddleware, getStockDetails);

export default router
