// app/home.tsx
import {Text} from "@/components/ui/text";
import {Card, CardContent} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {ClassCard} from "@/components/ui/class-card";
import {formatDate} from "@/lib/mockData";
import {useGym} from "@/utils/GymContext";
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import {Users, Info} from "lucide-react-native";

export default function HomeScreen({navigation}: any) {
  const {classes: todayClasses} = useGym();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Member Search Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MemberSearch")}
          className="mb-6"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Users size={20} className="text-primary" />
                  <Text className="text-lg font-medium text-foreground">
                    Member Search
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  Search and view all members
                </Text>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
        {/* Header Section */}
        <View className="mb-4">
          <Text className="text-sm text-muted-foreground mb-1 font-light tracking-wide">
            {formatDate()}
          </Text>
          <Text className="text-3xl font-bold text-foreground">
            Welcome to 🕷️ Aranha
          </Text>
        </View>

        {/* Hero Banner */}
        <Card className="mb-4 overflow-hidden rounded-2xl">
          <AspectRatio ratio={16 / 9}>
            <View className="relative h-full w-full">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop"
                }}
                className="absolute inset-0 w-full h-full"
              />
              <View className="absolute inset-0 bg-black/70" />
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
            scrollEnabled={false}
            columnWrapperStyle={{gap: 24}}
            contentContainerStyle={{gap: 24}}
            renderItem={({item}) => (
              <ClassCard
                classData={item}
                onPress={() =>
                  navigation.navigate("ClassDetail", {id: item.id})
                }
                size="md"
                className="flex-1"
              />
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
        <Alert variant="info">
          <View className="flex-row items-start gap-4">
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
