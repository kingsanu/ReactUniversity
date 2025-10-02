// MIL Test Utilities for Development

import {
  MILExam,
  MILQuestion,
  MILExamMetadata,
  MILSession,
} from "@/services/milService";

/**
 * Generate mock MIL exam data for testing
 */
export function generateMockMILExam(
  examId: string,
  type: number = 1,
  language: "english" | "spanish" = "english"
): MILExam {
  const examTypes = {
    1: {
      name:
        language === "spanish"
          ? "Reconocimiento de Patrones"
          : "Pattern Recognition",
      description:
        language === "spanish"
          ? "Identificar pares de letras coincidentes"
          : "Identify matching letter pairs",
    },
    2: {
      name:
        language === "spanish"
          ? "Razonamiento Verbal - Comparaciones"
          : "Verbal Reasoning",
      description:
        language === "spanish"
          ? "Esta prueba evalúa la capacidad de comparar y ordenar características de diferentes individuos"
          : "Language comprehension tasks",
    },
    3: {
      name: language === "spanish" ? "Memoria de Trabajo" : "Working Memory",
      description:
        language === "spanish"
          ? "Tareas de memoria y procesamiento"
          : "Memory and processing tasks",
    },
    4: {
      name: language === "spanish" ? "Velocidad Numérica" : "Numeric Velocity",
      description:
        language === "spanish"
          ? "Tareas de aritmética rápida"
          : "Speed arithmetic tasks",
    },
    5: {
      name: language === "spanish" ? "Rotación Visual" : "Visual Rotation",
      description:
        language === "spanish"
          ? "Tareas de razonamiento espacial"
          : "Spatial reasoning tasks",
    },
  };

  const examInfo = examTypes[type as keyof typeof examTypes] || examTypes[1];

  const questions: MILQuestion[] = [];

  // Generate questions based on type
  for (let i = 1; i <= 60; i++) {
    if (type === 1) {
      // Pattern Recognition - Letter pairs
      const questionText =
        language === "spanish"
          ? "Identifique cuántos de estos pares de letras son iguales (sin importar si una letra es mayúscula o minúscula)."
          : "How many letter pairs match?";

      questions.push({
        questionNumber: i,
        questionText: questionText,
        type: 1,
        data: {
          letterPairs: [
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
          ],
        },
        explanation:
          language === "spanish"
            ? "Cuente el número de pares de letras donde la letra superior y la inferior son iguales, sin importar mayúsculas o minúsculas."
            : "Count the number of letter pairs where the top and bottom letters are the same.",
      });
    } else if (type === 2) {
      // Verbal Reasoning
      if (language === "spanish") {
        // Use Spanish comparative reasoning questions
        const spanishQuestions = generateSpanishVerbalReasoningExam().questions;
        const questionIndex = (i - 1) % spanishQuestions.length;
        questions.push(spanishQuestions[questionIndex]);
      } else {
        // English verbal reasoning
        questions.push({
          questionNumber: i,
          questionText: `Which word best completes the analogy?`,
          type: 2,
          data: {
            statements: [`Cat is to Kitten as Dog is to ___`],
            options: ["Puppy", "Bark", "Tail", "Bone", "Walk"],
          },
          explanation:
            "Find the relationship between the first pair and apply it to the second pair.",
        });
      }
    } else if (type === 4) {
      // Numeric Velocity - Find which extreme number is farther from the middle
      const questionText =
        language === "spanish"
          ? "Encuentre el número más alto y el número más bajo entre los tres valores. Decida cuál de los extremos está más alejado del número intermedio."
          : "Find the highest and lowest number among the three values. Decide which extreme is farther from the middle number.";

      // Generate three random numbers for the question
      const num1 = Math.floor(Math.random() * 30) + 1;
      const num2 = Math.floor(Math.random() * 30) + 1;
      const num3 = Math.floor(Math.random() * 30) + 1;

      questions.push({
        questionNumber: i,
        questionText: questionText,
        type: 4,
        data: {
          numbers: [num1, num2, num3],
          options: [`${num1}`, `${num2}`, `${num3}`],
        },
        explanation:
          language === "spanish"
            ? `Identifique el número más alto y más bajo entre ${num1}, ${num2}, ${num3}. Determine cuál extremo está más alejado del número intermedio.`
            : `Identify the highest and lowest numbers among ${num1}, ${num2}, ${num3}. Determine which extreme is farther from the middle number.`,
      });
    } else {
      // Generic question for other types
      questions.push({
        questionNumber: i,
        questionText: `Question ${i} for ${examInfo.name}`,
        type: type,
        data: {
          options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
        },
        explanation: `This is a ${examInfo.name} question.`,
      });
    }
  }

  return {
    id: examId,
    name: examInfo.name,
    description: examInfo.description,
    type: type,
    timeLimitMinutes: type === 4 ? 4 : 3, // Numeric velocity has 4 minutes, others have 3
    totalQuestions: questions.length,
    questions: questions,
  };
}

/**
 * Generate mock MIL exam metadata
 */
export function generateMockMILExamMetadata(
  language: "english" | "spanish" = "english"
): MILExamMetadata[] {
  return [
    {
      id: "pattern-recognition-001",
      name:
        language === "spanish"
          ? "Reconocimiento de Patrones"
          : "Pattern Recognition",
      description:
        language === "spanish"
          ? "Identificar pares de letras coincidentes y patrones"
          : "Identify matching letter pairs and patterns",
      type: 1,
      timeLimitMinutes: 3,
      totalQuestions: 60,
    },
    {
      id: "verbal-reasoning-001",
      name:
        language === "spanish"
          ? "Razonamiento Verbal - Comparaciones"
          : "Verbal Reasoning",
      description:
        language === "spanish"
          ? "Esta prueba evalúa la capacidad de comparar y ordenar características de diferentes individuos"
          : "Language comprehension and analogies",
      type: 2,
      timeLimitMinutes: 4,
      totalQuestions: 50,
    },
    {
      id: "working-memory-001",
      name: language === "spanish" ? "Memoria de Trabajo" : "Working Memory",
      description:
        language === "spanish"
          ? "Tareas de memoria y procesamiento cognitivo"
          : "Memory and cognitive processing tasks",
      type: 3,
      timeLimitMinutes: 5,
      totalQuestions: 30,
    },
    {
      id: "numeric-velocity-001",
      name: language === "spanish" ? "Velocidad Numérica" : "Numeric Velocity",
      description:
        language === "spanish"
          ? "Aritmética rápida y secuencias numéricas"
          : "Speed arithmetic and number sequences",
      type: 4,
      timeLimitMinutes: 4,
      totalQuestions: 50,
    },
    {
      id: "visual-rotation-001",
      name: "Visual Rotation",
      description: "Spatial reasoning and mental rotation",
      type: 5,
      timeLimitMinutes: 4,
      totalQuestions: 35,
    },
  ];
}

/**
 * Create a mock MIL session for testing
 */
export function createMockMILSession(
  examId: string,
  completed: boolean = false,
  language: "english" | "spanish" = "english"
): MILSession {
  const session: MILSession = {
    examId,
    startTime: new Date().toISOString(),
    answers: [],
    currentQuestion: 0,
    isCompleted: completed,
  };

  if (completed) {
    // Add some mock answers
    for (let i = 1; i <= 10; i++) {
      session.answers.push({
        questionNumber: i,
        answer: Math.floor(Math.random() * 5),
        timeSpent: Math.floor(Math.random() * 30) + 10,
        timestamp: new Date().toISOString(),
      });
    }
    session.currentQuestion = 10;
  }

  return session;
}

/**
 * Get random letter for pattern recognition questions
 */
function getRandomLetter(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

/**
 * Clear all MIL test data
 */
export function clearAllMILTestData(): void {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("mil_")) {
      localStorage.removeItem(key);
    }
  });
  console.log("Cleared all MIL test data");
}

/**
 * Generate Spanish verbal reasoning exam with comparative questions
 */
export function generateSpanishVerbalReasoningExam(): MILExam {
  const questions: MILQuestion[] = [
    {
      questionNumber: 1,
      questionText:
        "Juan es más lento que Jesús. Juan es más rápido que Pedro. ¿Quién es más lento?",
      type: 2,
      data: {
        options: ["Juan", "Jesús", "Pedro"],
      },
      explanation:
        "Juan es más rápido que Pedro, pero más lento que Jesús. Por lo tanto, Pedro es el más lento.",
      correctAnswer: 2,
    },
    {
      questionNumber: 2,
      questionText:
        "Laura es más baja que Paula. Laura es más alta que Eva. ¿Quién es más alta?",
      type: 2,
      data: {
        options: ["Laura", "Paula", "Eva"],
      },
      explanation:
        "Paula es más alta que Laura, y Laura es más alta que Eva. Por lo tanto, Paula es la más alta.",
      correctAnswer: 1,
    },
    {
      questionNumber: 3,
      questionText:
        "Silvia es más inteligente que Lourdes. Silvia es más torpe que Rocío. ¿Quién es más inteligente?",
      type: 2,
      data: {
        options: ["Silvia", "Lourdes", "Rocío"],
      },
      explanation:
        "Rocío es más inteligente que Silvia, y Silvia es más inteligente que Lourdes. Por lo tanto, Rocío es la más inteligente.",
      correctAnswer: 2,
    },
    {
      questionNumber: 4,
      questionText:
        "Pablo está más triste que Luis. Pedro está más triste que Pablo. ¿Quién está más feliz?",
      type: 2,
      data: {
        options: ["Pablo", "Luis", "Pedro"],
      },
      explanation:
        "Pedro está más triste que Pablo, y Pablo está más triste que Luis. Por lo tanto, Luis está más feliz.",
      correctAnswer: 1,
    },
    {
      questionNumber: 5,
      questionText:
        "Aníbal tiene más frío que Carlos. David tiene más frío que Aníbal. ¿Quién tiene más frío?",
      type: 2,
      data: {
        options: ["Aníbal", "Carlos", "David"],
      },
      explanation:
        "David tiene más frío que Aníbal, y Aníbal tiene más frío que Carlos. Por lo tanto, David tiene más frío.",
      correctAnswer: 2,
    },
  ];

  return {
    id: "verbal-reasoning-001",
    name: "Razonamiento Verbal - Comparaciones",
    description:
      "Esta prueba evalúa la capacidad de comparar y ordenar características de diferentes individuos",
    type: 2,
    timeLimitMinutes: 4,
    totalQuestions: questions.length,
    questions: questions,
  };
}

/**
 * Get pattern recognition instructions in the specified language
 */
export function getPatternRecognitionInstructions(
  language: "english" | "spanish" = "english"
): string {
  if (language === "spanish") {
    return `Esta prueba evalúa la rapidez y precisión con la que las personas realizan mentalmente una tarea de verificación.

Instrucciones básicas:
Cada recuadro consta de cuatro pares de letras. Identifique cuántos de estos pares son iguales (sin importar si una letra es mayúscula o minúscula).

Cómo responder:
Marque con un círculo el número que corresponde a la cantidad de pares iguales en cada bloque.

Ejemplo práctico:
En el primer par: A y a, las letras son iguales. En el segundo par: B y c, las letras no son iguales.
Los pares ubicados en la tercera columna (D y d) y la cuarta columna (R y r) son iguales. Por lo tanto, en este bloque hay tres pares iguales, y la respuesta correcta sería marcar el número 3.

Tiempo límite:
Dispondrá de 3 minutos para completar esta prueba.

Si tiene alguna pregunta, consulte con el evaluador antes de iniciar.`;
  } else {
    return `This test evaluates the speed and accuracy with which people perform a mental verification task.

Basic Instructions:
Each box consists of four pairs of letters. Identify how many of these pairs are the same (regardless of whether a letter is uppercase or lowercase).

How to respond:
Circle the number that corresponds to the number of matching pairs in each block.

Practical Example:
In the first pair: A and a, the letters are the same. In the second pair: B and c, the letters are not the same.
The pairs in the third column (D and d) and fourth column (R and r) are the same. Therefore, in this block there are three matching pairs, and the correct answer would be to circle the number 3.

Time limit:
You will have 3 minutes to complete this test.

If you have any questions, consult with the evaluator before starting.`;
  }
}

/**
 * Get numeric velocity instructions in the specified language
 */
export function getNumericVelocityInstructions(
  language: "english" | "spanish" = "english"
): string {
  if (language === "spanish") {
    return `Esta prueba evalúa la rapidez y eficacia con la que las personas realizan mentalmente una tarea numérica simple.

Instrucciones:
Encuentre el número más alto y el número más bajo entre los tres valores que se presentan.
Decida si el número más alto o el más bajo está más alejado del número intermedio.

Ejemplo 1:
3 [A] 5 [B] 9 [C]
En este caso, los números están ordenados de menor a mayor. El número 3 es el más bajo y el número 9 es el más alto. El número intermedio es el 5. Ahora determine cuál de los extremos (3 o 9) está más alejado del número 5.

Respuesta: El número 9 está más alejado del 5. Por lo tanto, la respuesta correcta es la letra C, correspondiente al número 9.

Ejemplo 2:
11 [A] 2 [B] 4 [C]
En este caso, los números no están ordenados de menor a mayor. Identifique el número más bajo (2) y el número más alto (11). El número intermedio es el 4. Determine cuál de los extremos (2 o 11) está más alejado del número 4.

Respuesta: El número 11 está más alejado del 4. Por lo tanto, la respuesta correcta es la letra A, correspondiente al número 11.

Tiempo límite:
Dispone de 4 minutos para completar esta prueba.

Si tiene alguna duda, consulte con el evaluador antes de iniciar.`;
  } else {
    return `This test evaluates the speed and efficiency with which people perform simple mental numeric tasks.

Instructions:
Find the highest and lowest number among the three values presented.
Decide if the highest or lowest number is farther from the middle number.

Example 1:
3 [A] 5 [B] 9 [C]
In this case, the numbers are ordered from lowest to highest. Number 3 is the lowest and number 9 is the highest. The middle number is 5. Now determine which of the extremes (3 or 9) is farther from the number 5.

Answer: Number 9 is farther from 5. Therefore, the correct answer is letter C, corresponding to number 9.

Example 2:
11 [A] 2 [B] 4 [C]
In this case, the numbers are not ordered from lowest to highest. Identify the lowest number (2) and the highest number (11). The middle number is 4. Determine which of the extremes (2 or 11) is farther from the number 4.

Answer: Number 11 is farther from 4. Therefore, the correct answer is letter A, corresponding to number 11.

Time limit:
You have 4 minutes to complete this test.

If you have any questions, consult with the evaluator before starting.`;
  }
}

/**
 * Populate test data for MIL assessment
 */
export function populateMILTestData(
  language: "english" | "spanish" = "english"
): void {
  const exams = generateMockMILExamMetadata(language);

  // Create some completed sessions
  const completedExams = ["pattern-recognition-001", "verbal-reasoning-001"];
  localStorage.setItem("mil_completed_exams", JSON.stringify(completedExams));

  // Create mock sessions
  exams.forEach((exam) => {
    const isCompleted = completedExams.includes(exam.id);
    const session = createMockMILSession(exam.id, isCompleted, language);
    localStorage.setItem(`mil_session_${exam.id}`, JSON.stringify(session));
  });

  console.log("Populated MIL test data");
}

// Make functions available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).milTestUtils = {
    generateMockMILExam,
    generateMockMILExamMetadata,
    createMockMILSession,
    clearAllMILTestData,
    populateMILTestData,
  };
}
