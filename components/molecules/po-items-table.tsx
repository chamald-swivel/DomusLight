import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PODetails } from "@/lib/po-extraction-service"

interface POItemsTableProps {
  poDetails: PODetails
}

export function POItemsTable({ poDetails }: POItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
        <CardDescription>{poDetails.orderItems.length} item(s) in this order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item No</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>PO Item No</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Shipment Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poDetails.orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.itemNo}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.itemDescription}</p>
                      {item.poDescription && <p className="text-sm text-muted-foreground">{item.poDescription}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{item.poItemNumber}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {poDetails.currencyCode} {item.unitprice.toFixed(2)}
                  </TableCell>
                  <TableCell>{item.unitOfMeasureCode}</TableCell>
                  <TableCell>{item.shipmentDate}</TableCell>
                  <TableCell className="text-right font-medium">
                    {poDetails.currencyCode} {(item.quantity * item.unitprice).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
