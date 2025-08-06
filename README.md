# Layer8 Integration Framework - Technical Challenge

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Appication served on `http://localhost:5173`

## Project Structure

### Pages

- **`/pages`** - Main application pages and route components
  - `Dashboard.tsx` - Overview of integrations with filtering and management
  - `Configuration.tsx` - Create new and update current integrations
  - `SyncActivity.tsx` - Table view of sync activity

### Components

- **`/components/dashboard`** - Dashboard-specific components (integration cards, stats)
- **`/components/configuration`** - Configuration form components
- **`/components/sync-activity`** - Data table and sync-related components
- **`/components/shadcn-shared`** - Shared UI components (sidebar, navigation, data tables)
- **`/components/ui`** - Base shadcn/ui component library

### API & Data

- **`/lib`** - Core application logic and data layer
  - `db.ts` - Data, schemas and type definitions
  - `mock-api.ts` - Mock API functions for demo purposes
  - `utils.ts` - Shadcn utility functions and helpers

## Technology Stack

### UI Framework

- **shadcn/ui** - Primary component library
  - **Why**: Free and open source (FOSS)
  - **Why**: Modern, accessible design system
  - **Why**: Full source code provided for customization
  - **Why**: Built on Radix UI primitives for accessibility

### Styling

- **Tailwind CSS** - Utility-first CSS framework
  - **Why**: Required prerequisite for shadcn/ui
  - **Why**: Consistent design system enforcement

### Core Stack

- **React** with TypeScript
- **React Router** for client-side navigation
- **React Hook Form** for form handling

## Assumptions

### Database Schema

The application's data structure and schema are derived from the mock database definitions in `/lib/db.ts`. The `I_Integration` interface serves as the primary data model, based upon the brief given. No new data models created.
