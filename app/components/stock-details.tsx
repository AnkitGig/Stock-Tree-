"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Building, DollarSign, BarChart3 } from "lucide-react"

interface StockDetailsProps {
  stock: any
  onBack: () => void
}

export default function StockDetails({ stock, onBack }: StockDetailsProps) {
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

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000000) {
      return `₹${(value / 1000000000000).toFixed(2)}T`
    } else if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`
    }
    return value.toLocaleString("en-IN")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{stock.symbol}</h1>
              <p className="text-gray-600">{stock.companyName}</p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {stock.exchange}
            </Badge>
          </div>
        </div>

        {/* Price Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{formatCurrency(stock.ltp)}</div>
                <div
                  className={`flex items-center gap-2 mt-2 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {stock.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span className="text-xl font-semibold">
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.pChange.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Last Updated: {stock.lastUpdated ? new Date(stock.lastUpdated).toLocaleString() : "Just now"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Day's Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {formatCurrency(stock.low)} - {formatCurrency(stock.high)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{formatNumber(stock.volume)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{formatLargeNumber(stock.marketCap)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">P/E Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{stock.pe.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trading Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Trading Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Open</div>
                  <div className="font-semibold">{formatCurrency(stock.open)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Previous Close</div>
                  <div className="font-semibold">{formatCurrency(stock.close)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Day High</div>
                  <div className="font-semibold">{formatCurrency(stock.high)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Day Low</div>
                  <div className="font-semibold">{formatCurrency(stock.low)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Average Price</div>
                  <div className="font-semibold">{formatCurrency(stock.avgPrice)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="font-semibold">{formatNumber(stock.volume)}</div>
                </div>
              </div>

              {stock.additionalData && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">52W High</div>
                      <div className="font-semibold">{formatCurrency(stock.additionalData.weekHigh52)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">52W Low</div>
                      <div className="font-semibold">{formatCurrency(stock.additionalData.weekLow52)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Avg Volume</div>
                      <div className="font-semibold">{formatNumber(stock.additionalData.avgVolume)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Market Lot</div>
                      <div className="font-semibold">{stock.additionalData.marketLot}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Sector</div>
                  <div className="font-semibold">{stock.sector}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Market Cap</div>
                  <div className="font-semibold">{formatLargeNumber(stock.marketCap)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">P/E Ratio</div>
                  <div className="font-semibold">{stock.pe.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">P/B Ratio</div>
                  <div className="font-semibold">{stock.pb.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dividend Yield</div>
                  <div className="font-semibold">{stock.dividend.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Exchange</div>
                  <div className="font-semibold">{stock.exchange}</div>
                </div>
              </div>

              {stock.additionalData && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">EPS</div>
                      <div className="font-semibold">₹{stock.additionalData.eps}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Book Value</div>
                      <div className="font-semibold">₹{stock.additionalData.bookValue}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Face Value</div>
                      <div className="font-semibold">₹{stock.additionalData.faceValue}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">ISIN</div>
                      <div className="font-semibold text-xs">{stock.additionalData.isin}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Shares</div>
                      <div className="font-semibold">{formatNumber(stock.additionalData.totalShares)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Free Float</div>
                      <div className="font-semibold">{(stock.additionalData.freeFloat * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        {stock.additionalData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Industry</div>
                  <div className="font-semibold">{stock.additionalData.industry}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Listing Date</div>
                  <div className="font-semibold">{new Date(stock.additionalData.listingDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Updated</div>
                  <div className="font-semibold">
                    {stock.lastUpdated ? new Date(stock.lastUpdated).toLocaleString() : "Just now"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
