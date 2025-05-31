import { smartApiService } from "../services/smartApiService.js"
import { logger } from "../utils/logger.js"

export const getStockList = async (req, res) => {
  try {
    const { exchange, symbols, limit = 20 } = req.query

    const stocks = await smartApiService.getMultipleStocks({
      exchange,
      symbols: symbols ? symbols.split(",") : undefined,
      limit: Number.parseInt(limit),
    })

    res.json({
      success: true,
      data: stocks,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Error fetching stock list:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock data",
      message: error.message,
    })
  }
}

export const getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params
    const { exchange = "NSE" } = req.query

    const stockData = await smartApiService.getStockDetails(symbol, exchange)

    if (!stockData) {
      return res.status(404).json({
        success: false,
        error: "Stock not found",
        message: `Stock with symbol ${symbol} not found`,
      })
    }

    res.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Error fetching stock details:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock details",
      message: error.message,
    })
  }
}

export const searchStocks = async (req, res) => {
  try {
    const { query, exchange, limit = 10 } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      })
    }

    const results = await smartApiService.searchStocks(query, exchange, Number.parseInt(limit))

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Error searching stocks:", error)
    res.status(500).json({
      success: false,
      error: "Failed to search stocks",
      message: error.message,
    })
  }
}
