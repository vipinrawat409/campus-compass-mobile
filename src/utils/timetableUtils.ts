
// Types for timetable generation
type Subject = {
  id: string;
  name: string;
  periodsPerWeek: number;
  requiresSpecialRoom?: boolean;
};

type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  classes: string[];
  unavailablePeriods?: { day: string; period: number }[];
  absent?: boolean;
};

type Room = {
  id: string;
  name: string;
  type: 'regular' | 'lab' | 'computerLab' | 'artRoom' | 'musicRoom' | 'playground';
};

type TimeSlot = {
  day: string;
  period: number;
  time: string;
};

type Assignment = {
  class: string;
  subject: Subject;
  teacher: Teacher;
  room: Room;
  timeSlot: TimeSlot;
};

type Conflict = {
  type: 'teacher' | 'room' | 'class';
  description: string;
  resolution: string;
};

// Mock data for timetable generation
const mockSubjects: Subject[] = [
  { id: 's1', name: 'Mathematics', periodsPerWeek: 6 },
  { id: 's2', name: 'Science', periodsPerWeek: 4, requiresSpecialRoom: true },
  { id: 's3', name: 'English', periodsPerWeek: 5 },
  { id: 's4', name: 'History', periodsPerWeek: 3 },
  { id: 's5', name: 'Geography', periodsPerWeek: 3 },
  { id: 's6', name: 'Computer Science', periodsPerWeek: 2, requiresSpecialRoom: true },
  { id: 's7', name: 'Physical Education', periodsPerWeek: 2 },
  { id: 's8', name: 'Art', periodsPerWeek: 2, requiresSpecialRoom: true },
  { id: 's9', name: 'Music', periodsPerWeek: 1, requiresSpecialRoom: true },
];

const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Mr. Johnson', subjects: ['Mathematics'], classes: ['10-A', '9-A', '8-B'] },
  { id: 't2', name: 'Mrs. Smith', subjects: ['Science'], classes: ['10-A', '10-B', '9-B'] },
  { id: 't3', name: 'Ms. Davis', subjects: ['English'], classes: ['10-A', '9-A', '8-A', '7-B'] },
  { id: 't4', name: 'Mr. Wilson', subjects: ['History'], classes: ['10-A', '10-B', '9-A', '9-B'] },
  { id: 't5', name: 'Mrs. Taylor', subjects: ['Geography'], classes: ['10-A', '9-B', '8-A', '7-A'] },
  { id: 't6', name: 'Mr. Brown', subjects: ['Computer Science'], classes: ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B'] },
  { id: 't7', name: 'Mr. Thomas', subjects: ['Physical Education'], classes: ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'] },
  { id: 't8', name: 'Ms. Roberts', subjects: ['Art'], classes: ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'] },
  { id: 't9', name: 'Mr. Martin', subjects: ['Music'], classes: ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'] },
  { id: 't10', name: 'Dr. Lewis', subjects: ['Science'], classes: ['8-A', '8-B', '7-A', '7-B'] },
  { id: 't11', name: 'Mrs. Clark', subjects: ['Science'], classes: ['9-A', '9-B', '8-A', '8-B'] },
  { id: 't12', name: 'Mr. Rodriguez', subjects: ['Mathematics'], classes: ['7-A', '7-B', '8-A'] },
  { id: 't13', name: 'Ms. White', subjects: ['English'], classes: ['10-B', '9-B', '8-B', '7-A'] },
  { id: 't14', name: 'Mrs. Harris', subjects: ['History'], classes: ['8-A', '8-B', '7-A', '7-B'] },
  { id: 't15', name: 'Dr. Anderson', subjects: ['Geography'], classes: ['10-B', '9-A', '8-B', '7-B'] },
];

const mockRooms: Room[] = [
  { id: 'r1', name: 'Room 101', type: 'regular' },
  { id: 'r2', name: 'Room 102', type: 'regular' },
  { id: 'r3', name: 'Room 103', type: 'regular' },
  { id: 'r4', name: 'Room 104', type: 'regular' },
  { id: 'r5', name: 'Lab 1', type: 'lab' },
  { id: 'r6', name: 'Lab 2', type: 'lab' },
  { id: 'r7', name: 'Lab 3', type: 'lab' },
  { id: 'r8', name: 'Computer Lab', type: 'computerLab' },
  { id: 'r9', name: 'Art Room', type: 'artRoom' },
  { id: 'r10', name: 'Music Room', type: 'musicRoom' },
  { id: 'r11', name: 'Playground', type: 'playground' },
];

// Helper function to format time
const formatTime = (startTime: string, periodIndex: number, duration: number) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  
  // Calculate start time in minutes
  let startMinutes = hours * 60 + minutes + periodIndex * duration;
  
  // Calculate end time in minutes
  let endMinutes = startMinutes + duration;
  
  // Format start time
  const startHours = Math.floor(startMinutes / 60);
  const startMins = startMinutes % 60;
  
  // Format end time
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  
  return `${startHours.toString().padStart(2, '0')}:${startMins.toString().padStart(2, '0')} - ${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
};

// Function to check if a teacher is available for a specific timeslot
const isTeacherAvailable = (
  teacher: Teacher,
  day: string,
  period: number,
  assignments: Assignment[]
): boolean => {
  // Check if teacher is absent
  if (teacher.absent) {
    return false;
  }
  
  // Check if teacher is already assigned to this period on this day
  return !assignments.some(
    assignment => 
      assignment.timeSlot.day === day && 
      assignment.timeSlot.period === period && 
      assignment.teacher.id === teacher.id
  );
};

// Function to check if a room is available for a specific timeslot
const isRoomAvailable = (
  room: Room,
  day: string,
  period: number,
  assignments: Assignment[]
): boolean => {
  // Check if room is already assigned to this period on this day
  return !assignments.some(
    assignment => 
      assignment.timeSlot.day === day && 
      assignment.timeSlot.period === period && 
      assignment.room.id === room.id
  );
};

// Function to get a suitable room for a subject
const getSuitableRoom = (
  subject: Subject,
  day: string,
  period: number,
  assignments: Assignment[]
): Room | null => {
  let suitableRooms: Room[] = [];
  
  if (subject.requiresSpecialRoom) {
    if (subject.name === 'Science') {
      suitableRooms = mockRooms.filter(room => room.type === 'lab');
    } else if (subject.name === 'Computer Science') {
      suitableRooms = mockRooms.filter(room => room.type === 'computerLab');
    } else if (subject.name === 'Art') {
      suitableRooms = mockRooms.filter(room => room.type === 'artRoom');
    } else if (subject.name === 'Music') {
      suitableRooms = mockRooms.filter(room => room.type === 'musicRoom');
    } else if (subject.name === 'Physical Education') {
      suitableRooms = mockRooms.filter(room => room.type === 'playground');
    }
  } else {
    suitableRooms = mockRooms.filter(room => room.type === 'regular');
  }
  
  // Find first available suitable room
  return suitableRooms.find(room => isRoomAvailable(room, day, period, assignments)) || null;
};

// Function to get a teacher for a subject and class
const getTeacherForSubject = (
  subject: Subject,
  className: string,
  day: string,
  period: number,
  assignments: Assignment[]
): Teacher | null => {
  const eligibleTeachers = mockTeachers.filter(teacher => 
    teacher.subjects.includes(subject.name) && teacher.classes.includes(className) && !teacher.absent
  );
  
  // Find first available teacher
  return eligibleTeachers.find(teacher => isTeacherAvailable(teacher, day, period, assignments)) || null;
};

// Main function to generate timetable
export const generateTimetable = (settings: any) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const classes = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'];
  const periodsPerDay = settings.periodsPerDay || 8;
  const conflicts: Conflict[] = [];
  const assignments: Assignment[] = [];
  
  // For each class, assign subjects
  for (const className of classes) {
    // For each subject that should be taught to this class
    for (const subject of mockSubjects) {
      let periodsAssigned = 0;
      
      // Try to assign the required number of periods for this subject
      while (periodsAssigned < subject.periodsPerWeek) {
        // Try to find a suitable day and period
        let assigned = false;
        
        // Try each day
        for (let dayIndex = 0; dayIndex < days.length && !assigned; dayIndex++) {
          const day = days[dayIndex];
          
          // Try each period
          for (let period = 0; period < periodsPerDay && !assigned; period++) {
            // Skip breaks and lunch
            if (period === 3 || period === 6) continue;
            
            // Check if class already has a subject at this time
            const classHasSubject = assignments.some(
              assignment => 
                assignment.class === className && 
                assignment.timeSlot.day === day && 
                assignment.timeSlot.period === period
            );
            
            if (!classHasSubject) {
              // Try to find an available teacher
              const teacher = getTeacherForSubject(subject, className, day, period, assignments);
              
              if (teacher) {
                // Try to find an available room
                const room = getSuitableRoom(subject, day, period, assignments);
                
                if (room) {
                  // Create the time slot
                  const time = formatTime(settings.startTime || '08:00', period, settings.periodDuration || 45);
                  const timeSlot: TimeSlot = { day, period, time };
                  
                  // Add assignment
                  assignments.push({
                    class: className,
                    subject,
                    teacher,
                    room,
                    timeSlot
                  });
                  
                  periodsAssigned++;
                  assigned = true;
                } else {
                  // No suitable room available
                  conflicts.push({
                    type: 'room',
                    description: `No suitable room available for ${subject.name} in ${className} on ${day}, period ${period + 1}`,
                    resolution: 'Trying another period or day'
                  });
                }
              } else {
                // No teacher available
                conflicts.push({
                  type: 'teacher',
                  description: `No teacher available for ${subject.name} in ${className} on ${day}, period ${period + 1}`,
                  resolution: 'Trying another period or day'
                });
              }
            }
          }
        }
        
        // If couldn't assign all required periods, log conflict
        if (!assigned) {
          conflicts.push({
            type: 'class',
            description: `Could not assign all periods for ${subject.name} in ${className}`,
            resolution: 'Some periods may need manual assignment'
          });
          break; // Stop trying to assign more periods for this subject
        }
      }
    }
  }
  
  // Format the generated timetable for the UI
  const timetable: Record<string, any[]> = {};
  
  days.forEach(day => {
    timetable[day] = [];
  });
  
  assignments.forEach((assignment, index) => {
    const { day } = assignment.timeSlot;
    
    timetable[day].push({
      id: index + 1,
      time: assignment.timeSlot.time,
      subject: assignment.subject.name,
      teacher: assignment.teacher.name,
      room: assignment.room.name
    });
  });
  
  // Add breaks and lunch periods
  days.forEach(day => {
    if (timetable[day].length > 0) {
      // Sort by period number
      timetable[day].sort((a, b) => {
        const timeA = a.time.split(' - ')[0];
        const timeB = b.time.split(' - ')[0];
        return timeA.localeCompare(timeB);
      });
      
      // Add break after 3rd period
      const breakTime = formatTime(settings.startTime || '08:00', 3, settings.periodDuration || 45);
      timetable[day].splice(3, 0, {
        id: `break-${day}`,
        time: breakTime,
        subject: 'Break',
        teacher: '-',
        room: '-'
      });
      
      // Add lunch after 6th period (accounting for the break we just added)
      const lunchTime = formatTime(settings.startTime || '08:00', 6, settings.periodDuration || 45);
      timetable[day].splice(7, 0, {
        id: `lunch-${day}`,
        time: lunchTime,
        subject: 'Lunch',
        teacher: '-',
        room: '-'
      });
    }
  });
  
  return { timetable, conflicts };
};

// Function to find potential substitutes for an absent teacher
export const findSubstituteTeachers = (absentTeacher: string, subject: string, period: string, day: string) => {
  // Get absent teacher details
  const teacherDetails = mockTeachers.find(t => t.name === absentTeacher);
  
  if (!teacherDetails) return [];
  
  // Filter teachers who teach the same subject
  const potentialSubstitutes = mockTeachers.filter(teacher => 
    teacher.name !== absentTeacher && 
    teacher.subjects.includes(subject) && 
    !teacher.absent
  );
  
  // In a real app, we would check these teachers' schedules to see if they're available during this specific period
  return potentialSubstitutes;
};

// Function to check for conflicts when manually adjusting timetable
export const checkForConflict = (
  day: string,
  period: number,
  teacherId: string, 
  roomId: string,
  className: string,
  existingTimetable: Record<string, any[]>
): { hasConflict: boolean, message: string } => {
  // Get existing periods for this day
  const daySchedule = existingTimetable[day] || [];
  
  // Find time slots at this period
  const sameTimeSlots = daySchedule.filter(slot => {
    // Extract period number from time
    const slotTime = slot.time;
    const slotPeriod = daySchedule.indexOf(slot);
    return slotPeriod === period;
  });
  
  // Check for teacher conflicts
  const teacherConflict = sameTimeSlots.some(slot => 
    slot.teacher === mockTeachers.find(t => t.id === teacherId)?.name && 
    slot.class !== className
  );
  
  if (teacherConflict) {
    return { 
      hasConflict: true, 
      message: `Teacher already has a class during this period on ${day}.` 
    };
  }
  
  // Check for room conflicts
  const roomConflict = sameTimeSlots.some(slot => 
    slot.room === mockRooms.find(r => r.id === roomId)?.name && 
    slot.class !== className
  );
  
  if (roomConflict) {
    return { 
      hasConflict: true, 
      message: `Room is already occupied during this period on ${day}.` 
    };
  }
  
  // Check if class already has another subject at this time
  const classConflict = sameTimeSlots.some(slot => 
    slot.class === className
  );
  
  if (classConflict) {
    return { 
      hasConflict: true, 
      message: `Class already has a subject scheduled at this time on ${day}.` 
    };
  }
  
  return { hasConflict: false, message: '' };
};

// Function to mark a teacher as absent and find substitutes
export const markTeacherAbsent = (
  teacherId: string,
  date: string
): void => {
  // Find the teacher
  const teacherIndex = mockTeachers.findIndex(t => t.id === teacherId);
  if (teacherIndex >= 0) {
    mockTeachers[teacherIndex].absent = true;
  }
};

// Function to get available teachers for substitution
export const getAvailableSubstitutes = (
  subjectName: string,
  day: string,
  period: number,
  existingTimetable: Record<string, any[]>
): Teacher[] => {
  // Get all teachers who teach this subject
  const eligibleTeachers = mockTeachers.filter(teacher => 
    teacher.subjects.includes(subjectName) && !teacher.absent
  );
  
  // Check if they are available during this period
  return eligibleTeachers.filter(teacher => {
    const daySchedule = existingTimetable[day] || [];
    
    // Find periods at this time slot
    const sameTimeSlots = daySchedule.filter(slot => {
      const slotPeriod = daySchedule.indexOf(slot);
      return slotPeriod === period;
    });
    
    // Check if teacher is already teaching during this period
    return !sameTimeSlots.some(slot => slot.teacher === teacher.name);
  });
};

// Function to get class-specific timetable for the week
export const getClassTimetable = (
  className: string,
  timetable: Record<string, any[]>
): Record<string, any[]> => {
  const classTimetable: Record<string, any[]> = {};
  
  Object.keys(timetable).forEach(day => {
    classTimetable[day] = timetable[day].filter(slot => slot.class === className);
  });
  
  return classTimetable;
};

// Function to get teacher-specific timetable for the week
export const getTeacherTimetable = (
  teacherId: string,
  timetable: Record<string, any[]>
): Record<string, any[]> => {
  const teacher = mockTeachers.find(t => t.id === teacherId);
  if (!teacher) return {};
  
  const teacherName = teacher.name;
  const teacherTimetable: Record<string, any[]> = {};
  
  Object.keys(timetable).forEach(day => {
    teacherTimetable[day] = timetable[day].filter(slot => 
      slot.teacher === teacherName && 
      slot.subject !== 'Break' && 
      slot.subject !== 'Lunch'
    );
  });
  
  return teacherTimetable;
};
