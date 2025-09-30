import { FieldDisplay } from "@/components/atoms/field-display";

interface SOHeaderOutput {
  customerName?: string | null;
  customerNumber?: string | null;
  billToAddressLine1?: string | null;
  shipToAddressLine1?: string | null;
  sellToAddressLine1?: string | null;
  orderDate?: string | null;
  totalAmountExcludingTax?: string | null;
  totalTaxAmount?: string | null;
  totalAmountIncludingTax?: string | null;
  currencyCode?: string | null;
  sellToCity?: string | null;
}

interface SalesOrderDetailsProps {
  soHeader: SOHeaderOutput;
}

export function SalesOrderDetails({ soHeader }: SalesOrderDetailsProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-foreground">Sales Order Details</h4>
      <div className="bg-muted/50 rounded-lg p-6 space-y-6">
        {/* Customer Information Section */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-foreground border-b border-border pb-1">
            Customer Information
          </h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FieldDisplay
              label="Customer Name"
              value={soHeader.customerName || ""}
            />
            <FieldDisplay
              label="Customer Number"
              value={soHeader.customerNumber || ""}
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-foreground border-b border-border pb-1">
            Address Information
          </h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FieldDisplay
              label="Address"
              value={
                soHeader.billToAddressLine1 || soHeader.shipToAddressLine1 || ""
              }
            />
            <FieldDisplay
              label="City"
              value={soHeader.sellToCity?.split(",").pop()?.trim() || ""}
            />
          </div>
        </div>

        {/* Order & Financial Information Section */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-foreground border-b border-border pb-1">
            Order & Financial Details
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FieldDisplay label="Order Date" value={soHeader.orderDate || ""} />
            <FieldDisplay
              label="Amount (Ex Tax)"
              value={`${soHeader.currencyCode || ""} ${
                soHeader.totalAmountExcludingTax || ""
              }`}
              variant="bold"
            />
            <FieldDisplay
              label="Tax Amount"
              value={`${soHeader.currencyCode || ""} ${
                soHeader.totalTaxAmount || "0"
              }`}
            />
            {soHeader.totalTaxAmount &&
              soHeader.totalTaxAmount !== "0" &&
              soHeader.totalAmountIncludingTax && (
                <FieldDisplay
                  label="Total (Inc Tax)"
                  value={`${soHeader.currencyCode || ""} ${
                    soHeader.totalAmountIncludingTax
                  }`}
                  variant="success"
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
