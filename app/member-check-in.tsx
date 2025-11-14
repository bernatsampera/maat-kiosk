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
import {Button} from "@/components/ui/button";
import {ClassCard} from "@/components/ui/class-card";
import {EmptyState} from "@/components/ui/empty-state";
import {useGym} from "@/utils/GymContext";
import {ClassData} from "@/lib/mockData";
import {Badge, XCircle} from "lucide-react-native";
import {formatDate} from "@/lib/mockData";
import {BeltBadge, beltColors} from "@/components/ui/belt-badge";

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

  const allClasses = todayClasses;

  const handleCheckIn = async () => {
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class to check in to.");
      return;
    }

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
            onPress: () => navigation.popToTop()
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
                    onPress: () => navigation.popToTop()
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
    const isSelected = selectedClass?.id === item.id;

    return (
      <ClassCard
        classData={item}
        onPress={() => setSelectedClass(item)}
        isSelected={isSelected}
        isCheckedIn={isCheckedIn}
        size="md"
        showInstructor={true}
        showAvatar={true}
        className="mb-4"
      />
    );
  };

  const renderEmptyState = () => (
    <EmptyState title="No classes available today" icon="calendar" size="md" />
  );

  return (
    <View className="flex-1 bg-background">
      {/* Member Info */}
      <View className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-medium text-foreground mb-1">
                  {member.name}
                </Text>
                {member.belt && <BeltBadge belt={member.belt} />}
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
