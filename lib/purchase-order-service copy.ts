// Service layer for Purchase Order data operations
// Simulates database calls with mock data structured like real DB responses
import { createClient } from "@supabase/supabase-js";
export interface LineItem {
  json: {
    itemNo: string;
    code: string;
    itemDescription: string;
    unitOfMeasureCode: string;
    poItemNumber: string;
    poDescription: string;
    quantity: number;
    unitprice: number;
    shipmentDate: string;
  };
  pairedItem: {
    item: number;
  };
}

export interface SOHeader {
  orderDate: string;
  postingDate: string | null;
  customerId: string;
  customerNumber: string;
  customerName: string;
  billToName: string;
  billToCustomerNumber: string;
  shipToName: string;
  sellToAddressLine1: string;
  billToAddressLine1: string;
  shipToAddressLine1: string;
  currencyCode: string;
  pricesIncludeTax: boolean;
  paymentTerms: string | null;
  shipmentMethod: string | null;
  salesperson: string | null;
  requestedDeliveryDate: string | null;
  totalAmountExcludingTax: string | null;
  totalTaxAmount: string | null;
  totalAmountIncludingTax: string | null;
  sellToCity: string;
}

export interface PurchaseOrder {
  id?: string;
  pdfName: string;
  finalLinesOutput: LineItem[] | null;
  finalSOHeaderOutput: SOHeader | null;
  created_at: string;
}

import { mockPurchaseOrders } from "./mock-purchase-orders";
import { getSupabaseClient } from "./supabase";

const supabase = createClient(
  "https://snregmhjviiklvxkiwpp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucmVnbWhqdmlpa2x2eGtpd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTMzNTAsImV4cCI6MjA3Mzg2OTM1MH0.QV2xQI-6MNUXNP9kFleOBUSFONCmki84RaCYLvqxl6I"
);

// Service class for database operations
export class PurchaseOrderService {
  // Simulate database query with filtering and sorting
  static async getTodaysPurchaseOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];
      
      // Query Supabase for today's purchase orders
      const { data: orders, error } = await supabase.from("FinalPOData").select(
        `
          pdfName,
          finalLinesOutput,
          finalSOHeaderOutput,
          created_at
        `
      );
      // .gte("created_at", today)
      // .lt(
      //   "created_at",
      //   new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
      // )
      // .order("created_at", { ascending: false });
      console.log("orders", orders);

      if (error) throw error;

      console.log(
        "[v0] Service: Fetched",
        orders.length,
        "purchase orders for",
        today
      );

      return {
        data: orders,
        error: null,
      };
    } catch (err) {
      console.error("[v0] Service error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch purchase orders" },
      };
    }
  }

  static async getErrorOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      // const supabase = createClient();

      // Query Supabase for orders with potential errors
      const { data: orders, error } = await supabase
        .from("FinalPOData")
        .select(
          `
          id,
          pdfName,
          finalLinesOutput,
          finalSOHeaderOutput,
          created_at
        `
        )
        .or("finalLinesOutput.is.null,finalSOHeaderOutput.is.null");

      if (error) throw error;

      // Further filter the results for specific error conditions
      const errorOrders = orders.filter((po) => {
        if (!po.finalLinesOutput || !po.finalSOHeaderOutput) {
          return true;
        }

        // Check for "Ambiguity in identification" errors in line items
        const hasLineErrors = po.finalLinesOutput.some(
          (line: LineItem) =>
            line.json.itemNo === "Ambiguity in identification" ||
            line.json.code === "Ambiguity in identification" ||
            line.json.itemDescription === "Ambiguity in identification"
        );

        // Check for undefined/null values in critical SOHeader fields
        const hasHeaderErrors =
          !po.finalSOHeaderOutput.totalAmountIncludingTax ||
          po.finalSOHeaderOutput.totalAmountIncludingTax === "null" ||
          !po.finalSOHeaderOutput.customerName ||
          !po.finalSOHeaderOutput.orderDate;

        return hasLineErrors || hasHeaderErrors;
      });

      return {
        data: errorOrders,
        error: null,
      };
    } catch (err) {
      console.error("[v0] Service error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch error orders" },
      };
    }
  }

  // Additional service methods that could be used
  static async getPurchaseOrderById(id: string): Promise<{
    data: PurchaseOrder | null;
    error: { message: string } | null;
  }> {
    try {
      // const supabase = createClient();

      const { data: order, error } = await supabase
        .from("purchase_orders")
        .select(
          `
          id,
          pdfName,
          finalLinesOutput,
          finalSOHeaderOutput,
          created_at
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        return {
          data: null,
          error: { message: "Purchase order not found" },
        };
      }

      return {
        data: order,
        error: null,
      };
    } catch (err) {
      console.error("[v0] Service error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch purchase order" },
      };
    }
  }
}
