import React, {useEffect, useRef, useState} from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

interface StreamEvent {
  type: string;
  data?: any;
  timestamp: string;
}

export default function EventStreamTest() {
  const [inputText, setInputText] = useState("");
  const [threadId, setThreadId] = useState(`test-thread-${Date.now()}`);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const connectToStream = async () => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter a message to send");
      return;
    }

    setIsLoading(true);
    setEvents([]);

    // Cancel any existing connection
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const url = `http://localhost:8000/chat/${threadId}/stream`;
      console.log("Connecting to:", url);

      setIsConnected(true);
      setIsLoading(false);
      addEvent({type: "connection", timestamp: new Date().toISOString()});
      console.log("url", url);

      // Use fetch to manually parse SSE stream
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({input: inputText}),
        signal: abortControllerRef.current.signal
      });

      console.log("response", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // React Native doesn't support real-time streaming, so we'll get the full response
      // and then simulate real-time processing by displaying events with delays
      const responseText = await response.text();
      console.log("Response received, length:", responseText.length);

      // Parse SSE format from the complete response
      const lines = responseText.split("\n");
      const events: string[] = [];

      for (const line of lines) {
        if (line.trim() === "") continue; // Skip empty lines

        if (line.startsWith("data: ")) {
          const data = line.substring(6); // Remove 'data: ' prefix
          events.push(data);
        }
      }

      // Simulate real-time streaming by processing events with delays
      for (let i = 0; i < events.length; i++) {
        const data = events[i];
        console.log("Raw event data:", data);

        try {
          const parsedData = JSON.parse(data);
          addEvent({
            type: "message",
            data: parsedData,
            timestamp: new Date().toISOString()
          });

          // Check if it's a completion message
          if (parsedData.type === "done") {
            console.log("Stream completed");
            setIsConnected(false);
            return;
          }
        } catch (error) {
          console.error("Failed to parse event data:", error);
          addEvent({
            type: "parse_error",
            data: {error: "Failed to parse JSON", raw: data},
            timestamp: new Date().toISOString()
          });
        }

        // Add a small delay to simulate real-time streaming (except for the last event)
        if (i < events.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log("All events processed");
      setIsConnected(false);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request was aborted");
        addEvent({
          type: "aborted",
          timestamp: new Date().toISOString()
        });
      } else {
        console.error("Stream error:", error);
        setIsConnected(false);
        setIsLoading(false);
        addEvent({
          type: "error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error"
          },
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const addEvent = (event: StreamEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const disconnect = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsConnected(false);
    setIsLoading(false);
    addEvent({
      type: "disconnected",
      timestamp: new Date().toISOString()
    });
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const formatEventData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Stream Test</Text>
        <Text style={styles.subtitle}>Test SSE connection to backend</Text>
      </View>

      {/* Configuration */}
      <View style={styles.configSection}>
        <Text style={styles.label}>Thread ID:</Text>
        <TextInput
          style={styles.input}
          value={threadId}
          onChangeText={setThreadId}
          placeholder="Thread ID"
        />

        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter test message..."
          multiline
        />
      </View>

      {/* Connection Status */}
      <View style={styles.statusSection}>
        <Text style={styles.statusLabel}>
          Status:{" "}
          {isLoading
            ? "Connecting..."
            : isConnected
              ? "Connected"
              : "Disconnected"}
        </Text>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: isLoading
                ? "#FFA500"
                : isConnected
                  ? "#00FF00"
                  : "#FF0000"
            }
          ]}
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        <Button
          title="Connect & Send"
          onPress={connectToStream}
          disabled={isLoading || isConnected}
        />
        <Button
          title="Disconnect"
          onPress={disconnect}
          disabled={!isConnected}
          color="#FF6B6B"
        />
        <Button title="Clear Events" onPress={clearEvents} color="#4ECDC4" />
      </View>

      {/* Events Display */}
      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>Events ({events.length}):</Text>
        <ScrollView style={styles.eventsScroll} nestedScrollEnabled={true}>
          {events.map((event, index) => (
            <View key={index} style={styles.eventItem}>
              <Text style={styles.eventType}>{event.type.toUpperCase()}</Text>
              <Text style={styles.eventTimestamp}>
                {new Date(event.timestamp).toLocaleTimeString()}
              </Text>
              {event.data && (
                <Text style={styles.eventData}>
                  {formatEventData(event.data)}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: "#666"
  },
  configSection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333"
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "white"
  },
  messageInput: {
    height: 80,
    textAlignVertical: "top"
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600"
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  controlsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16
  },
  eventsSection: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12
  },
  eventsScroll: {
    flex: 1
  },
  eventItem: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF"
  },
  eventType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4
  },
  eventTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4
  },
  eventData: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 4
  }
});
