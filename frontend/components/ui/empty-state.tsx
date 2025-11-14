import React from "react";
import {View, type ViewProps} from "react-native";
import {Text} from "@/components/ui/text";
import {cn} from "@/lib/utils";
import {AlertCircle, Users, Calendar, Search} from "lucide-react-native";

interface EmptyStateProps extends ViewProps {
  title: string;
  description?: string;
  icon?: "alert" | "users" | "calendar" | "search" | "none";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const icons = {
  alert: AlertCircle,
  users: Users,
  calendar: Calendar,
  search: Search,
  none: null
};

const iconSizes = {
  sm: 24,
  md: 32,
  lg: 48
};

const EmptyState = React.forwardRef<View, EmptyStateProps>(
  ({className, title, description, icon = "alert", size = "md", ...props}, ref) => {
    const IconComponent = icons[icon];
    const iconSize = iconSizes[size];

    return (
      <View
        ref={ref}
        className={cn(
          "flex-1 items-center justify-center py-12",
          className
        )}
        {...props}
      >
        {IconComponent && (
          <IconComponent
            size={iconSize}
            className="text-muted-foreground mb-4"
          />
        )}

        <Text className="text-lg font-medium text-foreground text-center mb-2">
          {title}
        </Text>

        {description && (
          <Text className="text-sm text-muted-foreground text-center max-w-xs">
            {description}
          </Text>
        )}
      </View>
    );
  }
);

EmptyState.displayName = "EmptyState";

export {EmptyState};
export type {EmptyStateProps};