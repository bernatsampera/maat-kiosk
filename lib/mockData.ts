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

export const members: Member[] = [
  {id: "m1", name: "Alex Johnson", belt: "white"},
  {id: "m2", name: "Sam Smith", belt: "blue"},
  {id: "m3", name: "Jordan Davis", belt: "purple"},
  {id: "m4", name: "Taylor Wilson", belt: "brown"},
  {id: "m5", name: "Casey Brown", belt: "black"},
  {id: "m6", name: "Morgan Lee", belt: "white"},
  {id: "m7", name: "Riley Garcia", belt: "blue"},
  {id: "m8", name: "Quinn Martinez", belt: "purple"},
  {id: "m9", name: "Avery Rodriguez", belt: "white"},
  {id: "m10", name: "Blake Hernandez", belt: "blue"},
  {id: "m11", name: "Drew Lopez", belt: "brown"},
  {id: "m12", name: "Sage Gonzalez", belt: "black"},
  {id: "m13", name: "Phoenix Perez", belt: "white"},
  {id: "m14", name: "River Turner", belt: "blue"},
  {id: "m15", name: "Sky Parker", belt: "purple"}
];

export const instructors: Instructor[] = [
  {
    id: "1",
    name: "Lautaro S.",
    avatar: undefined, // Would be actual image URL
    initials: "LS"
  },
  {
    id: "2",
    name: "Maria G.",
    avatar: undefined,
    initials: "MG"
  },
  {
    id: "3",
    name: "John D.",
    avatar: undefined,
    initials: "JD"
  },
  {
    id: "4",
    name: "Sarah K.",
    avatar: undefined,
    initials: "SK"
  },
  {
    id: "5",
    name: "Carlos R.",
    avatar: undefined,
    initials: "CR"
  },
  {
    id: "6",
    name: "Emma L.",
    avatar: undefined,
    initials: "EL"
  }
];

export const todayClasses: ClassData[] = [
  {
    id: "1",
    name: "BJJ / Grappling",
    time: "10:00",
    endTime: "11:00",
    tags: ["BJJ", "MMA"],
    instructor: instructors[0],
    attendees: [
      "m2",
      "m3",
      "m4",
      "m5",
      "m6",
      "m7",
      "m8",
      "m9",
      "m10",
      "m11",
      "m12"
    ],
    maxAttendees: 30
  },
  {
    id: "2",
    name: "Kids BJJ",
    time: "11:30",
    endTime: "12:30",
    tags: ["KIDS", "BJJ"],
    instructor: instructors[1],
    attendees: ["m6", "m9", "m13", "m14", "m15", "m2", "m3", "m7"],
    maxAttendees: 20
  },
  {
    id: "3",
    name: "Yoga Flow",
    time: "13:00",
    endTime: "14:00",
    tags: ["YOGA"],
    instructor: instructors[2],
    attendees: [
      "m1",
      "m2",
      "m3",
      "m4",
      "m5",
      "m6",
      "m7",
      "m8",
      "m9",
      "m10",
      "m11",
      "m12",
      "m13",
      "m14",
      "m15"
    ],
    maxAttendees: 25
  },
  {
    id: "4",
    name: "MMA Striking",
    time: "14:30",
    endTime: "15:30",
    tags: ["MMA", "BJJ"],
    instructor: instructors[3],
    attendees: [
      "m1",
      "m2",
      "m3",
      "m4",
      "m5",
      "m6",
      "m7",
      "m8",
      "m9",
      "m10",
      "m11",
      "m12",
      "m13",
      "m14",
      "m15",
      "m2",
      "m3",
      "m4"
    ],
    maxAttendees: 30
  },
  {
    id: "5",
    name: "BJJ Fundamentals",
    time: "16:00",
    endTime: "17:00",
    tags: ["BJJ"],
    instructor: instructors[4],
    attendees: [
      "m1",
      "m2",
      "m3",
      "m4",
      "m5",
      "m6",
      "m7",
      "m8",
      "m9",
      "m10",
      "m11",
      "m12",
      "m13",
      "m14",
      "m15",
      "m2",
      "m3",
      "m4",
      "m5",
      "m6"
    ],
    maxAttendees: 30
  },
  {
    id: "6",
    name: "Kids MMA",
    time: "17:30",
    endTime: "18:30",
    tags: ["KIDS", "MMA"],
    instructor: instructors[5],
    attendees: ["m6", "m9", "m13", "m14", "m15", "m2", "m3", "m7", "m8", "m10"],
    maxAttendees: 20
  }
];

export const formatDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return now.toLocaleDateString("en-US", options).toUpperCase();
};
