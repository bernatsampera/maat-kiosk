// app/home.tsx
import {Button} from "@/components/ui/button";
import {ThemedText} from "@/components/ui/ThemedText";
import {View, Text} from "react-native";

export default function HomeScreen({navigation}: any) {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ThemedText> Geist 3 </ThemedText>
      <ThemedText className=""> Geist 4 </ThemedText>
      <Text className="font-geist-bold">Geist 25 2</Text>
      <Button
        className=" "
        onPress={() => navigation.navigate("Detail", {id: 123})}
      >
        <Text className="">Go to Details</Text>
      </Button>
    </View>
  );
}
