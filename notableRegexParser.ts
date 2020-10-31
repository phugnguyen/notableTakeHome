const transcribeText = (text: string): string => {
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
  numberMap.set(keyPhrase, keyPhrase);

  let listNumber: number = 0;

  const replaceText = (matchedString: string, number: string, nextWord: string): string => {
    let replacement: string | undefined = numberMap.get(number);
    if (replacement === undefined){
      throw "Please use a number from one through nine and then say next. We do not currently support saying numbers after nine."
    }

    if (replacement === keyPhrase){
      listNumber = listNumber ? listNumber : 1;
      replacement = listNumber.toString();
      listNumber++; 
    } else {
      listNumber = listNumber ? listNumber + 1 : parseInt(replacement) + 1;
    }

    return `\n${replacement}. ${capitalize(nextWord)}`
  }

  return text.replace(regexPattern, replaceText);
}

const capitalize = (word: string): string => word.slice(0, 1).toUpperCase() + word.slice(1); 

// normally this would be in a jest file
const test = () => {
  // start with 'one'
  const phrase1: string = "Patient presents today with several issues. Number one BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks."

  // start with 'five'
  const phrase5: string = "Patient presents today with several issues. Number five BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks."

  // start with an unsupported number 'ten'
  const phrase10: string = "Patient presents today with several issues. Number ten BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks."

  const phrases: string[] = [phrase1, phrase5, phrase10];

  for (const phrase of phrases){
    try {
      console.log(transcribeText(phrase) + '\n');
    } catch (err){
      console.log(err);
    }
  }
}

test();