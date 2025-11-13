// app/home.tsx
import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {View, Text as SimpleText} from "react-native";

export default function HomeScreen({navigation}: any) {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Button
        className=""
        variant="default"
        onPress={() => navigation.navigate("Detail", {id: 123})}
      >
        <Text className="">Go to Details</Text>
      </Button>
    </View>
  );
}
