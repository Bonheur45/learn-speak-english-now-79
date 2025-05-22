
interface AssignmentDetails {
  title: string;
  prompt: string;
  promptDetails?: string;
  wordCount?: number;
  timeLimit?: number;
}

// This mock database could be replaced with a real database integration
// when connecting to your actual e-learning platform
const assignmentDatabase: Record<string, Record<string, Record<string, AssignmentDetails>>> = {
  "example-course": {
    "day-1": {
      "writing-assignment-1": {
        title: "Daily Journal Entry",
        prompt: "Write about your daily routine and how you spend your time.",
        promptDetails: "Include activities you do in the morning, afternoon, and evening. Explain which part of the day you enjoy the most and why.",
        wordCount: 150,
        timeLimit: 20
      }
    },
    "day-2": {
      "writing-assignment-1": {
        title: "Opinion Essay",
        prompt: "Do you think technology has improved the way we learn? Why or why not?",
        promptDetails: "Consider both the advantages and disadvantages of using technology in education. Support your opinion with specific examples.",
        wordCount: 200,
        timeLimit: 30
      }
    },
    "day-3": {
      "writing-assignment-1": {
        title: "Story Writing",
        prompt: "Write a short story that begins with the sentence: 'The door opened unexpectedly.'",
        promptDetails: "Your story should have a clear beginning, middle, and end. Include at least two characters and some dialogue.",
        wordCount: 250,
        timeLimit: 40
      }
    }
  },
  "beginner-english": {
    "lesson-1": {
      "practice-essay": {
        title: "Self Introduction",
        prompt: "Write a short paragraph introducing yourself.",
        promptDetails: "Include your name, age, where you're from, and some of your hobbies or interests.",
        wordCount: 100,
        timeLimit: 15
      }
    },
    "lesson-2": {
      "practice-essay": {
        title: "My Family",
        prompt: "Write about your family members and what they like to do.",
        promptDetails: "Describe at least two family members. What do they look like? What are their personalities like?",
        wordCount: 120,
        timeLimit: 20
      }
    }
  }
};

export const getAssignmentDetails = (
  courseId: string,
  lessonId: string,
  assignmentId: string
): AssignmentDetails => {
  // Try to find the assignment in our database
  try {
    if (
      assignmentDatabase[courseId] &&
      assignmentDatabase[courseId][lessonId] &&
      assignmentDatabase[courseId][lessonId][assignmentId]
    ) {
      return assignmentDatabase[courseId][lessonId][assignmentId];
    }
  } catch (error) {
    console.error("Error fetching assignment details:", error);
  }
  
  // Return default assignment details if not found
  return {
    title: "Writing Assessment",
    prompt: "Write an essay on the given topic.",
    promptDetails: "Your response will be assessed based on vocabulary usage, grammar, coherence, and complexity."
  };
};
