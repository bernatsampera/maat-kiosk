import * as React from "react";
import {Platform, View, type ViewProps, type ViewStyle} from "react-native";

interface AspectRatioProps extends ViewProps {
  ratio?: number;
}

const AspectRatio = React.forwardRef<View, AspectRatioProps>(
  ({className, ratio = 16 / 9, style, ...props}, ref) => {
    const aspectRatioStyle: ViewStyle = {
      aspectRatio: ratio,
    };

    return (
      <View
        ref={ref}
        style={[aspectRatioStyle, style]}
        className={className}
        {...props}
      />
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export {AspectRatio};