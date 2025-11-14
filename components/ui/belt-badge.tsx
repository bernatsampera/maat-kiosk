import React from "react";
import {View, type ViewProps} from "react-native";
import {Text} from "@/components/ui/text";
import {cn} from "@/lib/utils";

const beltColors = {
  white: "bg-gray-400 text-white",
  blue: "bg-blue-400 text-white",
  purple: "bg-purple-400 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white"
};

type BeltColor = keyof typeof beltColors;

interface BeltBadgeProps extends ViewProps {
  belt: BeltColor;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const BeltBadge = React.forwardRef<View, BeltBadgeProps>(
  ({className, belt, showText = true, size = "md", ...props}, ref) => {
    const sizeClasses = {
      sm: "px-2 py-1",
      md: "px-3 py-1.5",
      lg: "px-4 py-2"
    };

    const textSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    };

    const beltColorClass = beltColors[belt] || beltColors.white;

    if (!showText) {
      return (
        <View
          ref={ref}
          className={cn(
            "rounded-full",
            beltColorClass,
            size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <View
        ref={ref}
        className={cn(
          "rounded-md items-center justify-center",
          beltColorClass,
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <Text className={cn("font-medium capitalize", textSizeClasses[size])}>
          {belt}
        </Text>
      </View>
    );
  }
);

BeltBadge.displayName = "BeltBadge";

export {BeltBadge, beltColors};
export type {BeltBadgeProps, BeltColor};