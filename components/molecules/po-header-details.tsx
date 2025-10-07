import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { PODetails } from "@/lib/po-extraction-service"

interface POHeaderDetailsProps {
  poDetails: PODetails
}

export function POHeaderDetails({ poDetails }: POHeaderDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Order Details</CardTitle>
        <CardDescription>PO Number: {poDetails.poNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="text-muted-foreground">Order Date</Label>
            <p className="font-medium">{poDetails.orderDate}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Customer Number</Label>
            <p className="font-medium">{poDetails.customerNumber}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Customer Name</Label>
            <p className="font-medium">{poDetails.customerName}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label className="text-muted-foreground">Customer Address</Label>
            <p className="font-medium">{poDetails.customerAddress}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Currency</Label>
            <p className="font-medium">{poDetails.currencyCode}</p>
          </div>
          {poDetails.salesperson && (
            <div>
              <Label className="text-muted-foreground">Salesperson</Label>
              <p className="font-medium">{poDetails.salesperson}</p>
            </div>
          )}
          {poDetails.requestedDeliveryDate && (
            <div>
              <Label className="text-muted-foreground">Delivery Date</Label>
              <p className="font-medium">{poDetails.requestedDeliveryDate}</p>
            </div>
          )}
          {poDetails.paymentTerms && (
            <div>
              <Label className="text-muted-foreground">Payment Terms</Label>
              <p className="font-medium">{poDetails.paymentTerms}</p>
            </div>
          )}
          {poDetails.shipmentMethod && (
            <div>
              <Label className="text-muted-foreground">Shipment Method</Label>
              <p className="font-medium">{poDetails.shipmentMethod}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
