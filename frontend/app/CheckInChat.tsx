import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {View, Text, FlatList, TextInput} from "react-native";

export default function CheckInChat() {
  const [messages, setMessages] = useState([
    {id: "1", text: "Hey! How can I help you today?", sender: "bot"}
  ]);

  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const sendMessage = () => {
    if (!input.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {id: Date.now().toString(), text: input, sender: "user"}
    ]);

    setInput("");
  };

  return (
    <View className="flex-1 bg-background">
      {/* INSTRUCTION MESSAGE */}
      <View className="bg-card border border-border p-4 mx-6 mt-6 rounded-lg shadow-sm shadow-foreground/10">
        <Text className="text-sm font-medium text-foreground mb-2">
          How to check in a member:
        </Text>
        <Text className="text-xs text-muted-foreground">
          Example: "Check in Riley Garcia at the BJJ / Grappling class today at
          10:00"
        </Text>
      </View>

      {/* ERROR ALERT */}
      {error ? (
        <Alert variant="destructive" className="m-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {/* MESSAGES LIST */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingVertical: 24, paddingHorizontal: 24}}
        renderItem={({item}) => (
          <View
            className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm shadow-foreground/10 border border-border ${
              item.sender === "user"
                ? "self-end bg-primary"
                : "self-start bg-card"
            } mb-2`}
          >
            <Text
              className={`text-sm ${
                item.sender === "user"
                  ? "text-primary-foreground"
                  : "text-card-foreground"
              }`}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* INPUT AREA */}
      <View className="bg-card border-t border-border p-6 mb-6">
        <View className="flex-row items-center gap-4">
          <TextInput
            placeholder="Type..."
            value={input}
            onChangeText={setInput}
            className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
            multiline={false}
          />
          <Button onPress={sendMessage} className="h-12 px-6">
            <Text className="text-sm font-medium text-primary-foreground">
              Send
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
