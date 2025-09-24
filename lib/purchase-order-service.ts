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

const supabase = createClient(
  "https://snregmhjviiklvxkiwpp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucmVnbWhqdmlpa2x2eGtpd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTMzNTAsImV4cCI6MjA3Mzg2OTM1MH0.QV2xQI-6MNUXNP9kFleOBUSFONCmki84RaCYLvqxl6I"
);

// Service class that simulates database operations
export class PurchaseOrderService {
  // Simulate database query with filtering and sorting
  static async getTodaysPurchaseOrders(): Promise<{
    data: PurchaseOrder[] | null;
    error: { message: string } | null;
  }> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { data: orders, error } = await supabase.from("FinalPOData").select('*');
      console.log("orders", orders);

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
