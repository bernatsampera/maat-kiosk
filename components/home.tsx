import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-2xl font-bold text-blue-600 mb-4">Home Screen</Text>
      <Text className="text-gray-600">Welcome to the home page!</Text>
    </View>
  );
}