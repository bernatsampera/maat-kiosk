// components/ThemedText.tsx

import {Text as DefaultText, StyleSheet, TextProps} from "react-native";

// Define a type for our custom props
type ThemedTextProps = TextProps & {
  type?: "default" | "bold" | "semibold" | "light" | "medium"; // Add other weights as needed
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  // Determine the fontFamily based on the 'type' prop
  const getFontFamily = () => {
    switch (type) {
      case "bold":
        return styles.bold;
      case "semibold":
        return styles.semibold;
      case "medium":
        return styles.medium;
      case "light":
        return styles.light;
      default:
        return styles.default;
    }
  };

  return <DefaultText style={[getFontFamily(), style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Geist-Regular"
  },
  bold: {
    fontFamily: "Geist-Bold"
  },
  semibold: {
    fontFamily: "Geist-SemiBold"
  },
  medium: {
    fontFamily: "Geist-Medium"
  },
  light: {
    fontFamily: "Geist-Light"
  }
  // Add other styles for Thin, ExtraBold, etc. here
});
