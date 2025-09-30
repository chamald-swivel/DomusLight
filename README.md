# Purchase Order Dashboard

A modern, responsive dashboard for managing and viewing purchase orders with advanced error detection and line item analysis. Built with Next.js 14, TypeScript, and Tailwind CSS following Atomic Design principles.

## Features

- **Purchase Order Management**: View and manage purchase orders with detailed information
- **Error Detection**: Automatic identification of ambiguous line items and data inconsistencies
- **Responsive Design**: Mobile-first design that works across all device sizes
- **Real-time Metrics**: Dashboard showing total entries, error counts, and processing status
- **Advanced Filtering**: Error items are automatically sorted to the top for priority handling
- **Detailed Line Items**: Comprehensive view of individual line items with pricing and shipping information
- **Atomic Design Architecture**: Modular, reusable components following atomic design principles

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Database**: Supabase (configured)
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with font configuration
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── atoms/               # Basic building blocks
│   │   ├── field-display.tsx    # Reusable label-value display
│   │   ├── metric-card.tsx      # Dashboard metric cards
│   │   └── status-badge.tsx     # Status indicators
│   ├── molecules/           # Component combinations
│   │   ├── error-details.tsx        # Error information display
│   │   ├── line-items-list.tsx      # Line items table
│   │   ├── purchase-order-card.tsx  # Main PO card component
│   │   └── sales-order-details.tsx  # Sales order information
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── mock-purchase-orders.ts      # Sample data
│   ├── purchase-order-service.ts    # Data types and utilities
│   ├── supabase.ts                  # Database configuration
│   └── utils.ts                     # Utility functions
└── scripts/
    └── fetch-csv-data.js            # Data processing script
\`\`\`

## Atomic Design Architecture

This project follows the Atomic Design methodology:

### Atoms
- **MetricCard**: Displays individual dashboard metrics
- **StatusBadge**: Shows error/success status with icons
- **FieldDisplay**: Reusable component for label-value pairs

### Molecules
- **PurchaseOrderCard**: Main card orchestrating PO display
- **SalesOrderDetails**: Structured sales order information
- **LineItemsList**: Line items display with highlighting
- **ErrorDetails**: Consistent error information formatting

## Data Schema

\`\`\`typescript
interface PurchaseOrder {
  pdfName: string
  poNumber: string
  finalLinesOutput: Array<{
    json: LineItem
    pairedItem: string | null
  }>
  finalSOHeaderOutput: {
    customerName: string
    customerNumber: string
    orderDate: string
    address: string
    city: string
    amountExTax: string
    taxAmount: string
  }
  created_at: string
}
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd purchase-order-dashboard
\`\`\`

2. Install dependencies: npm run install

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure Supabase (optional):
   - Add your Supabase URL and anon key to `.env.local`
   - Run the database setup script if needed

### Development

Start the development server: npm run dev

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.


## Usage

### Dashboard Overview
- View total entries, error counts, and last update time
- Purchase orders with errors are automatically sorted to the top
- Click on any purchase order card to expand detailed information

### Purchase Order Details
- **Sales Order Details**: Customer information, order dates, and financial totals
- **Line Items**: Individual product lines with quantities, prices, and shipping dates
- **Error Details**: User-friendly error descriptions for problematic items

### Error Handling
- Ambiguous line items are automatically detected
- Error messages exclude undefined fields for cleaner display
- Visual indicators highlight problematic orders

## Customization

### Design Tokens
Modify design tokens in `app/globals.css`:
\`\`\`css
@theme inline {
  --color-primary: #your-color;
  --font-sans: var(--font-geist-sans);
}
\`\`\`

### Adding New Components
Follow the atomic design pattern:
1. Create atoms in `components/atoms/`
2. Combine atoms into molecules in `components/molecules/`
3. Use TypeScript interfaces for props
4. Include proper accessibility attributes

## Contributing

1. Follow the existing code style and atomic design patterns
2. Add TypeScript types for all new components
3. Include proper error handling
4. Test responsive design across device sizes
5. Update documentation for new features

## License

This project is private and proprietary.
