import {cn} from "@/lib/utils";
import {cva, type VariantProps} from "class-variance-authority";
import {Text} from "@/components/ui/text";
import * as React from "react";
import {Image, Platform, View, type ViewProps, type ImageProps} from "react-native";

const avatarVariants = cva(
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type AvatarProps = ViewProps &
  VariantProps<typeof avatarVariants> & {
    source?: ImageProps["source"];
    alt?: string;
    fallback?: string;
  };

const Avatar = React.forwardRef<View, AvatarProps>(
  ({className, size, source, alt, fallback, ...props}, ref) => {
    const [hasError, setHasError] = React.useState(false);

    if (source && !hasError) {
      return (
        <View
          ref={ref}
          className={cn(avatarVariants({size}), className)}
          {...props}
        >
          <Image
            source={source}
            alt={alt}
            className="h-full w-full"
            onError={() => setHasError(true)}
          />
        </View>
      );
    }

    return (
      <View
        ref={ref}
        className={cn(
          avatarVariants({size}),
          "bg-muted flex items-center justify-center",
          className
        )}
        {...props}
      >
        <Text className="text-lg font-medium text-muted-foreground uppercase">
          {fallback || "U"}
        </Text>
      </View>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<any, ImageProps>(
  ({className, ...props}, ref) => (
    <Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<View, ViewProps>(
  ({className, children, ...props}, ref) => (
    <View
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <Text className="text-sm font-medium text-muted-foreground">
        {children}
      </Text>
    </View>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export {Avatar, AvatarImage, AvatarFallback};
export type {AvatarProps};