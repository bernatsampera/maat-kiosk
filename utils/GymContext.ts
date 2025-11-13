import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Member, Instructor, ClassData, members, instructors, todayClasses } from '@/lib/mockData';

interface GymContextType {
  // State
  classes: ClassData[];
  members: Member[];
  instructors: Instructor[];

  // Functions
  checkInMember: (classId: string, memberId: string) => void;
  getCheckedInMembers: (classId: string) => Member[];
  getClassById: (id: string) => ClassData | undefined;
  getAllMembers: () => Member[];
}

const GymContext = createContext<GymContextType | undefined>(undefined);

interface GymProviderProps {
  children: ReactNode;
}

export function GymProvider({ children }: GymProviderProps) {
  const [classes, setClasses] = useState<ClassData[]>(todayClasses);
  const [membersList] = useState<Member[]>(members);
  const [instructorsList] = useState<Instructor[]>(instructors);

  const checkInMember = async (classId: string, memberId: string) => {
    setClasses(prevClasses =>
      prevClasses.map(cls => {
        if (cls.id === classId) {
          // Check if member is already checked in
          if (cls.attendees.includes(memberId)) {
            return cls; // Already checked in, no change
          }
          // Add member to attendees
          return {
            ...cls,
            attendees: [...cls.attendees, memberId]
          };
        }
        return cls;
      })
    );
  };

  const getCheckedInMembers = (classId: string): Member[] => {
    const classData = classes.find(cls => cls.id === classId);
    if (!classData) return [];

    return classData.attendees
      .map(memberId => membersList.find(member => member.id === memberId))
      .filter((member): member is Member => member !== undefined);
  };

  const getClassById = (id: string): ClassData | undefined => {
    return classes.find(cls => cls.id === id);
  };

  const getAllMembers = (): Member[] => {
    return membersList;
  };

  const value: GymContextType = {
    classes,
    members: membersList,
    instructors: instructorsList,
    checkInMember,
    getCheckedInMembers,
    getClassById,
    getAllMembers,
  };

  return React.createElement(
    GymContext.Provider,
    { value },
    children
  );
}

export function useGym(): GymContextType {
  const context = useContext(GymContext);
  if (context === undefined) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}