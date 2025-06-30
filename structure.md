# Project Structure

## Root Directory
```
/
├── public/               # Static assets served as-is
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── AddSiteModal.tsx    # Modal for adding new sites
│   │   └── SiteCard.tsx        # Card component for displaying site info
│   ├── store/          # State management
│   │   └── siteStore.ts        # Zustand store for site management
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts            # Shared type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   ├── index.css       # Global styles and Tailwind imports
│   └── vite-env.d.ts   # Vite environment type definitions
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration for Tailwind
├── README.md           # Project documentation
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── tsconfig.app.json   # App-specific TypeScript config
├── tsconfig.node.json  # Node-specific TypeScript config
└── vite.config.ts      # Vite build configuration
```

## Key Directories and Files

### `/src`
The main source code directory containing all application logic.

#### `/src/components`
React components that make up the UI:
- `AddSiteModal.tsx`: Modal component for adding new sites
- `SiteCard.tsx`: Card component for displaying individual site information

#### `/src/store`
State management using Zustand:
- `siteStore.ts`: Global store managing site data and operations

#### `/src/types`
TypeScript type definitions:
- `index.ts`: Shared interfaces and types (Site, SiteStats)

### Configuration Files
- `package.json`: Project metadata and dependencies
- `vite.config.ts`: Vite bundler configuration
- `tailwind.config.js`: Tailwind CSS customization
- `postcss.config.js`: PostCSS plugins configuration
- `tsconfig.json`: TypeScript compiler configuration

## Component Structure

### AddSiteModal
```typescript
interface AddSiteModalProps {
  onAdd: (name: string, type: 'node' | 'static', path: string) => void;
}
```
Modal component for adding new sites with form validation and type selection.

### SiteCard
```typescript
interface SiteCardProps {
  site: Site;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}
```
Card component displaying site information with status indicators and control buttons.

## State Management

### Site Store
```typescript
interface SiteStore {
  sites: Site[];
  addSite: (site: Site) => void;
  removeSite: (id: string) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
}
```
Global store managing site data with CRUD operations.

## Type Definitions

### Site Interface
```typescript
interface Site {
  id: string;
  name: string;
  port: number;
  status: 'running' | 'stopped' | 'error';
  path: string;
  type: 'node' | 'static';
  createdAt: string;
  updatedAt: string;
}
```

### SiteStats Interface
```typescript
interface SiteStats {
  id: string;
  siteId: string;
  uptime: number;
  lastChecked: string;
  responseTime: number;
}
```

## Build and Development

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint for code quality

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Zustand for state management