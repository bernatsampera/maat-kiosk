import {cn} from "@/lib/utils";
import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";
import {Platform, View, type ViewProps} from "react-native";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-orange-200 bg-orange-50 text-orange-800 [&>svg]:text-orange-800",
        info: "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-800",
        success: "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<View, ViewProps & VariantProps<typeof alertVariants>>(
  ({className, variant, ...props}, ref) => (
    <View
      ref={ref}
      role="alert"
      className={cn(alertVariants({variant}), className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<View, ViewProps>(
  ({className, ...props}, ref) => (
    <View
      ref={ref}
      className={cn(
        "mb-1 font-medium leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<View, ViewProps>(
  ({className, ...props}, ref) => (
    <View
      ref={ref}
      className={cn("text-sm leading-relaxed", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

export {Alert, AlertTitle, AlertDescription};