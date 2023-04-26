export const isPositiveInteger = (numberAsString: string): boolean => {
  try {
    const number = parseFloat(numberAsString);
    return Number.isInteger(number) && number > 0;
  }
  catch(error: any) {
    return false;
  }
};
