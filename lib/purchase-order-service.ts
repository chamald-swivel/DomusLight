// Service layer for Purchase Order data operations
// Can use either mock data or real Supabase database

import { createClient } from "@supabase/supabase-js";
import { mockPurchaseOrders } from "./mock-purchase-orders";

// Supabase client - only works when environment variables are set
const getSupabaseClient = () => {
  const supabaseUrl = "https://snregmhjviiklvxkiwpp.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucmVnbWhqdmlpa2x2eGtpd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTMzNTAsImV4cCI6MjA3Mzg2OTM1MH0.QV2xQI-6MNUXNP9kFleOBUSFONCmki84RaCYLvqxl6I";

  return createClient(supabaseUrl, supabaseKey);
};

const USE_REAL_DATABASE = true; // Set to true when you have Supabase configured

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
}

export interface PurchaseOrder {
  id?: string;
  pdfName: string;
  poNumber: string; // Added poNumber field to interface
  finalLinesOutput: LineItem[] | null;
  finalSOHeaderOutput: SOHeader | null;
  created_at: string;
}

// Service class that handles both mock and real database operations
export class PurchaseOrderService {
  static async getTodaysPurchaseOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    if (USE_REAL_DATABASE) {
      return this.getRealTodaysPurchaseOrders();
    } else {
      return this.getMockTodaysPurchaseOrders();
    }
  }

  private static async getRealTodaysPurchaseOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("FinalPOData")
        .select(`*`)
        .gte("created_at", today)
        .lt("created_at", tomorrow)
        .order("created_at", { ascending: false });
      const poData: PurchaseOrder[] =
        data?.map((po) => {
          return {
            pdfName: po.pdfName,
            poNumber: po.saledOrderBeforeLookup.id,
            finalLinesOutput: po.finalLinesOutput,
            finalSOHeaderOutput: po.finalSOHeaderOutput,
            created_at: po.created_at,
          };
        }) || [];
      if (error) {
        console.error("[v0] Supabase error:", error);
        return { data: null, error: { message: error.message } };
      }

      return { data: poData || [], error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch purchase orders from database" },
      };
    }
  }

  private static async getMockTodaysPurchaseOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get today's date in YYYY-MM-DD format for comparison
      const today = new Date().toISOString().split("T")[0];

      // Filter orders created or updated today (simulating SQL query)
      const todaysOrders = mockPurchaseOrders.filter((po) => {
        const createdDate = po.created_at.split(" ")[0];
        return createdDate === today;
      });

      // Sort by created_at descending (simulating ORDER BY)
      const sortedOrders = todaysOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      console.log(
        "[v0] Service: Fetched",
        sortedOrders.length,
        "mock purchase orders for",
        today
      );

      return {
        data: sortedOrders,
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
    if (USE_REAL_DATABASE) {
      return this.getRealErrorOrders();
    } else {
      return this.getMockErrorOrders();
    }
  }

  private static async getRealErrorOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      const { data, error } = await supabase
        .from("FinalPOData")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[v0] Supabase error:", error);
        return { data: null, error: { message: error.message } };
      }

      // Filter for error orders on the client side
      const errorOrders = (data || []).filter((po) => {
        // Check if finalLinesOutput or finalSOHeaderOutput are missing/null
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

        // Check for undefined/null values in critical SOHeader fields (excluding totalAmountIncludingTax)
        const hasHeaderErrors =
          !po.finalSOHeaderOutput.customerName ||
          !po.finalSOHeaderOutput.orderDate;

        return hasLineErrors || hasHeaderErrors;
      });

      return { data: errorOrders, error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch error orders from database" },
      };
    }
  }

  private static async getMockErrorOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const errorOrders = mockPurchaseOrders.filter((po) => {
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

        // Check for undefined/null values in critical SOHeader fields (excluding totalAmountIncludingTax)
        const hasHeaderErrors =
          !po.finalSOHeaderOutput.customerName ||
          !po.finalSOHeaderOutput.orderDate;

        return hasLineErrors || hasHeaderErrors;
      });

      return {
        data: errorOrders,
        error: null,
      };
    } catch (err) {
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
      await new Promise((resolve) => setTimeout(resolve, 300));

      const order = mockPurchaseOrders.find((po) => po.id === id);

      return {
        data: order || null,
        error: order ? null : { message: "Purchase order not found" },
      };
    } catch (err) {
      return {
        data: null,
        error: { message: "Failed to fetch purchase order" },
      };
    }
  }
}
