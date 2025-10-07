export interface POOrderItem {
  itemNo: string;
  code: string;
  itemDescription: string;
  unitOfMeasureCode: string;
  poItemNumber: string;
  poDescription: string;
  quantity: number;
  unitprice: number;
  shipmentDate: string;
}

export interface PODetails {
  orderDate: string;
  poNumber: string;
  customerNumber: string;
  customerName: string;
  customerAddress: string;
  totalAmountExcludingTax: string | null;
  totalTaxAmount: string | null;
  totalAmountIncludingTax: string | null;
  currencyCode: string;
  salesperson: string | null;
  requestedDeliveryDate: string | null;
  paymentTerms: string | null;
  shipmentMethod: string | null;
  orderItems: POOrderItem[];
}

export class POExtractionService {
  private static readonly API_URL =
    "https://swivelace.app.n8n.cloud/webhook/getPOData";

  /**
   * Upload a PDF file and extract purchase order details
   * @param file - The PDF file to upload
   * @returns Promise with the extracted PO details
   */
  static async extractPODetails(file: File): Promise<PODetails> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(this.API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to extract PO details: ${response.statusText}`);
      }

      const data = await response.json();
      return data as PODetails;
    } catch (error) {
      console.error("Error extracting PO details:", error);
      throw error;
    }
  }
}
