// app/class-detail.tsx
import {Avatar} from "@/components/ui/avatar-custom";
import {Badge} from "@/components/ui/badge";
import {BeltBadge} from "@/components/ui/belt-badge";
import {Card, CardContent} from "@/components/ui/card";
import {EmptyState} from "@/components/ui/empty-state";
import {useGym} from "@/utils/GymContext";
import {CheckCircle, Clock, Plus, Users} from "lucide-react-native";
import {
  Alert,
  Button,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ClassDetailScreen({route, navigation}: any) {
  const {id} = route.params;
  const {getClassById, getCheckedInMembers, getAllMembers, checkInMember} =
    useGym();

  const classData = getClassById(id);
  const checkedInMembers = getCheckedInMembers(id);
  const allMembers = getAllMembers();

  if (!classData) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Class not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const availableMembers = allMembers.filter(
    (member) =>
      !checkedInMembers.some((checkedIn) => checkedIn.id === member.id)
  );

  const handleCheckIn = (memberId: string) => {
    checkInMember(id, memberId);
    Alert.alert("Success", "Member checked in successfully!");
  };

  const showCheckInDialog = () => {
    if (availableMembers.length === 0) {
      Alert.alert(
        "No Available Members",
        "All members are already checked in."
      );
      return;
    }

    Alert.alert(
      "Check In Member",
      "Select a member to check in:",
      [
        // Add this as the first button for easy cancellation
        {text: "Cancel", style: "cancel"},
        // Then your dynamic buttons
        ...availableMembers.map((member) => ({
          text: `${member.name} (${member.belt} belt)`,
          onPress: () => handleCheckIn(member.id)
        }))
      ],
      // You can keep this for Android compatibility, but it won't fire on iOS
      {cancelable: true}
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Class Overview Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <View className="items-center mb-4">
              <Avatar
                source={
                  classData.instructor.avatar
                    ? {uri: classData.instructor.avatar}
                    : undefined
                }
                fallback={classData.instructor.initials}
                size="lg"
                className="mb-4"
              />
              <Text className="text-xl font-bold text-foreground mb-1">
                {classData.name}
              </Text>
              <Text className="text-muted-foreground mb-2">
                with {classData.instructor.name}
              </Text>
            </View>

            <View className="flex-row items-center justify-center gap-2 mb-4">
              <Clock size={16} className="text-muted-foreground" />
              <Text className="text-muted-foreground">
                {classData.time} - {classData.endTime}h
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2 justify-center mb-4">
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

            <View className="flex-row items-center justify-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <Text className="text-muted-foreground">
                {checkedInMembers.length}/{classData.maxAttendees} attendees
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Check-in Button */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={showCheckInDialog}
            className="bg-primary rounded-lg p-4 flex-row items-center justify-center gap-2"
          >
            <Plus size={20} className="text-primary-foreground" />
            <Text className="text-primary-foreground font-semibold">
              Check In Member
            </Text>
          </TouchableOpacity>
        </View>

        {/* Attendees List */}
        <Card>
          <CardContent className="p-6">
            <Text className="text-lg font-bold text-foreground mb-4">
              Attendees ({checkedInMembers.length})
            </Text>

            {checkedInMembers.length === 0 ? (
              <EmptyState
                title="No members checked in yet"
                description="Check in members to see them listed here"
                icon="users"
                size="md"
              />
            ) : (
              <FlatList
                data={checkedInMembers}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({item}) => (
                  <View className="flex-row items-center gap-3 mb-4 pb-4 border-b border-border last:border-b-0">
                    <Avatar
                      size="sm"
                      fallback={item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      className="bg-primary"
                    />
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-muted-foreground">
                        {item.name}
                      </Text>
                      <View className="mt-1">
                        <BeltBadge belt={item.belt} size="sm" />
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <CheckCircle size={12} className="text-green-500" />
                      <Text className="text-xs text-green-500">Checked in</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
