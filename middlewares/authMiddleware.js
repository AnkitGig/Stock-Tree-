import { logger } from "../utils/logger.js"

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      })
    }

    // In real implementation, verify JWT token here
    // For demo purposes, we'll accept any token
    if (token === "demo_token" || token.startsWith("mock_")) {
      req.user = { id: "demo_user", role: "user" }
      next()
    } else {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      })
    }
  } catch (error) {
    logger.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      error: "Server error during authentication.",
    })
  }
}
