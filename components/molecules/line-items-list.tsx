interface LineItem {
  json: {
    itemNo?: string
    code?: string
    itemDescription?: string
    poItemNumber?: string
    quantity?: number
    unitprice?: number
    unitOfMeasureCode?: string
    shipmentDate?: string
  }
}

interface LineItemsListProps {
  lineItems: LineItem[]
}

export function LineItemsList({ lineItems }: LineItemsListProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-foreground">Line Items</h4>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
        <div className="space-y-2">
          {lineItems.map((line, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-4 p-3 bg-white dark:bg-blue-900/20 rounded-md border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600 transition-colors duration-200 shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Item:</span>
                <span className="text-sm text-foreground font-medium">{line.json.itemNo || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Code:</span>
                <span className="text-sm text-foreground">{line.json.code || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Description:</span>
                <span className="text-sm text-foreground truncate max-w-48" title={line.json.itemDescription}>
                  {line.json.itemDescription || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">PO#:</span>
                <span className="text-sm text-foreground">{line.json.poItemNumber || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Qty:</span>
                <span className="text-sm text-foreground font-medium">{line.json.quantity || "0"}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Price:</span>
                <span className="text-sm text-foreground font-medium">{line.json.unitprice || "0"}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">UOM:</span>
                <span className="text-sm text-foreground">{line.json.unitOfMeasureCode || "N/A"}</span>
              </div>

              {line.json.shipmentDate && (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Ship:</span>
                  <span className="text-sm text-foreground">{line.json.shipmentDate}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
