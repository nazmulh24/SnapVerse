# NavigationComponent

This module contains all navigation-related components for the SnapVerse application, providing both mobile and desktop navigation experiences.

## 📁 File Structure

```
NavigationComponent/
├── index.js                  # Barrel exports for easy imports
├── MobileNavigation.jsx      # Mobile bottom navigation
├── DesktopNavigation.jsx     # Desktop sidebar navigation
├── NavigationSection.jsx     # Reusable navigation section component
├── navigationData.js         # Navigation items configuration
└── README.md                 # This documentation
```

## 🧩 Components

### NavigationItems (Main Component)

- **Purpose**: Routes between mobile and desktop navigation
- **Props**: `isMobile`, `onSearchClick`
- **Usage**: Primary entry point for all navigation

### MobileNavigation

- **Purpose**: Bottom navigation for mobile devices
- **Features**: 4 primary navigation items + search button
- **Responsive**: Only visible on screens < 640px

### DesktopNavigation

- **Purpose**: Sidebar navigation for desktop/tablet
- **Features**: Collapsible sections, professional layout
- **Responsive**: Visible on screens ≥ 640px

### NavigationSection

- **Purpose**: Reusable component for navigation sections
- **Features**:
  - Collapsible sections with expand/collapse icons
  - Badge support for notifications
  - PRO labels for premium features
  - Active state styling

## 📊 Navigation Data

### Primary Items (Always Visible)

- Home, Create, Messages, Friends, Reels, Monetization, Account

### Discover Section (Collapsible)

- Explore, Notifications, Saved, Trending, Events, Groups, Business, Creator Studio

### Business Tools (Collapsible)

- Analytics, Insights, Ads Manager, Shop

### More Section (Collapsible)

- Settings, Privacy, Security, Help Center, Feedback, About

## 🎨 Features

### Professional Features

- **Badge System**: Notification counts on relevant items
- **PRO Labels**: Premium feature indicators
- **Collapsible Sections**: Space-efficient organization
- **Active States**: Visual feedback for current page

### Responsive Design

- **Mobile**: Clean bottom navigation (5 items)
- **Desktop**: Full sidebar with categorized sections
- **Consistent**: Same data source for both layouts

## 🔧 Usage

### Basic Import

```jsx
import { NavigationItems } from "../NavigationComponent";

// Use in component
<NavigationItems isMobile={false} onSearchClick={handleSearch} />;
```

### Individual Components

```jsx
import {
  MobileNavigation,
  DesktopNavigation,
  NavigationSection,
} from "../NavigationComponent";
```

### Data Access

```jsx
import {
  primaryItems,
  discoverItems,
  navigationSections,
} from "../NavigationComponent";
```

## 🔄 Customization

### Adding New Navigation Items

1. Update `navigationData.js` with new items
2. Add corresponding route in `AppRoutes.jsx`
3. Icons are automatically handled by the data structure

### Modifying Sections

1. Edit `navigationSections` array in `navigationData.js`
2. Components automatically reflect changes
3. No component file modifications needed

### Styling Updates

1. NavigationSection.jsx handles all item styling
2. Consistent design across all sections
3. Tailwind classes for easy customization

## 🎯 Benefits

- **Modularity**: Each component has single responsibility
- **Maintainability**: Easy to modify and extend
- **Consistency**: Shared data and styling
- **Performance**: Only imports what's needed
- **Scalability**: Easy to add new sections/items
