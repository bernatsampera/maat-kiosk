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
  tags: Array<'KIDS' | 'YOGA' | 'MMA' | 'BJJ'>;
  instructor: Instructor;
  attendees: number;
  maxAttendees: number;
}

export const instructors: Instructor[] = [
  {
    id: '1',
    name: 'Lautaro S.',
    avatar: undefined, // Would be actual image URL
    initials: 'LS'
  },
  {
    id: '2',
    name: 'Maria G.',
    avatar: undefined,
    initials: 'MG'
  },
  {
    id: '3',
    name: 'John D.',
    avatar: undefined,
    initials: 'JD'
  },
  {
    id: '4',
    name: 'Sarah K.',
    avatar: undefined,
    initials: 'SK'
  },
  {
    id: '5',
    name: 'Carlos R.',
    avatar: undefined,
    initials: 'CR'
  },
  {
    id: '6',
    name: 'Emma L.',
    avatar: undefined,
    initials: 'EL'
  }
];

export const todayClasses: ClassData[] = [
  {
    id: '1',
    name: 'BJJ / Grappling',
    time: '10:00',
    endTime: '11:00',
    tags: ['BJJ', 'MMA'],
    instructor: instructors[0],
    attendees: 12,
    maxAttendees: 30
  },
  {
    id: '2',
    name: 'Kids BJJ',
    time: '11:30',
    endTime: '12:30',
    tags: ['KIDS', 'BJJ'],
    instructor: instructors[1],
    attendees: 8,
    maxAttendees: 20
  },
  {
    id: '3',
    name: 'Yoga Flow',
    time: '13:00',
    endTime: '14:00',
    tags: ['YOGA'],
    instructor: instructors[2],
    attendees: 15,
    maxAttendees: 25
  },
  {
    id: '4',
    name: 'MMA Striking',
    time: '14:30',
    endTime: '15:30',
    tags: ['MMA', 'BJJ'],
    instructor: instructors[3],
    attendees: 18,
    maxAttendees: 30
  },
  {
    id: '5',
    name: 'BJJ Fundamentals',
    time: '16:00',
    endTime: '17:00',
    tags: ['BJJ'],
    instructor: instructors[4],
    attendees: 20,
    maxAttendees: 30
  },
  {
    id: '6',
    name: 'Kids MMA',
    time: '17:30',
    endTime: '18:30',
    tags: ['KIDS', 'MMA'],
    instructor: instructors[5],
    attendees: 10,
    maxAttendees: 20
  }
];

export const formatDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  return now.toLocaleDateString('en-US', options).toUpperCase();
};