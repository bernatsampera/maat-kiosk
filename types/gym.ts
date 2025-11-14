export interface Member {
  id: string;
  name: string;
  belt: "white" | "blue" | "purple" | "brown" | "black";
}

export interface Instructor {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export interface ClassData {
  id: string;
  name: string;
  time: string;
  endTime: string;
  tags: Array<"KIDS" | "YOGA" | "MMA" | "BJJ">;
  instructor: Instructor;
  attendees: string[]; // Array of member IDs
  maxAttendees: number;
}

export interface ClassDataJson {
  id: string;
  name: string;
  time: string;
  endTime: string;
  tags: Array<"KIDS" | "YOGA" | "MMA" | "BJJ">;
  instructorId: string;
  attendees: string[]; // Array of member IDs
  maxAttendees: number;
}