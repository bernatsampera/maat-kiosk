export interface ConversationEvent {
  type: "input" | "tool_call" | "error";
  content?: string;
  toolName?: string;
  toolArgs?: any;
  error?: string;
}

function parseLangChainEvents(messages: any[]): ConversationEvent[] {
  const events: ConversationEvent[] = [];

  for (const item of messages) {
    if (item.lc === 1 && item.type === "constructor" && item.kwargs) {
      const kwargs = item.kwargs;

      const toolCalls = kwargs.tool_calls || [];
      for (const toolCall of toolCalls) {
        if (toolCall.name && toolCall.args) {
          events.push({
            type: "tool_call",
            toolName: toolCall.name,
            toolArgs: toolCall.args
          });
        }
      }

      if (kwargs.content && typeof kwargs.content === "string" && kwargs.content.trim()) {
        events.push({
          type: "input",
          content: kwargs.content.trim()
        });
      }
    }
  }

  return events;
}

export function parseResponse(response: any): ConversationEvent[] {
  if (response.type === "done") {
    return [];
  }

  if (response.type === "error") {
    return [{
      type: "error",
      error: response.error || "An unknown error occurred"
    }];
  }

  if (Array.isArray(response)) {
    const [type, data] = response;

    if (type === "messages") {
      return parseLangChainEvents(data);
    }

    if (type === "updates") {
      const nodeName = Object.values(data)[0];
      const innerMessages = nodeName && typeof nodeName === "object" && "messages" in nodeName
        ? nodeName.messages
        : undefined;

      if (innerMessages && Array.isArray(innerMessages)) {
        return parseLangChainEvents(innerMessages);
      }
    }
  }

  return parseLangChainEvents([response]);
}
