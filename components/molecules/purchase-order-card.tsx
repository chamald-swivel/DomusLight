"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/atoms/status-badge"
import { SalesOrderDetails } from "@/components/molecules/sales-order-details"
import { LineItemsList } from "@/components/molecules/line-items-list"
import { ErrorDetails } from "@/components/molecules/error-details"
import type { PurchaseOrder } from "@/lib/purchase-order-service"

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder
  isExpanded: boolean
  onToggle: () => void
  hasError: boolean
  getErrorDetails: (po: PurchaseOrder) => string[]
}

export function PurchaseOrderCard({
  purchaseOrder,
  isExpanded,
  onToggle,
  hasError,
  getErrorDetails,
}: PurchaseOrderCardProps) {
  return (
    <Card className="bg-card border-border">
      <Collapsible>
        <CollapsibleTrigger className="w-full" onClick={onToggle}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="text-left">
                  <CardTitle className="text-base font-medium text-foreground">{purchaseOrder.pdfName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">PO: {purchaseOrder.poNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge hasError={hasError} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4 pl-7">
              {purchaseOrder.finalSOHeaderOutput && <SalesOrderDetails soHeader={purchaseOrder.finalSOHeaderOutput} />}

              {purchaseOrder.finalLinesOutput && purchaseOrder.finalLinesOutput.length > 0 && (
                <LineItemsList lineItems={purchaseOrder.finalLinesOutput} />
              )}

              {hasError && <ErrorDetails errors={getErrorDetails(purchaseOrder)} />}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
