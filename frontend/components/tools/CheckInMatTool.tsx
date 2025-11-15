"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import type {ClassData, Member} from "@/types/gym";
import {useGym} from "@/utils/GymContext";
import {findEnhancedMatch, FuzzyMatch} from "@/utils/fuzzyMatch";
import React, {useEffect, useState} from "react";
import {Alert, Text, View} from "react-native";

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
  onResponse?: (response: {
    action: string;
    success: boolean;
    message?: string;
  }) => void;
}

export const CheckInMatTool = ({args, onResponse}: CheckInMatToolProps) => {
  const {checkInDetails} = args;
  const {checkInMember, getAllMembers, classes, getCheckedInMembers} = useGym();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fuzzy matching states
  const [memberMatch, setMemberMatch] = useState<FuzzyMatch<Member> | null>(
    null
  );
  const [classMatch, setClassMatch] = useState<FuzzyMatch<ClassData> | null>(
    null
  );
  const [isValidated, setIsValidated] = useState(false);

  // Perform fuzzy matching when component loads or details change
  useEffect(() => {
    if (checkInDetails?.memberName && checkInDetails?.className) {
      const members = getAllMembers();

      // Find fuzzy match for member
      const foundMember = findEnhancedMatch(
        checkInDetails.memberName,
        members,
        (member) => member.name,
        60 // Minimum confidence score
      );
      setMemberMatch(foundMember);

      // Find fuzzy match for class
      const foundClass = findEnhancedMatch(
        checkInDetails.className,
        classes,
        (cls) => cls.name,
        60 // Minimum confidence score
      );
      setClassMatch(foundClass);

      setIsValidated(true);
    }
  }, [checkInDetails, getAllMembers, classes]);

  const handleConfirm = async () => {
    if (submitted || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Use fuzzy match results or fall back to original IDs
      let memberId = checkInDetails.memberId ?? "";
      let classId = checkInDetails.classId ?? "";
      let actualMemberName = checkInDetails.memberName;
      let actualClassName = checkInDetails.className;

      if (!memberId && memberMatch) {
        memberId = memberMatch.item.id;
        actualMemberName = memberMatch.item.name;
      } else if (!memberId && !memberMatch) {
        throw new Error(
          `Member "${checkInDetails.memberName}" not found (no good matches found)`
        );
      }

      if (!classId && classMatch) {
        classId = classMatch.item.id;
        actualClassName = classMatch.item.name;
      } else if (!classId && !classMatch) {
        throw new Error(
          `Class "${checkInDetails.className}" not found (no good matches found)`
        );
      }

      // Check if member is already checked in to this class
      const checkedInMembers = getCheckedInMembers(classId);
      const isAlreadyCheckedIn = checkedInMembers.some(
        (m) => m.id === memberId
      );

      if (isAlreadyCheckedIn) {
        // Show already checked in alert
        Alert.alert(
          "Already Checked In",
          `${actualMemberName} is already checked in to ${actualClassName}.`,
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
        `${actualMemberName} has been checked in to ${actualClassName}.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Send success response
              onResponse?.({
                action: "confirm",
                success: true,
                message: `Successfully checked in ${actualMemberName} to ${actualClassName}`
              });
            }
          }
        ]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to confirm check-in";
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject check-in";
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

            <View className="space-y-3">
              {/* Member Information */}
              <View className="space-y-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">
                    Student:
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-medium text-card-foreground">
                      {memberMatch
                        ? memberMatch.item.name
                        : checkInDetails?.memberName || "Unknown"}
                    </Text>
                    {memberMatch && (
                      <View
                        className={`px-2 py-1 rounded-full ${
                          memberMatch.score >= 90
                            ? "bg-green-100"
                            : memberMatch.score >= 75
                              ? "bg-yellow-100"
                              : "bg-orange-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            memberMatch.score >= 90
                              ? "text-green-700"
                              : memberMatch.score >= 75
                                ? "text-yellow-700"
                                : "text-orange-700"
                          }`}
                        >
                          {memberMatch.score}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Show match confidence details */}
                {memberMatch && memberMatch.score < 90 && (
                  <Text className="text-xs text-muted-foreground ml-auto">
                    AI suggested: "{checkInDetails?.memberName}"
                  </Text>
                )}

                {/* Show member belt level if matched */}
                {memberMatch && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted-foreground">
                      Belt Level:
                    </Text>
                    <Text className="text-xs font-medium text-card-foreground capitalize">
                      {memberMatch.item.belt}
                    </Text>
                  </View>
                )}
              </View>

              {/* Class Information */}
              <View className="space-y-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">Class:</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-medium text-card-foreground">
                      {classMatch
                        ? classMatch.item.name
                        : checkInDetails?.className || "Unknown"}
                    </Text>
                    {classMatch && (
                      <View
                        className={`px-2 py-1 rounded-full ${
                          classMatch.score >= 90
                            ? "bg-green-100"
                            : classMatch.score >= 75
                              ? "bg-yellow-100"
                              : "bg-orange-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            classMatch.score >= 90
                              ? "text-green-700"
                              : classMatch.score >= 75
                                ? "text-yellow-700"
                                : "text-orange-700"
                          }`}
                        >
                          {classMatch.score}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Show match confidence details */}
                {classMatch && classMatch.score < 90 && (
                  <Text className="text-xs text-muted-foreground ml-auto">
                    AI suggested: "{checkInDetails?.className}"
                  </Text>
                )}

                {/* Show class time and instructor if matched */}
                {classMatch && (
                  <>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted-foreground">
                        Time:
                      </Text>
                      <Text className="text-xs font-medium text-card-foreground">
                        {classMatch.item.time} - {classMatch.item.endTime}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted-foreground">
                        Instructor:
                      </Text>
                      <Text className="text-xs font-medium text-card-foreground">
                        {classMatch.item.instructor.name}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Validation Status */}
            {isValidated && (!memberMatch || !classMatch) && (
              <View className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <Text className="text-xs text-red-700">
                  ⚠️ Unable to find matches for: {!memberMatch ? "Student" : ""}
                  {!memberMatch && !classMatch ? " and " : ""}
                  {!classMatch ? "Class" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            {!submitted ? (
              <>
                <Button
                  onPress={handleConfirm}
                  className="w-full"
                  size="lg"
                  disabled={
                    isSubmitting || !isValidated || !memberMatch || !classMatch
                  }
                >
                  <Text className="text-sm font-medium text-primary-foreground">
                    {isSubmitting
                      ? "Processing..."
                      : !isValidated || !memberMatch || !classMatch
                        ? "⚠️ Cannot Check-in"
                        : "✓ Confirm Check-in"}
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
