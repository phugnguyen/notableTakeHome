export const transcribeText = (text: string): string => {
  const regexPattern: RegExp = /Number\s([a-z]+)\s(\w+)/g;
  const keyPhrase = "next";

  // theres probably a library for this somewhere
  const numberMap: Map<string, string> = new Map();
  numberMap.set("one", "1");
  numberMap.set("two", "2");
  numberMap.set("three", "3");
  numberMap.set("four", "4");
  numberMap.set("five", "5");
  numberMap.set("six", "6");
  numberMap.set("seven", "7");
  numberMap.set("eight", "8");
  numberMap.set("nine", "9");

  let listNumber: number = 0;

  const replaceText = (matchedString: string, number: string, nextWord: string): string => {
    let replacement: string | undefined;
    if (number === keyPhrase) {
      listNumber = listNumber ? listNumber : 1;
      replacement = listNumber.toString();
      listNumber++;
    } else {
      replacement = numberMap.get(number);
      if (replacement === undefined) {
        throw new Error("Please use a number from one through nine and then say next. We do not currently support saying numbers after nine.")
      }
      
      listNumber = listNumber ? listNumber + 1 : parseInt(replacement) + 1;
    }

    return `\n${replacement}. ${capitalize(nextWord)}`
  }

  return text.replace(regexPattern, replaceText);
}

const capitalize = (word: string): string => word.slice(0, 1).toUpperCase() + word.slice(1);