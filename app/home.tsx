// app/home.tsx
import {Text} from "@/components/ui/text";
import {Card, CardContent} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Avatar} from "@/components/ui/avatar-custom";
import {todayClasses, formatDate} from "@/lib/mockData";
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import {Users, User, Info} from "lucide-react-native";

export default function HomeScreen({navigation}: any) {
  return (
    <ScrollView className="flex-1 bg-background">
      {/* CHANGED: Consistent padding on all sides for the main content view */}
      <View className="p-6">
        {/* Header Section */}
        {/* CHANGED: Adjusted margin for better rhythm */}
        <View className="mb-4">
          <Text className="text-sm text-muted-foreground mb-1 font-light tracking-wide">
            {formatDate()}
          </Text>
          <Text className="text-3xl font-bold text-foreground">
            Welcome to 🕷️ Aranha
          </Text>
        </View>

        {/* Hero Banner */}
        {/* CHANGED: Standardized bottom margin */}
        <Card className="mb-4 overflow-hidden rounded-2xl">
          <AspectRatio ratio={16 / 9}>
            <View className="relative h-full w-full">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop"
                }}
                className="absolute inset-0 w-full h-full"
              />
              {/* CHANGED: Made gradient stronger at the bottom for readability */}
              <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* CHANGED: Padded the text container for a much cleaner look */}
              <View className="absolute bottom-0 left-0 right-0 p-6">
                <Text className="text-xs text-white/80 mb-1 uppercase tracking-wider font-semibold">
                  EXPERIENCES
                </Text>
                <Text className="text-2xl font-bold text-white mb-1">
                  Summer BJJ Bootcamp
                </Text>
                <Text className="text-sm text-white/90 leading-snug">
                  Roll more, learn more, sweat more. Summer starts on the mat.
                </Text>
              </View>
            </View>
          </AspectRatio>
        </Card>

        {/* Today's Classes Section */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-foreground mb-4">
            Today's classes
          </Text>
          {/* ADDED: A subtitle for more context and better visual hierarchy */}
          <Text className="text-muted-foreground mb-4">
            Check the schedule and book your spot.
          </Text>

          {/* Class Grid - 2 columns */}
          <FlatList
            data={todayClasses}
            numColumns={2}
            keyExtractor={(item) => item.id}
            // CRITICAL FIX: This prevents the FlatList from trying to scroll
            // independently inside the ScrollView, fixing layout issues.
            scrollEnabled={false}
            columnWrapperStyle={{gap: 16}}
            contentContainerStyle={{gap: 16}}
            renderItem={({item}) => (
              <TouchableOpacity
                className="flex-1"
                onPress={() => navigation.navigate("Detail", {id: item.id})}
              >
                {/* CHANGED: Added rounded-2xl for consistency */}
                <Card className="h-full rounded-2xl">
                  <CardContent className="p-4">
                    <Avatar
                      source={
                        item.instructor.avatar
                          ? {uri: item.instructor.avatar}
                          : undefined
                      }
                      fallback={item.instructor.initials}
                      size="sm"
                      className="mb-4" // ADDED: Margin below avatar
                    />

                    <Text className="font-bold text-foreground mb-1 text-base">
                      {item.name}
                    </Text>

                    <Text className="text-sm text-muted-foreground mb-4">
                      {item.time}—{item.endTime}h
                    </Text>

                    <View className="flex-row flex-wrap gap-1.5 mb-4">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={tag.toLowerCase() as any}
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </View>

                    {/* CHANGED: Stacked info for better readability and replaced emojis with icons */}
                    <View className="gap-2 text-xs text-muted-foreground">
                      <View className="flex-row items-center gap-2">
                        <Users size={14} className="text-muted-foreground" />
                        <Text className="text-muted-foreground">
                          {item.attendees}/{item.maxAttendees} spots
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        <Text className="text-muted-foreground">
                          {item.instructor.name}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Secondary Banner */}
        <Card className="mb-4 overflow-hidden rounded-2xl">
          <AspectRatio ratio={16 / 9}>
            <View className="relative h-full w-full">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=450&fit=crop"
                }}
                className="absolute inset-0 w-full h-full"
              />
              <View className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-red-700/50 to-transparent" />
              {/* CHANGED: Padded the text container here as well */}
              <View className="absolute bottom-0 left-0 right-0 p-6">
                <Text className="text-2xl font-bold text-white mb-1">
                  Aranha x MAAT Store
                </Text>
                <Text className="text-sm text-white/90 leading-snug">
                  Official gear and apparel now available.
                </Text>
              </View>
            </View>
          </AspectRatio>
        </Card>

        {/* Footer Pro Tip */}
        {/* CHANGED: Removed bottom margin as parent padding handles it */}
        <Alert variant="info">
          <View className="flex-row items-start gap-4">
            {/* CHANGED: Replaced emoji with a proper icon */}
            <Info size={18} className="text-info-foreground mt-1" />
            <AlertDescription className="flex-1">
              <Text className="font-medium text-foreground mb-1">Pro tip</Text>
              <Text className="text-sm text-muted-foreground leading-relaxed">
                Open your MAAT app and bump this device to check in
                automatically.
              </Text>
            </AlertDescription>
          </View>
        </Alert>
      </View>
    </ScrollView>
  );
}
