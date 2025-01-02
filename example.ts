type Question = {
  questionNumber: number;
  questionText: string;
  totalMarks: number | null;
};

type EvaluationCriteria = {
  criteria: {
    description: string;
    marks: number;
  }[];
};

interface Criterion {
  criteria: string;
  marks: number;
}

const criteriaData = `
Evaluation Criteria for Question 1:
Criteria: Regno di Sicilia
marks: 1
Criteria: Sud Italia
marks: 1
Criteria: Costanza d'Altavilla
marks: 2
Criteria: Costituzioni melfitane
marks: 1.5
Criteria: distruzione dei castelli - revoca privilege
marks: 1.5
Criteria: funzionari
marks: 1.5
Criteria: apertura culturale e tolleranza religiosa
marks: 1.5

Evaluation Criteria for Question 2:
Criteria: questione geopolitica/accerchiamento Stato della Chiesa
marks: 3
Criteria: Innocenzo III, Onorio III
marks: 1
Criteria: Gregorio IX
marks: 1.5
Criteria: Innocenzo IV
marks: 1.5
Criteria: strumento della scomunica
marks: 3
`;

// Function to parse the criteria data and convert it to JSON
function parseCriteria(data: string) {
  const questions = [];
  const questionPattern = /Evaluation Criteria for Question (\d+):/g;
  const criteriaPattern = /Criteria: (.+?)\nmarks: ([\d.]+)/g;

  let questionMatches;
  let criteriaMatches;

  // Loop through all questions in the text
  while ((questionMatches = questionPattern.exec(data)) !== null) {
    const questionNumber = questionMatches[1];
    const criteriaList = [];

    // Find all criteria for the current question
    while ((criteriaMatches = criteriaPattern.exec(data)) !== null) {
      const criteriaText = criteriaMatches[1];
      const marks = parseFloat(criteriaMatches[2]);

      criteriaList.push({ criteria: criteriaText, marks });

      // Stop once we move to the next question
      if (data.indexOf(criteriaMatches.index + "") > questionMatches.index) {
        break;
      }
    }

    questions.push({ question: questionNumber, criteria: criteriaList });
  }

  return questions;
}

// Parse the criteria data and log the result
const parsedData = parseCriteria(criteriaData);
console.log(JSON.stringify(parsedData, null, 2));
