import { smartApiService } from "./smartApiService.js"
import { logger } from "../utils/logger.js"

const clients = new Set()
let liveDataInterval

export const initializeWebSocket = (wss) => {
  wss.on("connection", (ws) => {
    logger.info("New WebSocket client connected")
    clients.add(ws)

    // Send initial data
    sendLiveData(ws)

    // Handle client messages
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message)
        handleClientMessage(ws, data)
      } catch (error) {
        logger.error("Error parsing WebSocket message:", error)
      }
    })

    // Handle client disconnect
    ws.on("close", () => {
      logger.info("WebSocket client disconnected")
      clients.delete(ws)

      // Stop live data if no clients
      if (clients.size === 0 && liveDataInterval) {
        clearInterval(liveDataInterval)
        liveDataInterval = null
        logger.info("Stopped live data streaming - no clients connected")
      }
    })

    // Start live data streaming if this is the first client
    if (clients.size === 1 && !liveDataInterval) {
      startLiveDataStreaming()
    }
  })
}

const handleClientMessage = (ws, data) => {
  switch (data.type) {
    case "subscribe":
      // Handle subscription to specific stocks
      logger.info(`Client subscribed to: ${data.symbols}`)
      break
    case "unsubscribe":
      // Handle unsubscription
      logger.info(`Client unsubscribed from: ${data.symbols}`)
      break
    case "ping":
      // Respond to ping
      ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }))
      break
    default:
      logger.warn("Unknown message type:", data.type)
  }
}

const sendLiveData = async (ws) => {
  try {
    const liveData = await smartApiService.getLiveData()
    const message = {
      type: "liveData",
      data: liveData,
      timestamp: new Date().toISOString(),
    }

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message))
    }
  } catch (error) {
    logger.error("Error sending live data:", error)
  }
}

const broadcastLiveData = async () => {
  if (clients.size === 0) return

  try {
    const liveData = await smartApiService.getLiveData()
    const message = {
      type: "liveData",
      data: liveData,
      timestamp: new Date().toISOString(),
    }

    const messageStr = JSON.stringify(message)

    clients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(messageStr)
      } else {
        clients.delete(ws)
      }
    })

    logger.info(`Broadcasted live data to ${clients.size} clients`)
  } catch (error) {
    logger.error("Error broadcasting live data:", error)
  }
}

const startLiveDataStreaming = () => {
  logger.info("Starting live data streaming...")

  // Send updates every 5 seconds (adjust as needed)
  liveDataInterval = setInterval(broadcastLiveData, 5000)
}

export const getConnectedClients = () => clients.size
