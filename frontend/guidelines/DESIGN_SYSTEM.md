# MAAT Kiosk Design System

## 🎯 Overview

This design system provides a comprehensive guide for building consistent, kiosk-first user interfaces for the MAAT gym management application. It focuses on creating large, tappable targets, clear visual hierarchy, and consistent patterns that work well in a physical kiosk environment.

## 🎨 Color Palette

### Primary Colors
- **Primary**: `hsl(var(--primary))` - Main action buttons and primary CTAs
- **Primary Foreground**: `hsl(var(--primary-foreground))` - Text on primary elements

### Supporting Colors
- **Secondary**: `hsl(var(--secondary))` - Secondary actions and less prominent elements
- **Destructive**: `hsl(var(--destructive))` - Delete/remove actions
- **Success**: Used for checked-in states and successful actions

### Neutral Colors
- **Background**: `hsl(var(--background))` - Main screen background
- **Card**: `hsl(var(--card))` - Card backgrounds
- **Foreground**: `hsl(var(--foreground))` - Primary text color
- **Muted**: `hsl(var(--muted))` - Secondary text and subtle elements
- **Border**: `hsl(var(--border))` - Borders and dividers

### Belt Colors (BJJ Specific)
- **White**: `bg-gray-400 text-white`
- **Blue**: `bg-blue-400 text-white`
- **Purple**: `bg-purple-400 text-white`
- **Brown**: `bg-amber-800 text-white`
- **Black**: `bg-gray-900 text-white`

## 📏 Typography

### Font Hierarchy
- **Screen Titles**: `text-2xl font-bold` - Main screen headings
- **Card Titles**: `text-lg font-medium` - Main card headings
- **Section Headers**: `text-base font-bold` - Section dividers
- **Body Text**: `text-sm text-foreground` - Regular content
- **Supporting Text**: `text-xs text-muted-foreground` - Metadata and descriptions
- **Button Text**: `text-sm font-medium` - All button text

### Font Family
- **Primary**: Geist (loaded via expo-font)
- **Fallback**: System fonts

## 🎯 Spacing System

### Container Spacing
- **Screen Padding**: `p-6` (24px) - Main content areas
- **Section Padding**: `p-4` (16px) - Cards and sections
- **Card Content**: `p-4` (16px) - Inside cards

### Gap Spacing
- **Large Gaps**: `gap-6` (24px) - Between major sections
- **Medium Gaps**: `gap-4` (16px) - Between elements in a section
- **Small Gaps**: `gap-2` (8px) - Between related items
- **Tiny Gaps**: `gap-1` (4px) - Between tightly packed elements

### Margin Spacing
- **Bottom Margins**: `mb-4` (16px) for standard spacing
- **Large Bottom Margins**: `mb-6` (24px) for section separation

## 🎪 Components

### BeltBadge
Standardized belt color display.

**Props:**
- `belt: BeltColor` - Belt color (white, blue, purple, brown, black)
- `showText?: boolean` - Show text or just color dot
- `size?: "sm" | "md" | "lg"` - Badge size

**Usage:**
```tsx
<BeltBadge belt="blue" size="sm" showText={true} />
```

### ClassCard
Consistent class display across all screens.

**Props:**
- `classData: ClassData` - Class information
- `onPress?: () => void` - Click handler
- `isSelected?: boolean` - Selection state
- `isCheckedIn?: boolean` - Check-in state
- `size?: "sm" | "md" | "lg"` - Card size
- `showInstructor?: boolean` - Show instructor info
- `showAvatar?: boolean` - Show instructor avatar

**Usage:**
```tsx
<ClassCard
  classData={item}
  onPress={() => navigateToClass(item.id)}
  size="md"
  showInstructor={true}
/>
```

### MemberItem
Standardized member display component.

**Props:**
- `member: Member` - Member information
- `onPress?: () => void` - Click handler
- `showBelt?: boolean` - Show belt color
- `showAvatar?: boolean` - Show member avatar
- `isCheckedIn?: boolean` - Check-in state
- `size?: "sm" | "md" | "lg"` - Item size
- `rightComponent?: React.ReactNode` - Additional right-side content

**Usage:**
```tsx
<MemberItem
  member={member}
  onPress={() => navigateToMember(member.id)}
  showBelt={true}
  size="md"
/>
```

### EmptyState
Consistent empty state display.

**Props:**
- `title: string` - Empty state title
- `description?: string` - Optional description
- `icon?: "alert" | "users" | "calendar" | "search" | "none"` - Icon type
- `size?: "sm" | "md" | "lg"` - Overall size

**Usage:**
```tsx
<EmptyState
  title="No classes available today"
  description="Check back tomorrow for the schedule"
  icon="calendar"
  size="md"
/>
```

## 🎭 States

### Loading States
- Use skeleton loaders or shimmer effects
- Maintain layout consistency during loading
- Show loading indicators for async operations

### Empty States
- Use EmptyState component consistently
- Provide clear, helpful messaging
- Include appropriate icons
- Suggest next actions when possible

### Error States
- Use Alert components for error messages
- Provide clear error descriptions
- Offer retry or recovery actions
- Maintain consistent error styling

### Success States
- Use green color indicators
- Show checkmarks for completed actions
- Provide confirmation messages
- Auto-reset where appropriate

## 🎮 Kiosk-Specific Guidelines

### Touch Targets
- **Minimum Size**: 44px × 44px for all tappable elements
- **Recommended Size**: 48px × 48px or larger
- **Spacing**: Minimum 8px between tappable elements

### Visual Feedback
- **Press States**: Use `active:` variants for press feedback
- **Disabled States**: Use opacity-50 and disable interactions
- **Loading States**: Show clear loading indicators
- **Selection States**: Use border-primary for selected items

### Accessibility
- **Color Contrast**: Ensure 4.5:1 contrast ratio for text
- **Focus States**: Clear focus indicators for keyboard navigation
- **Screen Readers**: Proper accessibility labels and hints
- **Reduced Motion**: Respect user motion preferences

### Layout Guidelines
- **Safe Areas**: Account for device bezels and rounded corners
- **Orientation**: Support both portrait and landscape orientations
- **Text Scaling**: Support dynamic type scaling
- **High Contrast**: Support high contrast mode

## 🎨 Patterns

### Navigation
- **Back Navigation**: Use consistent back button patterns
- **Tab Navigation**: Clear visual indication of current tab
- **Drill-Down**: Maintain clear navigation hierarchy

### Forms
- **Input Fields**: Large touch targets, clear labels
- **Validation**: Real-time validation feedback
- **Submission**: Clear loading and success states

### Lists
- **Standard Spacing**: 16px between list items
- **Separators**: Use borders for visual separation
- **Empty States**: Consistent empty state handling

### Cards
- **Consistent Shadow**: `shadow-sm shadow-foreground/10`
- **Rounded Corners**: `rounded-lg` (10px)
- **Padding**: Standard `p-4` for content
- **Borders**: `border border-border` for definition

## 🎯 Best Practices

### Performance
- **Memoization**: Use React.memo for frequently re-rendered components
- **Optimized Lists**: Use FlatList with proper keyExtractor
- **Image Loading**: Proper image loading and caching
- **Bundle Size**: Import only what's needed

### User Experience
- **Auto-Reset**: Automatically reset forms and filters
- **Clear Feedback**: Provide immediate visual feedback
- **Error Recovery**: Graceful error handling and recovery
- **Consistency**: Maintain consistent patterns throughout

### Code Organization
- **Component Composition**: Build complex components from simple ones
- **Prop Typing**: Use TypeScript for type safety
- **Documentation**: Document component props and usage
- **Testing**: Test components across different screen sizes

## 🔄 Migration Guide

When updating existing components to use this design system:

1. **Standardize Cards**: Use consistent Card patterns
2. **Consolidate Belt Logic**: Use BeltBadge component
3. **Unify Empty States**: Use EmptyState component
4. **Standardize Lists**: Use consistent spacing and patterns
5. **Update Typography**: Follow the typography hierarchy
6. **Apply Color System**: Use design system color tokens

## 📚 Resources

- **Component Library**: `/components/ui/`
- **App Screens**: `/app/`
- **Color Tokens**: `global.css` and `tailwind.config.js`
- **Typography**: Geist font family
- **Icons**: Lucide React Native