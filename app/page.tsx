"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  PurchaseOrderService,
  type PurchaseOrder,
} from "@/lib/purchase-order-service";

export default function PurchaseOrderDashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchaseOrders() {
      try {
        console.log("[v0] Fetching today's purchase orders...");

        const { data, error: serviceError } =
          await PurchaseOrderService.getTodaysPurchaseOrders();

        if (serviceError) {
          console.log("[v0] Service error:", serviceError);
          setError(`Failed to fetch data: ${serviceError.message}`);
          return;
        }

        console.log("[v0] Fetched purchase orders:", data);
        setPurchaseOrders(data || []);
      } catch (err) {
        console.log("[v0] Fetch error:", err);
        setError("Failed to connect to database");
      } finally {
        setLoading(false);
      }
    }

    fetchPurchaseOrders();
  }, []);

  // Calculate metrics
  const today = new Date().toDateString();
  const todayOrders = purchaseOrders.filter(
    (po) => new Date(po.created_at).toDateString() === today
  );

  const errorOrders = purchaseOrders.filter((po) => {
    // Check if finalLinesOutput or finalSOHeaderOutput are missing/null
    if (!po.finalLinesOutput || !po.finalSOHeaderOutput) {
      return true;
    }

    // Check for "Ambiguity in identification" errors in line items
    const hasLineErrors = po.finalLinesOutput.some(
      (line) =>
        line.json.itemNo === "Ambiguity in identification" ||
        line.json.code === "Ambiguity in identification" ||
        line.json.itemDescription === "Ambiguity in identification"
    );

    // Check for undefined/null values in critical SOHeader fields
    const hasHeaderErrors =
      !po.finalSOHeaderOutput.totalAmountExcludingTax ||
      !po.finalSOHeaderOutput.customerName ||
      !po.finalSOHeaderOutput.orderDate;

    return hasLineErrors || hasHeaderErrors;
  });

  const toggleCard = (pdfName: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(pdfName)) {
      newExpanded.delete(pdfName);
    } else {
      newExpanded.add(pdfName);
    }
    setExpandedCards(newExpanded);
  };

  const hasError = (po: PurchaseOrder) => {
    if (!po.finalLinesOutput || !po.finalSOHeaderOutput) {
      return true;
    }

    const hasLineErrors = po.finalLinesOutput.some(
      (line) =>
        line.json.itemNo === "Ambiguity in identification" ||
        line.json.code === "Ambiguity in identification" ||
        line.json.itemDescription === "Ambiguity in identification"
    );

    const hasHeaderErrors =
      !po.finalSOHeaderOutput.totalAmountExcludingTax ||
      !po.finalSOHeaderOutput.customerName ||
      !po.finalSOHeaderOutput.orderDate;

    return hasLineErrors || hasHeaderErrors;
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getErrorDetails = (po: PurchaseOrder) => {
    const errors = [];
    if (!po.finalLinesOutput) {
      errors.push("Lines output missing or invalid");
    } else {
      const lineErrors = po.finalLinesOutput.filter(
        (line) =>
          line.json.itemNo === "Ambiguity in identification" ||
          line.json.code === "Ambiguity in identification" ||
          line.json.itemDescription === "Ambiguity in identification"
      );
      if (lineErrors.length > 0) {
        errors.push(
          `${lineErrors.length} line item(s) have ambiguous identification`
        );

        // Add details about each problematic line
        lineErrors.forEach((errorLine) => {
          const poItemNumber = errorLine.json.poItemNumber || "Unknown";
          const poDescription = errorLine.json.poDescription || "Unknown";
          errors.push(
            `Line with PO item number "${poItemNumber}" and description "${poDescription}" has identification error`
          );
        });
      }
    }

    if (!po.finalSOHeaderOutput) {
      errors.push("Header output missing or invalid");
    } else {
      if (!po.finalSOHeaderOutput.totalAmountExcludingTax) {
        errors.push("Total amount excluding tax is missing");
      }
      if (!po.finalSOHeaderOutput.customerName) {
        errors.push("Customer name is missing");
      }
      if (!po.finalSOHeaderOutput.orderDate) {
        errors.push("Order date is missing");
      }
    }

    return errors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">
              Connection Error
            </p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Purchase Order Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor today's purchase order processing
          </p>
        </div>

        {/* Metric Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <p className="text-base text-muted-foreground">Today's Date</p>
            </CardContent>
          </Card>

          {/* Total Entries */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-foreground">
                {todayOrders.length}
              </div>
              <p className="text-base text-muted-foreground">Entries</p>
            </CardContent>
          </Card>

          {/* Errors */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-destructive">
                {errorOrders.length}
              </div>
              <p className="text-base text-muted-foreground">Errors</p>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-foreground">
                {purchaseOrders.length > 0
                  ? formatTime(purchaseOrders[0].created_at)
                  : "--:--:--"}
              </div>
              <p className="text-base text-muted-foreground">Updated</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Order Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Purchase Orders
          </h2>

          {purchaseOrders.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No purchase orders found for today
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[...purchaseOrders]
                .sort((a, b) => {
                  const aHasError = hasError(a);
                  const bHasError = hasError(b);

                  // If one has error and other doesn't, prioritize the one with error
                  if (aHasError && !bHasError) return -1;
                  if (!aHasError && bHasError) return 1;

                  // If both have same error status, maintain original order
                  return 0;
                })
                .map((po) => (
                  <Card key={po.pdfName} className="bg-card border-border">
                    <Collapsible>
                      <CollapsibleTrigger
                        className="w-full"
                        onClick={() => toggleCard(po.pdfName)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {expandedCards.has(po.pdfName) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div className="text-left">
                                <CardTitle className="text-base font-medium text-foreground">
                                  {po.pdfName}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                  PO: {po.poNumber}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {hasError(po) ? (
                                <Badge
                                  variant="destructive"
                                  className="flex items-center gap-1"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  Error
                                </Badge>
                              ) : (
                                <Badge
                                  variant="default"
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Success
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-4 pl-7">
                            {po.finalSOHeaderOutput && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-foreground">
                                  Sales Order Details
                                </h4>
                                <div className="bg-muted/50 rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Customer Name:
                                        </span>
                                        <span className="text-foreground font-medium">
                                          {po.finalSOHeaderOutput
                                            .customerName || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Customer Number:
                                        </span>
                                        <span className="text-foreground">
                                          {po.finalSOHeaderOutput
                                            .customerNumber || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Order Date:
                                        </span>
                                        <span className="text-foreground">
                                          {po.finalSOHeaderOutput.orderDate ||
                                            "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Address:
                                        </span>
                                        <span className="text-foreground text-right">
                                          {po.finalSOHeaderOutput
                                            .billToAddressLine1 ||
                                            po.finalSOHeaderOutput
                                              .shipToAddressLine1 ||
                                            "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          City:
                                        </span>
                                        <span className="text-foreground">
                                          {po.finalSOHeaderOutput.sellToAddressLine1
                                            ?.split(",")
                                            .pop()
                                            ?.trim() || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Amount (Ex Tax):
                                        </span>
                                        <span className="text-foreground font-medium">
                                          {po.finalSOHeaderOutput
                                            .currencyCode || ""}{" "}
                                          {po.finalSOHeaderOutput
                                            .totalAmountExcludingTax || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Tax Amount:
                                        </span>
                                        <span className="text-foreground">
                                          {po.finalSOHeaderOutput
                                            .currencyCode || ""}{" "}
                                          {po.finalSOHeaderOutput
                                            .totalTaxAmount || "0"}
                                        </span>
                                      </div>
                                      {po.finalSOHeaderOutput.totalTaxAmount &&
                                        po.finalSOHeaderOutput
                                          .totalTaxAmount !== "0" &&
                                        po.finalSOHeaderOutput
                                          .totalAmountIncludingTax && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Total (Inc Tax):
                                            </span>
                                            <span className="text-foreground font-medium">
                                              {po.finalSOHeaderOutput
                                                .currencyCode || ""}{" "}
                                              {
                                                po.finalSOHeaderOutput
                                                  .totalAmountIncludingTax
                                              }
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {po.finalLinesOutput &&
                              po.finalLinesOutput.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-foreground">
                                    Line Items
                                  </h4>
                                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
                                    <div className="space-y-2">
                                      {po.finalLinesOutput.map(
                                        (line, index) => (
                                          <div
                                            key={index}
                                            className="flex flex-wrap items-center gap-4 p-3 bg-white dark:bg-blue-900/20 rounded-md border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600 transition-colors duration-200 shadow-sm"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                Item:
                                              </span>
                                              <span className="text-sm text-foreground font-medium">
                                                {line.json.poItemNumber || "N/A"}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                Code:
                                              </span>
                                              <span className="text-sm text-foreground">
                                                {line.json.code || "N/A"}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                Description:
                                              </span>
                                              <span
                                                className="text-sm text-foreground truncate max-w-48"
                                                title={
                                                  line.json.poDescription
                                                }
                                              >
                                                {line.json.poDescription ||
                                                  "N/A"}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                PO#:
                                              </span>
                                              <span className="text-sm text-foreground">
                                                {line.json.poItemNumber ||
                                                  "N/A"}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                Qty:
                                              </span>
                                              <span className="text-sm text-foreground font-medium">
                                                {line.json.quantity || "0"}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                Price:
                                              </span>
                                              <span className="text-sm text-foreground font-medium">
                                                {line.json.unitprice || "0"}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                UOM:
                                              </span>
                                              <span className="text-sm text-foreground">
                                                {line.json.unitOfMeasureCode ||
                                                  "N/A"}
                                              </span>
                                            </div>

                                            {line.json.shipmentDate && (
                                              <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                  Ship:
                                                </span>
                                                <span className="text-sm text-foreground">
                                                  {line.json.shipmentDate}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                            {hasError(po) && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-destructive">
                                  Error Details
                                </h4>
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                  <div className="space-y-3">
                                    <ul className="text-sm text-destructive space-y-1">
                                      {getErrorDetails(po).map(
                                        (error, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start gap-2"
                                          >
                                            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
