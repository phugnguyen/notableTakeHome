
interface Question {
  questionId: number;
  multipleOptions: boolean;
  options: Option[];
  conditions: Condition[];
}

interface Condition {
  questionId: number;
  selected: boolean;
  optionId: number;
}

interface Option {
  optionId: number;
  text: string;
  selected: boolean;
}

interface Answer {
  questionId: number;
  selectedOptions: Option[];
}

interface PatientAnswers {
  answers: Answer[];
  // dateCompleted ...
}

const renderQuestions =
  (patientAnswers: PatientAnswers, questions: Question[]): Question[] => {
    
  }