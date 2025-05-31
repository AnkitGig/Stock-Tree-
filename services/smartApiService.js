import { logger } from "../utils/logger.js"

// Mock data for demonstration - In real implementation, this would connect to Angel One SmartAPI
const mockStocks = [
  {
    symbol: "RELIANCE",
    exchange: "NSE",
    companyName: "Reliance Industries Limited",
    ltp: 2456.75,
    open: 2445.0,
    high: 2467.8,
    low: 2441.25,
    close: 2450.3,
    change: 6.45,
    pChange: 0.26,
    volume: 1234567,
    avgPrice: 2454.2,
    marketCap: 16589234567890,
    pe: 12.45,
    pb: 1.89,
    dividend: 2.5,
    sector: "Oil & Gas",
  },
  {
    symbol: "TCS",
    exchange: "NSE",
    companyName: "Tata Consultancy Services Limited",
    ltp: 3567.9,
    open: 3555.0,
    high: 3578.45,
    low: 3548.2,
    close: 3560.15,
    change: 7.75,
    pChange: 0.22,
    volume: 987654,
    avgPrice: 3562.3,
    marketCap: 12987654321098,
    pe: 28.67,
    pb: 12.34,
    dividend: 1.8,
    sector: "Information Technology",
  },
  {
    symbol: "HDFCBANK",
    exchange: "NSE",
    companyName: "HDFC Bank Limited",
    ltp: 1678.45,
    open: 1672.3,
    high: 1685.9,
    low: 1669.8,
    close: 1675.2,
    change: 3.25,
    pChange: 0.19,
    volume: 2345678,
    avgPrice: 1676.85,
    marketCap: 9876543210987,
    pe: 18.92,
    pb: 2.45,
    dividend: 3.2,
    sector: "Banking",
  },
  {
    symbol: "INFY",
    exchange: "NSE",
    companyName: "Infosys Limited",
    ltp: 1456.3,
    open: 1448.75,
    high: 1462.1,
    low: 1445.6,
    close: 1452.85,
    change: 3.45,
    pChange: 0.24,
    volume: 1876543,
    avgPrice: 1454.2,
    marketCap: 6123456789012,
    pe: 24.56,
    pb: 8.91,
    dividend: 2.1,
    sector: "Information Technology",
  },
  {
    symbol: "ICICIBANK",
    exchange: "NSE",
    companyName: "ICICI Bank Limited",
    ltp: 1234.67,
    open: 1228.9,
    high: 1238.45,
    low: 1225.3,
    close: 1230.22,
    change: 4.45,
    pChange: 0.36,
    volume: 3456789,
    avgPrice: 1232.15,
    marketCap: 8765432109876,
    pe: 16.78,
    pb: 2.89,
    dividend: 2.8,
    sector: "Banking",
  },
]

class SmartApiService {
  constructor() {
    this.apiKey = process.env.ANGEL_ONE_API_KEY
    this.clientId = process.env.ANGEL_ONE_CLIENT_ID
    this.isConnected = false
    this.accessToken = null
  }

  // Simulate real-time price updates
  simulatePriceUpdate(stock) {
    const changePercent = (Math.random() - 0.5) * 0.02 // ±1% change
    const newPrice = stock.ltp * (1 + changePercent)
    const change = newPrice - stock.close
    const pChange = (change / stock.close) * 100

    return {
      ...stock,
      ltp: Number.parseFloat(newPrice.toFixed(2)),
      change: Number.parseFloat(change.toFixed(2)),
      pChange: Number.parseFloat(pChange.toFixed(2)),
      lastUpdated: new Date().toISOString(),
    }
  }

  async authenticate() {
    try {
      // In real implementation, this would authenticate with Angel One API
      logger.info("Authenticating with Angel One SmartAPI...")

      // Simulate authentication
      this.accessToken = "mock_access_token_" + Date.now()
      this.isConnected = true

      logger.info("Successfully authenticated with SmartAPI")
      return true
    } catch (error) {
      logger.error("Authentication failed:", error)
      throw new Error("Failed to authenticate with SmartAPI")
    }
  }

  async getMultipleStocks({ exchange, symbols, limit = 20 }) {
    try {
      if (!this.isConnected) {
        await this.authenticate()
      }

      let filteredStocks = [...mockStocks]

      // Filter by exchange
      if (exchange) {
        filteredStocks = filteredStocks.filter((stock) => stock.exchange.toLowerCase() === exchange.toLowerCase())
      }

      // Filter by symbols
      if (symbols && symbols.length > 0) {
        filteredStocks = filteredStocks.filter((stock) => symbols.includes(stock.symbol))
      }

      // Apply limit
      filteredStocks = filteredStocks.slice(0, limit)

      // Simulate real-time price updates
      const updatedStocks = filteredStocks.map((stock) => this.simulatePriceUpdate(stock))

      logger.info(`Fetched ${updatedStocks.length} stocks`)
      return updatedStocks
    } catch (error) {
      logger.error("Error fetching multiple stocks:", error)
      throw error
    }
  }

  async getStockDetails(symbol, exchange = "NSE") {
    try {
      if (!this.isConnected) {
        await this.authenticate()
      }

      const stock = mockStocks.find(
        (s) => s.symbol.toLowerCase() === symbol.toLowerCase() && s.exchange.toLowerCase() === exchange.toLowerCase(),
      )

      if (!stock) {
        return null
      }

      // Add additional details for individual stock view
      const detailedStock = {
        ...this.simulatePriceUpdate(stock),
        additionalData: {
          weekHigh52: stock.ltp * 1.25,
          weekLow52: stock.ltp * 0.75,
          eps: (stock.ltp / stock.pe).toFixed(2),
          bookValue: (stock.ltp / stock.pb).toFixed(2),
          faceValue: 10,
          marketLot: 1,
          isin: `INE${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          industry: stock.sector,
          listingDate: "2023-01-15",
          dayHigh: stock.high,
          dayLow: stock.low,
          avgVolume: Math.floor(stock.volume * 0.8),
          totalShares: Math.floor(stock.marketCap / stock.ltp),
          freeFloat: 0.75,
        },
      }

      logger.info(`Fetched details for stock: ${symbol}`)
      return detailedStock
    } catch (error) {
      logger.error("Error fetching stock details:", error)
      throw error
    }
  }

  async searchStocks(query, exchange, limit = 10) {
    try {
      if (!this.isConnected) {
        await this.authenticate()
      }

      let results = mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.companyName.toLowerCase().includes(query.toLowerCase()),
      )

      if (exchange) {
        results = results.filter((stock) => stock.exchange.toLowerCase() === exchange.toLowerCase())
      }

      results = results.slice(0, limit)

      logger.info(`Search for "${query}" returned ${results.length} results`)
      return results.map((stock) => ({
        symbol: stock.symbol,
        companyName: stock.companyName,
        exchange: stock.exchange,
        ltp: stock.ltp,
        change: stock.change,
        pChange: stock.pChange,
      }))
    } catch (error) {
      logger.error("Error searching stocks:", error)
      throw error
    }
  }

  // Get live streaming data (for WebSocket)
  async getLiveData() {
    try {
      const stocks = await this.getMultipleStocks({ limit: 10 })
      return stocks
    } catch (error) {
      logger.error("Error getting live data:", error)
      throw error
    }
  }
}

export const smartApiService = new SmartApiService()
