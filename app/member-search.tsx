// app/member-search.tsx
import React, {useState, useMemo} from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import {Text} from "@/components/ui/text";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {useGym} from "@/utils/GymContext";
import {Member} from "@/lib/mockData";
import {ArrowLeft} from "lucide-react-native";

const beltColors = {
  white: "bg-gray-400 text-white",
  blue: "bg-blue-400 text-white",
  purple: "bg-purple-400 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white"
};

interface MemberItemProps {
  member: Member;
  navigation: any;
}

const MemberItem: React.FC<MemberItemProps> = ({member, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MemberCheckIn", {member})}
    >
      <Card className="mb-3">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-medium text-foreground">
                {member.name}
              </Text>
            </View>
            <Badge className={`${beltColors[member.belt]} capitalize`}>
              {member.belt}
            </Badge>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

export default function MemberSearchScreen({navigation}: any) {
  const {getAllMembers} = useGym();
  const [searchQuery, setSearchQuery] = useState("");

  const allMembers = useMemo(() => getAllMembers(), [getAllMembers]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return allMembers;
    }

    const query = searchQuery.toLowerCase();
    return allMembers.filter((member) =>
      member.name.toLowerCase().includes(query)
    );
  }, [allMembers, searchQuery]);

  const renderMember = ({item}: {item: Member}) => (
    <MemberItem member={item} navigation={navigation} />
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-muted-foreground text-center">
        {searchQuery.trim()
          ? `No members found matching "${searchQuery}"`
          : "No members available"}
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
          Member Search
        </Text>
      </View>

      {/* Search Input */}
      <View className="p-4">
        <TextInput
          style={styles.searchInput}
          placeholder="Search members by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground"
        />
        <Text className="text-sm text-muted-foreground mt-2 text-center">
          Tap on a member to check them in
        </Text>
      </View>

      {/* Member List */}
      <View className="flex-1 px-4">
        <FlatList
          data={filteredMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredMembers.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
        />
      </View>

      {/* Results Count */}
      {searchQuery.trim() && filteredMembers.length > 0 && (
        <View className="px-4 pb-4">
          <Text className="text-sm text-muted-foreground text-center">
            {filteredMembers.length}{" "}
            {filteredMembers.length === 1 ? "member" : "members"} found
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    fontSize: 16,
    fontFamily: "System"
  },
  listContainer: {
    paddingBottom: 20
  },
  emptyContainer: {
    flexGrow: 1
  }
});
