// app/detail.tsx
import {View, Text, Button} from "react-native";

export default function DetailScreen({route, navigation}: any) {
  const {id} = route.params;
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Detail Screen</Text>
      <Text>ID: {id}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
