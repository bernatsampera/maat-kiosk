// app/member-check-in.tsx
import React, {useState} from "react";
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {Text} from "@/components/ui/text";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useGym} from "@/utils/GymContext";
import {Member, ClassData} from "@/lib/mockData";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react-native";
import {formatDate} from "@/lib/mockData";

const beltColors = {
  white: "bg-gray-400 text-white",
  blue: "bg-blue-400 text-white",
  purple: "bg-purple-400 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white"
};

interface ClassItemProps {
  classData: ClassData;
  isSelected: boolean;
  isCheckedIn: boolean;
  onSelect: () => void;
}

const ClassItem: React.FC<ClassItemProps> = ({
  classData,
  isSelected,
  isCheckedIn,
  onSelect
}) => {
  return (
    <TouchableOpacity onPress={onSelect} disabled={false}>
      <Card
        className={`mb-3 ${isSelected ? "border-primary border-2" : ""} ${isCheckedIn ? "border-green-200 bg-green-50" : ""}`}
      >
        <CardContent className="p-4">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-medium text-foreground mb-1">
                {classData.name}
              </Text>
              <View className="flex-row items-center gap-2 mb-2">
                <Clock size={16} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">
                  {classData.time} - {classData.endTime}
                </Text>
              </View>
              <Text className="text-sm text-muted-foreground mb-2">
                Instructor: {classData.instructor.name}
              </Text>
            </View>
            {isCheckedIn && (
              <View className="bg-green-100 p-2 rounded-full">
                <CheckCircle size={20} className="text-green-600" />
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <Text className="text-sm text-muted-foreground">
                {classData.attendees.length}/{classData.maxAttendees} checked in
              </Text>
            </View>
            <View className="flex-row gap-1">
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

          {isCheckedIn && (
            <Text className="text-sm text-green-600 mt-2 font-medium">
              ✓ Checked in - Tap to manage
            </Text>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

export default function MemberCheckInScreen({route, navigation}: any) {
  const {member} = route.params;
  const {
    classes: todayClasses,
    checkInMember,
    removeMemberFromClass,
    getCheckedInMembers
  } = useGym();
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  console.log("today classes", todayClasses.length);

  // Show all classes, but distinguish between available and checked-in
  const allClasses = todayClasses;

  const handleCheckIn = async () => {
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class to check in to.");
      return;
    }

    // Check if member is already checked in to this class
    const checkedInMembers = getCheckedInMembers(selectedClass.id);
    const isAlreadyCheckedIn = checkedInMembers.some((m) => m.id === member.id);

    if (isAlreadyCheckedIn) {
      Alert.alert(
        "Already Checked In",
        `${member.name} is already checked in to ${selectedClass.name}.`,
        [{text: "OK"}]
      );
      return;
    }

    setIsCheckingIn(true);

    try {
      await checkInMember(selectedClass.id, member.id);
      Alert.alert(
        "Success!",
        `${member.name} has been checked in to ${selectedClass.name}.`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to check in. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleRemoveFromClass = async () => {
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class to remove from.");
      return;
    }

    // Check if member is actually checked in to this class
    const checkedInMembers = getCheckedInMembers(selectedClass.id);
    const isCheckedIn = checkedInMembers.some((m) => m.id === member.id);

    if (!isCheckedIn) {
      Alert.alert(
        "Not Checked In",
        `${member.name} is not checked in to ${selectedClass.name}.`,
        [{text: "OK"}]
      );
      return;
    }

    Alert.alert(
      "Remove from Class",
      `Are you sure you want to remove ${member.name} from ${selectedClass.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setIsRemoving(true);

            try {
              await removeMemberFromClass(selectedClass.id, member.id);
              Alert.alert(
                "Success!",
                `${member.name} has been removed from ${selectedClass.name}.`,
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate("Home")
                  }
                ]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to remove from class. Please try again."
              );
            } finally {
              setIsRemoving(false);
            }
          }
        }
      ]
    );
  };

  const renderClass = ({item}: {item: ClassData}) => {
    const checkedInMembers = getCheckedInMembers(item.id);
    const isCheckedIn = checkedInMembers.some((m) => m.id === member.id);

    return (
      <ClassItem
        classData={item}
        isSelected={selectedClass?.id === item.id}
        isCheckedIn={isCheckedIn}
        onSelect={() => setSelectedClass(item)}
      />
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-muted-foreground text-center">
        No classes available today
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <ArrowLeft size={24} className="text-foreground" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">
          Member Check-In
        </Text>
      </View>

      {/* Member Info */}
      <View className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-medium text-foreground mb-1">
                  {member.name}
                </Text>
                {/* {member.belt && (
                  <Badge className={`${beltColors[member.belt]} capitalize`}>
                    {member.belt} belt
                  </Badge>
                )} */}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Date */}
        <View className="mb-4">
          <Text className="text-center text-lg font-medium text-foreground">
            {formatDate()}
          </Text>
        </View>

        {/* Class Selection */}
        <Text className="text-lg font-medium text-foreground mb-3 px-4">
          Today's Classes
        </Text>
      </View>

      {/* Classes List */}
      <FlatList
        data={allClasses}
        renderItem={renderClass}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 200}}
        className="flex-1"
      />

      {/* Check-In Button */}
      {selectedClass &&
        (() => {
          const checkedInMembers = getCheckedInMembers(selectedClass.id);
          const isCheckedIn = checkedInMembers.some((m) => m.id === member.id);
          const hasAvailableSlots =
            selectedClass.attendees.length < selectedClass.maxAttendees;
          const canCheckIn = !isCheckedIn && hasAvailableSlots;

          return (
            <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
              {canCheckIn ? (
                <>
                  <Button
                    onPress={handleCheckIn}
                    disabled={isCheckingIn}
                    className="w-full"
                  >
                    <Text className="text-primary-foreground font-medium">
                      {isCheckingIn ? "Checking In..." : "Check In"}
                    </Text>
                  </Button>
                  <Text className="text-center text-sm text-muted-foreground mt-2">
                    Check in to {selectedClass.name} at {selectedClass.time}
                  </Text>
                </>
              ) : (
                <View className="bg-gray-100 rounded-lg p-4">
                  {isCheckedIn ? (
                    <View>
                      <Text className="text-center text-gray-600 font-medium mb-3">
                        {member.name} is checked in to {selectedClass.name}
                      </Text>
                      <Button
                        onPress={handleRemoveFromClass}
                        disabled={isRemoving}
                        variant="destructive"
                        className="w-full"
                      >
                        <XCircle
                          size={16}
                          className="mr-2 text-primary-foreground"
                        />
                        <Text className="text-primary-foreground font-medium">
                          {isRemoving ? "Removing..." : "Remove Check-In"}
                        </Text>
                      </Button>
                      <Text className="text-center text-sm text-muted-foreground mt-2">
                        Tap to remove {member.name} from this class
                      </Text>
                    </View>
                  ) : (
                    <View className="items-center">
                      <Text className="text-center text-gray-600 font-medium">
                        {selectedClass.attendees.length >=
                        selectedClass.maxAttendees
                          ? `${selectedClass.name} is full`
                          : "Cannot check in to this class"}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })()}
    </View>
  );
}
