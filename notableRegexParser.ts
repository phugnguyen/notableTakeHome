export const transcribeText = (text: string): string => {
  const regexPattern: RegExp = /Number\s([a-z]+)\s(\w+)/g;
  const keyPhrase = "next";
  const endPhrase = "end";

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
    } else if (number === endPhrase) {
      listNumber = 0;
      return `\n${capitalize(nextWord)}`
    } else {
      replacement = numberMap.get(number);
      if (replacement === undefined) {
        return matchedString;
      }

      listNumber = parseInt(replacement) + 1;
    }


    return `\n${replacement}. ${capitalize(nextWord)}`
  }

  return text.replace(regexPattern, replaceText);
}

const capitalize = (word: string): string => word.slice(0, 1).toUpperCase() + word.slice(1);