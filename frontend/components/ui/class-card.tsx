import {Avatar} from "@/components/ui/avatar-custom";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Text} from "@/components/ui/text";
import {cn} from "@/lib/utils";
import {ClassData} from "@/types/gym";
import {User, Users} from "lucide-react-native";
import React from "react";
import {TouchableOpacity, View, type ViewProps} from "react-native";

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
      isCheckedIn && "border-primary bg-green-50 border-2",
      className
    );

    const CardComponent = onPress ? TouchableOpacity : View;

    return (
      <CardComponent onPress={onPress} disabled={!onPress} className="flex-1">
        <Card ref={ref} {...props} className={cardClassName}>
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
                  size="xs"
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
                  <Text className="text-xs text-muted-foreground">
                    {classData.time}—{classData.endTime}h
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-1.5 mt-0.5">
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
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Users size={14} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">
                  {classData.attendees.length}/{classData.maxAttendees}
                </Text>
              </View>

              {showInstructor && (
                <View className="flex-row items-center gap-2">
                  <User size={12} className="text-muted-foreground" />

                  <Text className="text-xs text-muted-foreground">
                    {classData.instructor.name}
                  </Text>
                </View>
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
