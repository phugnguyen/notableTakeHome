import R from 'ramda';

interface Option {
  id: number;
  text: string;
}

interface Conditions {
  optionId: number;
  isSelcted: boolean;
  questionId: number;
}

interface Question {
  questionId: number;
  multipleOptions: boolean;
  options: Option[]; // ["A"]
  conditions: Conditions[];
}

interface Answers {
  questionId: number;
  selectedOptions: Option[];
}

interface PatientsAnswers {
  answers: Answers[];
}

const q1: Question = {
  questionId: 1,
  multipleOptions: false,
  options: [
    {
      id: 1,
      text: "A"
    },
    {
      id: 2,
      text: "B"
    },
    {
      id: 3,
      text: "C"
    }
  ],
  conditions: [],
}

const q2: Question = {
  questionId: 2,
  multipleOptions: true,
  options: [
    {
      id: 1,
      text: "A"
    },
    {
      id: 2,
      text: "B"
    },
    {
      id: 3,
      text: "C"
    }
  ],
  conditions: [
    {
      optionId: 1,
      isSelcted: true,
      questionId: 1
    }
  ],
}

const patientAnswer: PatientsAnswers = {
  answers: [
    {
      questionId: 1,
      selectedOptions: [
        {
          id: 2,
          text: "B"
        },
      ]
    }
  ]
}

const questions: Question[] = [q1, q2]

const checkCondition = (answers: PatientsAnswers, questions: Question[]): Question[] => {
  let results: Question[] = [];
  for (const question of questions) {
    if (question.conditions.length === 0){
      results.push(question);
    } else {
      question.conditions.forEach(condition => {
        if (condition.isSelcted) {
          // see if optionId and questionid exist in answer
          answers.answers.forEach(answer => {
            if (answer.questionId === condition.questionId && answer.selectedOptions.some(option => option.id === condition.optionId)) {
              results.push(question);
            }
          })
        }
      })
    }
  }

  return results;
}

console.log(checkCondition(patientAnswer, questions));