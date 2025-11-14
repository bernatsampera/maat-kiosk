# Maat Kiosk Frontend

A simple React Native kiosk application built with Expo and NativeWind for styling.

## Project Structure

```
frontend/
├── components/            # Reusable UI components
│   ├── Home.tsx          # Home screen component
│   └── index.ts          # Component exports
├── App.tsx               # Main app component
├── global.css            # Global Tailwind styles
└── index.ts              # Expo registration
```

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platforms:
```bash
npm run android    # For Android
npm run ios        # For iOS
npm run web        # For web
```

## Basic Usage

### Using Components

Import components from the components directory:

```tsx
import { Home } from './components';

// Use in your app
<Home />
```

### Styling with NativeWind

The app uses NativeWind for Tailwind CSS-like styling:

```tsx
import { Text, View } from "react-native";

export default function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Hello World
      </Text>
    </View>
  );
}
```

### Adding New Components

1. Create a new component file in `components/`
2. Export it from `components/index.ts`
3. Import and use it in your app

Example:
```tsx
// components/MyComponent.tsx
import { Text, View } from "react-native";

export default function MyComponent() {
  return (
    <View className="p-4">
      <Text>My Component</Text>
    </View>
  );
}

// components/index.ts - Add export
export { default as MyComponent } from './MyComponent';

// App.tsx - Import and use
import { MyComponent } from './components';
```

## Available Scripts

- `npm start` - Start development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## Main Dependencies

- **expo** - React Native framework
- **nativewind** - Tailwind CSS for React Native
- **react-native** - Core React Native library