import {TextClassContext} from "@/components/ui/text";
import {cn} from "@/lib/utils";
import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";
import {Platform, View, type ViewProps} from "react-native";

const badgeVariants = cva(
  "flex-row items-center justify-center rounded-md px-2 py-1 text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border text-foreground",
        success: "bg-green-100 text-green-800",
        kids: "bg-pink-100 text-pink-800",
        yoga: "bg-blue-100 text-blue-800",
        mma: "bg-orange-100 text-orange-800",
        bjj: "bg-green-100 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeTextVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      success: "text-green-800",
      kids: "text-pink-800",
      yoga: "text-blue-800",
      mma: "text-orange-800",
      bjj: "text-green-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = ViewProps &
  VariantProps<typeof badgeVariants> & {
    textClass?: string;
  };

const Badge = React.forwardRef<View, BadgeProps>(
  ({className, variant, textClass, children, ...props}, ref) => {
    return (
      <TextClassContext.Provider value={badgeTextVariants({variant})}>
        <View
          ref={ref}
          className={cn(badgeVariants({variant}), className)}
          {...props}
        >
          {children}
        </View>
      </TextClassContext.Provider>
    );
  }
);

Badge.displayName = "Badge";

export {Badge, badgeVariants};
export type {BadgeProps};