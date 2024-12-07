export interface Calculation {
  answer: number;
  digits: number[];
}

enum CalculationOperator {
  ADD,
  MULTIPLY,
}
export const CALCULATION_OPERATORS = [
  CalculationOperator.ADD,
  CalculationOperator.MULTIPLY,
];

export const stringToCalculation = (input: string): Calculation => {
  const [ans, rest] = input.split(': ');
  const nums = rest.split(' ');
  return {
    answer: parseInt(ans, 10),
    digits: nums.map((n) => {
      return parseInt(n, 10);
    }),
  };
};

interface RecursiveCalcAnswer {
  valid: boolean;
}

export const doRecursiveCalculationLookingForAnswer = (
  operators: CalculationOperator[],
  numbers: number[],
  answer: number,
  validity: RecursiveCalcAnswer
): number => {
  const [first, second, ...rest] = numbers;
  if (operators.length === 0) {
    throw new Error('need at least one operator');
  }
  let recursiveAns = 0;
  for (const operator of operators) {
    if (numbers.length === 2) {
      if (operator === CalculationOperator.ADD) {
        if (first + second === answer) {
          validity.valid = true;
          return first + second;
        }
        if (first * second === answer) {
          validity.valid = true;
          return first * second;
        }
      }
      return 0;
    } else if (operator === CalculationOperator.ADD) {
      recursiveAns = doRecursiveCalculationLookingForAnswer(
        operators,
        [first + second, ...rest],
        answer,
        validity
      );
    } /*if (operator === CalculationOperator.MULTIPLY) */ else {
      recursiveAns = doRecursiveCalculationLookingForAnswer(
        operators,
        [first * second, ...rest],
        answer,
        validity
      );
      return recursiveAns;
    }
  }
  return recursiveAns;
};

export const isValidCalculation = (calculation: Calculation) => {
  const validity: RecursiveCalcAnswer = { valid: false };
  const calculationAnswer = doRecursiveCalculationLookingForAnswer(
    CALCULATION_OPERATORS,
    calculation.digits,
    calculation.answer,
    validity
  );
  return {
    valid: validity.valid,
    answer: calculationAnswer,
  };
};
