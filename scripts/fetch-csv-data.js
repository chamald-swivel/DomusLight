// Script to fetch and analyze the CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exportdata_CSV-Y7XVZNOqsmWLZ1I7WPZUbF6nyWZM06.csv"

async function fetchAndAnalyzeCSV() {
  try {
    console.log("[v0] Fetching CSV data from:", csvUrl)

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("[v0] CSV data fetched successfully")
    console.log("[v0] First 500 characters:", csvText.substring(0, 500))

    // Parse CSV manually (simple approach)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("[v0] Headers found:", headers)
    console.log("[v0] Total rows:", lines.length - 1)

    // Parse a few sample rows
    const sampleRows = []
    for (let i = 1; i <= Math.min(5, lines.length - 1); i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i])
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        sampleRows.push(row)
      }
    }

    console.log("[v0] Sample rows:", JSON.stringify(sampleRows, null, 2))

    return { headers, sampleRows, totalRows: lines.length - 1 }
  } catch (error) {
    console.error("[v0] Error fetching CSV:", error)
    return null
  }
}

// Simple CSV line parser that handles quoted fields
function parseCSVLine(line) {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// Run the analysis
fetchAndAnalyzeCSV().then((result) => {
  if (result) {
    console.log("[v0] Analysis complete!")
  }
})
