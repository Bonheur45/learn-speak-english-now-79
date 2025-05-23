
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

// Add writing assignments for each day
const addWritingAssignmentsForDays = () => {
  for (let dayNum = 1; dayNum <= 10; dayNum++) {
    const dayId = `day-${dayNum}`;
    if (!assignmentDatabase["example-course"][dayId]) {
      assignmentDatabase["example-course"][dayId] = {};
    }
    
    // Add writing assignment if it doesn't exist
    if (!assignmentDatabase["example-course"][dayId]["writing-assignment-1"]) {
      assignmentDatabase["example-course"][dayId]["writing-assignment-1"] = {
        title: `Day ${dayNum} Writing Assessment`,
        prompt: getPromptForDay(dayNum),
        promptDetails: getPromptDetailsForDay(dayNum),
        wordCount: 150 + (dayNum * 10), // Gradually increase word count
        timeLimit: 20 + (dayNum * 2) // Gradually increase time limit
      };
    }
  }
};

const getPromptForDay = (dayNum: number): string => {
  const prompts = [
    "Write about your daily routine and how you spend your time.",
    "Do you think technology has improved the way we learn? Why or why not?",
    "Write a short story that begins with the sentence: 'The door opened unexpectedly.'",
    "Describe your ideal vacation destination and explain why you would like to visit there.",
    "Write about a person who has influenced your life and explain how they have helped you grow.",
    "Do you prefer living in a city or in the countryside? Give reasons for your preference.",
    "Write about a memorable experience from your childhood that taught you an important lesson.",
    "Should students be required to learn a second language? Support your opinion with examples.",
    "Describe a challenge you have overcome and explain what you learned from the experience.",
    "Write about how you think education will change in the next 20 years."
  ];
  return prompts[dayNum - 1] || prompts[0];
};

const getPromptDetailsForDay = (dayNum: number): string => {
  const details = [
    "Include activities you do in the morning, afternoon, and evening. Explain which part of the day you enjoy the most and why.",
    "Consider both the advantages and disadvantages of using technology in education. Support your opinion with specific examples.",
    "Your story should have a clear beginning, middle, and end. Include at least two characters and some dialogue.",
    "Consider factors like climate, culture, activities, and food. Describe what makes this place special to you.",
    "Explain specific ways this person has impacted your thinking, behavior, or goals. Use concrete examples.",
    "Compare the advantages and disadvantages of both environments. Consider factors like lifestyle, opportunities, and personal preferences.",
    "Describe the situation clearly and explain the specific lesson you learned. How has this experience shaped who you are today?",
    "Think about the benefits and challenges of multilingual education. Use examples from your own experience or observations.",
    "Describe the challenge in detail and explain the steps you took to overcome it. What skills or knowledge did you gain?",
    "Consider technology, teaching methods, student needs, and global trends. Be specific about the changes you predict."
  ];
  return details[dayNum - 1] || details[0];
};

// Initialize writing assignments for all days
addWritingAssignmentsForDays();

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
