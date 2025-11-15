import {CheckInMatTool} from "@/components/tools/CheckInMatTool";
import {Button} from "@/components/ui/button";
import {SSEHelper, StreamMessage} from "@/utils/sseHelper";
import React, {useCallback, useState} from "react";
import {Alert, FlatList, Text, TextInput, View} from "react-native";

export default function CheckInChat() {
  const {
    messages,
    inputText,
    isLoading,
    setInputText,
    handleSendMessage,
    pendingToolCall,
    setMessages,
    setPendingToolCall
  } = useChatHandler();

  return (
    <View className="flex-1 bg-background">
      <View className="bg-card border border-border p-4 mx-6 mt-6 rounded-lg shadow-sm shadow-foreground/10">
        <Text className="text-sm font-medium text-foreground mb-2">
          How to check in a member:
        </Text>
        <Text className="text-sm">
          Example: Check in Riley Garcia at the BJJ / Grappling class today.
        </Text>

        <Text className="text-xs text-muted-foreground">
          Also works with fuzzy matching if the member or class name is
          misspelled
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
              <Text className="text-sm text-red-500">Error: {item.error}</Text>
            ) : item.type === "tool_call" ? (
              <View>
                <Text className="text-sm font-medium text-card-foreground mb-2">
                  🔧 {item.toolName}
                </Text>
                {item.toolArgs?.checkInDetails && (
                  <View className="bg-background/50 rounded p-2">
                    <Text className="text-xs text-card-foreground">
                      Member: {item.toolArgs.checkInDetails.memberName}
                    </Text>
                    <Text className="text-xs text-card-foreground">
                      Class: {item.toolArgs.checkInDetails.className}
                    </Text>
                  </View>
                )}
              </View>
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

      {/* Show CheckInMatTool when there's a pending check_in_mat tool call */}
      {pendingToolCall && pendingToolCall.toolName === "check_in_mat" && (
        <View className="px-6 py-4">
          <CheckInMatTool
            args={pendingToolCall.toolArgs}
            onResponse={(response) => {
              // Add response message to chat
              const responseMessage: StreamMessage = {
                type: "ai",
                content: response.success
                  ? response.message || "Check-in completed successfully!"
                  : `Error: ${response.message || "Check-in failed"}`
              };
              setMessages((prev) => [...prev, responseMessage]);

              // Clear the pending tool call to re-enable chat
              setPendingToolCall(null);
            }}
          />
        </View>
      )}

      <View className="bg-card border-t border-border p-6 mb-6">
        <View className="flex-row items-center gap-4">
          <TextInput
            placeholder={
              pendingToolCall
                ? "Please complete the check-in process first..."
                : "Type..."
            }
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
            multiline={false}
            editable={!pendingToolCall}
          />
          <Button
            onPress={handleSendMessage}
            className="h-12 px-6"
            disabled={!!pendingToolCall || isLoading}
          >
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
  const [pendingToolCall, setPendingToolCall] = useState<StreamMessage | null>(
    null
  );
  const [threadId] = useState(() => SSEHelper.generateThreadId());

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: StreamMessage = {type: "human", content: inputText};
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      console.log("currentInput", currentInput);

      const aiMessages = await SSEHelper.streamChat(threadId, currentInput);
      console.log("aiMessages", aiMessages);

      // Check for check_in_mat tool calls
      const checkInMatToolCall = aiMessages.find(
        (msg) => msg.type === "tool_call" && msg.toolName === "check_in_mat"
      );

      if (checkInMatToolCall) {
        setPendingToolCall(checkInMatToolCall);
      } else {
        setMessages((prev) => [...prev, ...aiMessages]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
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
    handleSendMessage,
    pendingToolCall,
    setMessages,
    setPendingToolCall
  };
}
