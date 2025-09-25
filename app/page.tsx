"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { PurchaseOrderService, type PurchaseOrder } from "@/lib/purchase-order-service"
import { MetricCard } from "@/components/atoms/metric-card"
import { PurchaseOrderCard } from "@/components/molecules/purchase-order-card"

export default function PurchaseOrderDashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasError = (po: PurchaseOrder) => {
    if (!po.finalLinesOutput || !po.finalSOHeaderOutput) {
      return true
    }

    const hasLineErrors = po.finalLinesOutput.some(
      (line) =>
        line.json.itemNo === "Ambiguity in identification" ||
        line.json.code === "Ambiguity in identification" ||
        line.json.itemDescription === "Ambiguity in identification",
    )

    const hasHeaderErrors =
      !po.finalSOHeaderOutput.totalAmountExcludingTax ||
      !po.finalSOHeaderOutput.customerName ||
      !po.finalSOHeaderOutput.orderDate

    return hasLineErrors || hasHeaderErrors
  }

  const getErrorDetails = (po: PurchaseOrder) => {
    const errors = []
    if (!po.finalLinesOutput) {
      errors.push("Lines output missing or invalid")
    } else {
      const lineErrors = po.finalLinesOutput.filter(
        (line) =>
          line.json.itemNo === "Ambiguity in identification" ||
          line.json.code === "Ambiguity in identification" ||
          line.json.itemDescription === "Ambiguity in identification",
      )
      if (lineErrors.length > 0) {
        errors.push(`${lineErrors.length} line item(s) have ambiguous identification`)

        // Add details about each problematic line
        lineErrors.forEach((errorLine) => {
          const poItemNumber = errorLine.json.poItemNumber
          const poDescription = errorLine.json.poDescription

          // Build error message parts conditionally
          const messageParts = []

          if (poItemNumber && poItemNumber !== "undefined" && poItemNumber.trim() !== "") {
            messageParts.push(`PO item number "${poItemNumber}"`)
          }

          if (poDescription && poDescription !== "undefined" && poDescription.trim() !== "") {
            messageParts.push(`description "${poDescription}"`)
          }

          // Create the error message based on available fields
          if (messageParts.length > 0) {
            const messageText = messageParts.join(" and ")
            errors.push(`Line with ${messageText} has identification error`)
          } else {
            errors.push("Line has identification error (no valid identifiers found)")
          }
        })
      }
    }

    if (!po.finalSOHeaderOutput) {
      errors.push("Header output missing or invalid")
    } else {
      if (!po.finalSOHeaderOutput.totalAmountExcludingTax) {
        errors.push("Total amount excluding tax is missing")
      }
      if (!po.finalSOHeaderOutput.customerName) {
        errors.push("Customer name is missing")
      }
      if (!po.finalSOHeaderOutput.orderDate) {
        errors.push("Order date is missing")
      }
    }

    return errors
  }

  useEffect(() => {
    async function fetchPurchaseOrders() {
      try {
        console.log("[v0] Fetching today's purchase orders...")

        const { data, error: serviceError } = await PurchaseOrderService.getTodaysPurchaseOrders()

        if (serviceError) {
          console.log("[v0] Service error:", serviceError)
          setError(`Failed to fetch data: ${serviceError.message}`)
          return
        }

        console.log("[v0] Fetched purchase orders:", data)
        setPurchaseOrders(data || [])
      } catch (err) {
        console.log("[v0] Fetch error:", err)
        setError("Failed to connect to database")
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseOrders()
  }, [])

  // Calculate metrics
  const today = new Date().toDateString()
  const todayOrders = purchaseOrders.filter((po) => new Date(po.created_at).toDateString() === today)

  const errorOrders = purchaseOrders.filter((po) => hasError(po))

  const toggleCard = (pdfName: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(pdfName)) {
      newExpanded.delete(pdfName)
    } else {
      newExpanded.add(pdfName)
    }
    setExpandedCards(newExpanded)
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading purchase orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">Connection Error</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Purchase Order Dashboard</h1>
          <p className="text-muted-foreground">Monitor today's purchase order processing</p>
        </div>

        {/* Metric Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            value={new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            label="Today's Date"
          />
          <MetricCard value={todayOrders.length} label="Entries" />
          <MetricCard value={errorOrders.length} label="Errors" variant="error" />
          <MetricCard
            value={purchaseOrders.length > 0 ? formatTime(purchaseOrders[0].created_at) : "--:--:--"}
            label="Updated"
          />
        </div>

        {/* Purchase Order Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Purchase Orders</h2>

          {purchaseOrders.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No purchase orders found for today</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[...purchaseOrders]
                .sort((a, b) => {
                  const aHasError = hasError(a)
                  const bHasError = hasError(b)

                  // If one has error and other doesn't, prioritize the one with error
                  if (aHasError && !bHasError) return -1
                  if (!aHasError && bHasError) return 1

                  // If both have same error status, maintain original order
                  return 0
                })
                .map((po) => (
                  <PurchaseOrderCard
                    key={po.pdfName}
                    purchaseOrder={po}
                    isExpanded={expandedCards.has(po.pdfName)}
                    onToggle={() => toggleCard(po.pdfName)}
                    hasError={hasError(po)}
                    getErrorDetails={getErrorDetails}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
