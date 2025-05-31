"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from "lucide-react"
import StockDetails from "./components/stock-details"

interface Stock {
  symbol: string
  exchange: string
  companyName: string
  ltp: number
  open: number
  high: number
  low: number
  close: number
  change: number
  pChange: number
  volume: number
  avgPrice: number
  marketCap: number
  pe: number
  pb: number
  dividend: number
  sector: string
  lastUpdated?: string
}

const API_BASE_URL = "http://localhost:3001/api"
const WS_URL = "ws://localhost:3001"

export default function StockMarketDashboard() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [activeTab, setActiveTab] = useState("all")

  // WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(WS_URL)

        ws.onopen = () => {
          console.log("WebSocket connected")
          setWsConnected(true)
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === "liveData") {
              setStocks(data.data)
              setLastUpdate(data.timestamp)
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        ws.onclose = () => {
          console.log("WebSocket disconnected")
          setWsConnected(false)
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000)
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          setWsConnected(false)
        }
      } catch (error) {
        console.error("Failed to connect WebSocket:", error)
        setTimeout(connectWebSocket, 5000)
      }
    }

    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/stocks?limit=20`)
      const data = await response.json()

      if (data.success) {
        setStocks(data.data)
        setLastUpdate(data.timestamp)
      }
    } catch (error) {
      console.error("Error fetching stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchStocks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/stocks/search?query=${encodeURIComponent(query)}&limit=10`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error("Error searching stocks:", error)
    }
  }

  const handleStockClick = async (stock: Stock) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${stock.symbol}?exchange=${stock.exchange}`)
      const data = await response.json()

      if (data.success) {
        setSelectedStock(data.data)
      }
    } catch (error) {
      console.error("Error fetching stock details:", error)
      setSelectedStock(stock)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`
    }
    return value.toLocaleString("en-IN")
  }

  const getFilteredStocks = () => {
    switch (activeTab) {
      case "gainers":
        return stocks.filter((stock) => stock.change > 0).sort((a, b) => b.pChange - a.pChange)
      case "losers":
        return stocks.filter((stock) => stock.change < 0).sort((a, b) => a.pChange - b.pChange)
      case "nse":
        return stocks.filter((stock) => stock.exchange === "NSE")
      case "bse":
        return stocks.filter((stock) => stock.exchange === "BSE")
      default:
        return stocks
    }
  }

  if (selectedStock) {
    return <StockDetails stock={selectedStock} onBack={() => setSelectedStock(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stock Market Dashboard</h1>
              <p className="text-gray-600">Live BSE/NSE Stock Data</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {wsConnected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm ${wsConnected ? "text-green-600" : "text-red-600"}`}>
                  {wsConnected ? "Live" : "Disconnected"}
                </span>
              </div>
              <Button onClick={fetchStocks} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchStocks(e.target.value)
              }}
              className="pl-10"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                {searchResults.map((stock) => (
                  <div
                    key={`${stock.symbol}-${stock.exchange}`}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      handleStockClick(stock)
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.companyName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(stock.ltp)}</div>
                        <div className={`text-sm ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.pChange.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date(lastUpdate).toLocaleString()}</p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Stocks</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
            <TabsTrigger value="nse">NSE</TabsTrigger>
            <TabsTrigger value="bse">BSE</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stock List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredStocks().map((stock) => (
              <Card
                key={`${stock.symbol}-${stock.exchange}`}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleStockClick(stock)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                      <CardDescription className="text-sm">{stock.companyName}</CardDescription>
                    </div>
                    <Badge variant="outline">{stock.exchange}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{formatCurrency(stock.ltp)}</span>
                      <div
                        className={`flex items-center gap-1 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-medium">
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.pChange.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <div>Open: {formatCurrency(stock.open)}</div>
                        <div>High: {formatCurrency(stock.high)}</div>
                      </div>
                      <div>
                        <div>Low: {formatCurrency(stock.low)}</div>
                        <div>Volume: {formatNumber(stock.volume)}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Sector:</span>
                        <span className="font-medium">{stock.sector}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {getFilteredStocks().length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No stocks found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
