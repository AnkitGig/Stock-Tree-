import express from "express"
import cors from "cors"
import { WebSocketServer } from "ws"
import http from "http"
import dotenv from "dotenv"
import stockRoutes from "./routes/stockRoutes.js"
import { initializeWebSocket } from "./services/websocketService.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { logger } from "./utils/logger.js"

dotenv.config()

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", stockRoutes)

// Error handling middleware
app.use(errorHandler)

// Initialize WebSocket
initializeWebSocket(wss)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Stock API available at http://localhost:${PORT}/api/stocks`)
  console.log(`🔌 WebSocket available at ws://localhost:${PORT}`)
})

export default app
