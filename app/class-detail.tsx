// app/class-detail.tsx
import {View, Text, Button, ScrollView, TouchableOpacity, Alert, FlatList} from "react-native";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar} from "@/components/ui/avatar-custom";
import {Badge} from "@/components/ui/badge";
import {Text as UIText} from "@/components/ui/text";
import {useGym} from "@/utils/GymContext";
import {ClassData, Member} from "@/lib/mockData";
import {Users, Clock, ChevronLeft, Plus, CheckCircle, AlertCircle} from "lucide-react-native";

export default function ClassDetailScreen({route, navigation}: any) {
  const {id} = route.params;
  const {getClassById, getCheckedInMembers, getAllMembers, checkInMember} = useGym();

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
    member => !checkedInMembers.some(checkedIn => checkedIn.id === member.id)
  );

  const handleCheckIn = (memberId: string) => {
    checkInMember(id, memberId);
    Alert.alert("Success", "Member checked in successfully!");
  };

  const showCheckInDialog = () => {
    if (availableMembers.length === 0) {
      Alert.alert("No Available Members", "All members are already checked in.");
      return;
    }

    Alert.alert(
      "Check In Member",
      "Select a member to check in:",
      availableMembers.map(member => ({
        text: `${member.name} (${member.belt} belt)`,
        onPress: () => handleCheckIn(member.id)
      })),
      { cancelable: true }
    );
  };

  const getBeltColor = (belt: string) => {
    const colors: {[key: string]: string} = {
      white: "bg-gray-200",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      brown: "bg-amber-700",
      black: "bg-gray-900"
    };
    return colors[belt] || "bg-gray-200";
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ChevronLeft size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Class Details</Text>
        </View>

        {/* Class Overview Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <View className="items-center mb-4">
              <Avatar
                source={classData.instructor.avatar ? {uri: classData.instructor.avatar} : undefined}
                fallback={classData.instructor.initials}
                size="lg"
                className="mb-4"
              />
              <Text className="text-xl font-bold text-foreground mb-1">{classData.name}</Text>
              <Text className="text-muted-foreground mb-2">with {classData.instructor.name}</Text>
            </View>

            <View className="flex-row items-center justify-center gap-2 mb-4">
              <Clock size={16} className="text-muted-foreground" />
              <Text className="text-muted-foreground">
                {classData.time} - {classData.endTime}h
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2 justify-center mb-4">
              {classData.tags.map(tag => (
                <Badge key={tag} variant={tag.toLowerCase() as any} className="text-xs">
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
            <Text className="text-primary-foreground font-semibold">Check In Member</Text>
          </TouchableOpacity>
        </View>

        {/* Attendees List */}
        <Card>
          <CardContent className="p-6">
            <Text className="text-lg font-bold text-foreground mb-4">Attendees ({checkedInMembers.length})</Text>

            {checkedInMembers.length === 0 ? (
              <View className="items-center py-8">
                <AlertCircle size={32} className="text-muted-foreground mb-2" />
                <Text className="text-muted-foreground text-center">No members checked in yet</Text>
              </View>
            ) : (
              <FlatList
                data={checkedInMembers}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({item}) => (
                  <View className="flex-row items-center gap-3 mb-4 pb-4 border-b border-border last:border-b-0">
                    <Avatar
                      size="md"
                      fallback={item.name.split(' ').map(n => n[0]).join('')}
                      className="bg-primary"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{item.name}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <View className={`w-2 h-2 rounded-full ${getBeltColor(item.belt)}`} />
                        <Text className="text-sm text-muted-foreground capitalize">{item.belt} belt</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <CheckCircle size={16} className="text-green-500" />
                      <Text className="text-sm text-green-500">Checked in</Text>
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
