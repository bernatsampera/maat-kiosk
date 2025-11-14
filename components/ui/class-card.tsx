import React from "react";
import {TouchableOpacity, View, type ViewProps} from "react-native";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar} from "@/components/ui/avatar-custom";
import {Badge} from "@/components/ui/badge";
import {Text} from "@/components/ui/text";
import {Users, User} from "lucide-react-native";
import {cn} from "@/lib/utils";
import {ClassData} from "@/lib/mockData";

interface ClassCardProps extends ViewProps {
  classData: ClassData;
  onPress?: () => void;
  isSelected?: boolean;
  isCheckedIn?: boolean;
  size?: "sm" | "md" | "lg";
  showInstructor?: boolean;
  showAvatar?: boolean;
  className?: string;
}

const ClassCard = React.forwardRef<View, ClassCardProps>(
  (
    {
      className,
      classData,
      onPress,
      isSelected = false,
      isCheckedIn = false,
      size = "md",
      showInstructor = true,
      showAvatar = true,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-32",
      md: "h-42",
      lg: "h-48"
    };

    const cardClassName = cn(
      sizeClasses[size],
      isSelected && "border-primary border-2",
      isCheckedIn && "border-green-200 bg-green-50",
      className
    );

    const CardComponent = onPress ? TouchableOpacity : View;

    return (
      <CardComponent
        onPress={onPress}
        disabled={!onPress}
        className={cardClassName}
      >
        <Card ref={ref} {...props}>
          <CardContent className="p-4">
            <View className="flex-row items-center gap-3 mb-3">
              {showAvatar && (
                <Avatar
                  source={
                    classData.instructor.avatar
                      ? {uri: classData.instructor.avatar}
                      : undefined
                  }
                  fallback={classData.instructor.initials}
                  size="sm"
                />
              )}

              <View className="flex-1">
                <Text
                  className="font-medium text-foreground text-sm"
                  numberOfLines={1}
                >
                  {classData.name}
                </Text>

                <View className="flex-row items-center gap-2 mt-0.5">
                  <User size={12} className="text-muted-foreground" />
                  <Text className="text-xs text-muted-foreground">
                    {classData.time}—{classData.endTime}h
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-1.5 mb-3">
              {classData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tag.toLowerCase() as any}
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Users size={14} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">
                  {classData.attendees.length}/{classData.maxAttendees}
                </Text>
              </View>

              {showInstructor && (
                <Text className="text-xs text-muted-foreground">
                  {classData.instructor.name}
                </Text>
              )}
            </View>

            {isCheckedIn && (
              <View className="mt-2">
                <Text className="text-xs text-green-600 font-medium">
                  ✓ Checked in
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </CardComponent>
    );
  }
);

ClassCard.displayName = "ClassCard";

export {ClassCard};
export type {ClassCardProps};
