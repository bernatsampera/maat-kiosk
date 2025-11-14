import React from "react";
import {TouchableOpacity, View, type ViewProps} from "react-native";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar} from "@/components/ui/avatar-custom";
import {BeltBadge} from "@/components/ui/belt-badge";
import {Text} from "@/components/ui/text";
import {CheckCircle} from "lucide-react-native";
import {cn} from "@/lib/utils";
import {Member} from "@/lib/mockData";

interface MemberItemProps extends ViewProps {
  member: Member;
  onPress?: () => void;
  showBelt?: boolean;
  showAvatar?: boolean;
  isCheckedIn?: boolean;
  size?: "sm" | "md" | "lg";
  rightComponent?: React.ReactNode;
  className?: string;
}

const MemberItem = React.forwardRef<View, MemberItemProps>(
  (
    {
      className,
      member,
      onPress,
      showBelt = true,
      showAvatar = false,
      isCheckedIn = false,
      size = "md",
      rightComponent,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "p-3",
      md: "p-4",
      lg: "p-5"
    };

    const textSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    };

    const CardComponent = onPress ? TouchableOpacity : View;

    return (
      <CardComponent onPress={onPress} disabled={!onPress}>
        <Card className="mb-3" ref={ref} {...props}>
          <CardContent className={cn(sizeClasses[size], className)}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                {showAvatar && (
                  <Avatar
                    size={size}
                    fallback={member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    className="bg-primary"
                  />
                )}

                <View className="flex-1">
                  <Text
                    className={cn(
                      "font-medium text-foreground",
                      textSizeClasses[size]
                    )}
                  >
                    {member.name}
                  </Text>

                  {showBelt && (
                    <View className="mt-1">
                      <BeltBadge belt={member.belt} size="sm" />
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                {isCheckedIn && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
                {rightComponent}
              </View>
            </View>
          </CardContent>
        </Card>
      </CardComponent>
    );
  }
);

MemberItem.displayName = "MemberItem";

export {MemberItem};
export type {MemberItemProps};
