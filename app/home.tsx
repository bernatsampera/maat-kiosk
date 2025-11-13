// app/home.tsx
import {View, Text, Button} from "react-native";

export default function HomeScreen({navigation}: any) {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Detail (id: 123)"
        onPress={() => navigation.navigate("Detail", {id: 123})}
      />
    </View>
  );
}
