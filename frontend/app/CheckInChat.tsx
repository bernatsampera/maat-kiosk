import {Button} from "@/components/ui/button";
import {SSEHelper, StreamMessage} from "@/utils/sseHelper";
import React, {useCallback, useState} from "react";
import {FlatList, Text, TextInput, View, Alert} from "react-native";

export default function CheckInChat() {
  const {messages, inputText, isLoading, setInputText, handleSendMessage} =
    useChatHandler();

  return (
    <View className="flex-1 bg-background">
      <View className="bg-card border border-border p-4 mx-6 mt-6 rounded-lg shadow-sm shadow-foreground/10">
        <Text className="text-sm font-medium text-foreground mb-2">
          How to check in a member:
        </Text>
        <Text className="text-xs text-muted-foreground">
          Example: "Check in Riley Garcia at the BJJ / Grappling class today at 10:00"
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={{paddingVertical: 24, paddingHorizontal: 24}}
        renderItem={({item}) => (
          <View
            className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm shadow-foreground/10 border border-border ${
              item.type === "human"
                ? "self-end bg-primary"
                : "self-start bg-card"
            } mb-2`}
          >
            {item.type === "error" ? (
              <Text className="text-sm text-red-500">
                Error: {item.error}
              </Text>
            ) : (
              <Text
                className={`text-sm ${
                  item.type === "human"
                    ? "text-primary-foreground"
                    : "text-card-foreground"
                }`}
              >
                {item.content}
              </Text>
            )}
          </View>
        )}
      />

      <View className="bg-card border-t border-border p-6 mb-6">
        <View className="flex-row items-center gap-4">
          <TextInput
            placeholder="Type..."
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
            multiline={false}
          />
          <Button onPress={handleSendMessage} className="h-12 px-6">
            <Text className="text-sm font-medium text-primary-foreground">
              Send
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

function useChatHandler() {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => SSEHelper.generateThreadId());

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: StreamMessage = {type: "human", content: inputText};
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const aiMessages = await SSEHelper.streamChat(threadId, currentInput);
      setMessages((prev) => [...prev, ...aiMessages]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert("Error", errorMessage);
      const errorStream: StreamMessage = {
        type: "error",
        content: "",
        error: errorMessage
      };
      setMessages((prev) => [...prev, errorStream]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, threadId]);

  return {
    messages,
    inputText,
    isLoading,
    setInputText,
    handleSendMessage
  };
}
