"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import React, {useState} from "react";
import {Alert, Text, View} from "react-native";
import {useGym} from "@/utils/GymContext";

interface CheckInDetails {
  memberName: string;
  className: string;
  memberId?: string;
  classId?: string;
}

interface CheckInMatToolProps {
  args: {
    checkInDetails: CheckInDetails;
  };
  onResponse?: (response: { action: string; success: boolean; message?: string }) => void;
}

export const CheckInMatTool = ({args, onResponse}: CheckInMatToolProps) => {
  const {checkInDetails} = args;
  const {checkInMember, getAllMembers, classes, getCheckedInMembers} = useGym();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (submitted || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Find the member by name if memberId is not provided
      let memberId = checkInDetails.memberId;
      if (!memberId) {
        const members = getAllMembers();
        const member = members.find(m =>
          m.name.toLowerCase() === checkInDetails.memberName.toLowerCase()
        );
        if (!member) {
          throw new Error(`Member "${checkInDetails.memberName}" not found`);
        }
        memberId = member.id;
      }

      // Find the class by name if classId is not provided
      let classId = checkInDetails.classId;
      if (!classId) {
        const classData = classes.find(cls =>
          cls.name.toLowerCase() === checkInDetails.className.toLowerCase()
        );
        if (!classData) {
          throw new Error(`Class "${checkInDetails.className}" not found`);
        }
        classId = classData.id;
      }

      // Check if member is already checked in to this class
      const checkedInMembers = getCheckedInMembers(classId);
      const isAlreadyCheckedIn = checkedInMembers.some((m) => m.id === memberId);

      if (isAlreadyCheckedIn) {
        // Show already checked in alert
        Alert.alert(
          "Already Checked In",
          `${checkInDetails.memberName} is already checked in to ${checkInDetails.className}.`,
          [{text: "OK"}]
        );
        setSubmitted(false);
        setIsSubmitting(false);
        return;
      }

      // Perform the check-in
      checkInMember(classId, memberId);

      setSubmitted(true);

      // Show success alert
      Alert.alert(
        "Success!",
        `${checkInDetails.memberName} has been checked in to ${checkInDetails.className}.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Send success response
              onResponse?.({
                action: "confirm",
                success: true,
                message: `Successfully checked in ${checkInDetails.memberName} to ${checkInDetails.className}`
              });
            }
          }
        ]
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to confirm check-in";
      Alert.alert("Error", errorMessage);

      // Send error response
      onResponse?.({
        action: "confirm",
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (submitted || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitted(true);

    try {
      const rejectMessage = "User rejected the suggested check-in details";

      // Send rejection response
      onResponse?.({
        action: "reject",
        success: true,
        message: rejectMessage
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject check-in";
      Alert.alert("Error", errorMessage);

      // Send error response
      onResponse?.({
        action: "reject",
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="custom-tool-root">
      <Card className="custom-tool-card border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardContent className="space-y-6">
          {/* Header */}
          <View className="pt-4">
            <Text className="text-lg font-semibold text-card-foreground text-center">
              🥋 Check In Student
            </Text>
            <Text className="text-sm text-muted-foreground text-center mt-1">
              Please confirm the check-in details
            </Text>
          </View>

          {/* Check-in Details Card */}
          <View className="bg-background/50 rounded-lg p-4 border border-border">
            <Text className="text-sm font-medium text-card-foreground mb-3">
              Suggested Check-in Details:
            </Text>

            <View className="space-y-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted-foreground">Student:</Text>
                <Text className="text-sm font-medium text-card-foreground">
                  {checkInDetails?.memberName || "Unknown"}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted-foreground">Class:</Text>
                <Text className="text-sm font-medium text-card-foreground">
                  {checkInDetails?.className || "Unknown"}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            {!submitted ? (
              <>
                <Button
                  onPress={handleConfirm}
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Text className="text-sm font-medium text-primary-foreground">
                    {isSubmitting ? "Processing..." : "✓ Confirm Check-in"}
                  </Text>
                </Button>

                <Button
                  onPress={handleReject}
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <Text className="text-sm font-medium text-foreground">
                    {isSubmitting ? "Processing..." : "✗ Reject"}
                  </Text>
                </Button>
              </>
            ) : (
              <View className="flex items-center justify-center w-full py-2">
                <Text className="text-sm text-muted-foreground font-medium">
                  {isSubmitting ? "Processing..." : "Processing request..."}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </View>
  );
};
