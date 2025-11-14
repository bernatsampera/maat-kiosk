import {Member, Instructor, ClassData} from "@/types/gym";
import membersData from "./members.json";
import instructorsData from "./instructors.json";
import classesData from "./classes.json";

export const members: Member[] = membersData as Member[];

export const instructors: Instructor[] = instructorsData.map((inst: any) => ({
  ...inst,
  avatar: inst.avatar || undefined
}));

export const todayClasses: ClassData[] = classesData.map((classItem: any) => {
  const instructor = instructors.find(
    (inst) => inst.id === classItem.instructorId
  );
  if (!instructor) {
    throw new Error(`Instructor with id ${classItem.instructorId} not found`);
  }
  return {
    ...classItem,
    instructor,
    tags: classItem.tags as Array<"KIDS" | "YOGA" | "MMA" | "BJJ">
  };
});

export const formatDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return now.toLocaleDateString("en-US", options).toUpperCase();
};
