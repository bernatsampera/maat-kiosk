import React from "react";
import {View, TouchableOpacity, type ViewProps} from "react-native";
import {Text} from "@/components/ui/text";
import {ArrowLeft} from "lucide-react-native";
import {cn} from "@/lib/utils";

interface AppHeaderProps extends ViewProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const AppHeader = React.forwardRef<View, AppHeaderProps>(
  ({className, title, showBackButton = false, onBackPress, rightComponent, ...props}, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "flex-row items-center p-6 border-b border-border bg-background",
          className
        )}
        {...props}
      >
        {showBackButton && (
          <TouchableOpacity
            onPress={onBackPress}
            className="mr-4 p-2 -ml-2"
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <ArrowLeft size={24} className="text-foreground" />
          </TouchableOpacity>
        )}

        <View className="flex-1">
          <Text className="text-2xl font-bold text-foreground">
            {title}
          </Text>
        </View>

        {rightComponent && (
          <View className="ml-4">
            {rightComponent}
          </View>
        )}
      </View>
    );
  }
);

AppHeader.displayName = "AppHeader";

export {AppHeader};
export type {AppHeaderProps};