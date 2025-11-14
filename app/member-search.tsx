// app/member-search.tsx
import React, {useState, useMemo} from "react";
import {View, TextInput, FlatList, StyleSheet} from "react-native";
import {MemberItem} from "@/components/ui/member-item";
import {EmptyState} from "@/components/ui/empty-state";
import {useGym} from "@/utils/GymContext";
import {Member} from "@/types/gym";
import {Text} from "@/components/ui/text";

export default function MemberSearchScreen({navigation}: any) {
  const {getAllMembers} = useGym();
  const [searchQuery, setSearchQuery] = useState("");

  const allMembers = useMemo(() => getAllMembers(), [getAllMembers]);

  const filteredMembers = useMemo(() => {
    let members = allMembers;

    if (!searchQuery.trim()) {
      members = allMembers;
    } else {
      const query = searchQuery.toLowerCase();
      members = allMembers.filter((member) =>
        member.name.toLowerCase().includes(query)
      );
    }

    // Sort by belt rank (black to white)
    const beltOrder = {
      "black": 0,
      "brown": 1,
      "purple": 2,
      "blue": 3,
      "white": 4
    };

    return members.sort((a, b) => beltOrder[a.belt] - beltOrder[b.belt]);
  }, [allMembers, searchQuery]);

  const renderMember = ({item}: {item: Member}) => (
    <MemberItem
      member={item}
      onPress={() => navigation.navigate("MemberCheckIn", {member: item})}
      showBelt={true}
      size="md"
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title={
        searchQuery.trim()
          ? `No members found matching "${searchQuery}"`
          : "No members available"
      }
      description={
        searchQuery.trim()
          ? "Try a different search term"
          : "There are no members in the system"
      }
      icon="search"
      size="md"
    />
  );

  return (
    <View className="flex-1 bg-background">
      {/* Search Input */}
      <View className="p-4">
        <TextInput
          style={styles.searchInput}
          placeholder="Search members by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-card border border-border rounded-lg px-4 py-3 placeholder:text-muted-foreground"
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
