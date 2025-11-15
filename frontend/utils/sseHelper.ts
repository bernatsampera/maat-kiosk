import {parseResponse} from "../lib/bleakai";

export interface StreamMessage {
  type: "human" | "ai" | "tool_call" | "error";
  content: string;
  error?: string;
  toolName?: string;
  toolArgs?: any;
}

export class SSEHelper {
  private static baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

  static async streamChat(
    threadId: string,
    input: string
  ): Promise<StreamMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${threadId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream"
        },
        body: JSON.stringify({input})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const lines = responseText.split("\n");
      const messages: StreamMessage[] = [];

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        const data = line.substring(6);
        try {
          const parsedData = JSON.parse(data);

          if (parsedData.type === "done") break;

          for (const event of parseResponse(parsedData)) {
            if (event.type === "input" && event.content?.trim()) {
              messages.push({
                type: "ai",
                content: event.content
              });
            } else if (event.type === "tool_call") {
              messages.push({
                type: "tool_call",
                content: "",
                toolName: event.toolName,
                toolArgs: event.toolArgs
              });
            } else if (event.type === "error") {
              messages.push({
                type: "error",
                content: "",
                error: event.error || "Unknown tool error"
              });
            }
          }
        } catch (error) {
          // Skip invalid JSON lines
          continue;
        }
      }

      return messages;
    } catch (error: any) {
      return [
        {
          type: "error",
          content: "",
          error: error.message || "Unknown error occurred"
        }
      ];
    }
  }

  static generateThreadId(): string {
    return `chat-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
