import { transcribeText } from './notableRegexParser';

describe('notableRegexParser', () => {
  it('parses text starting the Number one', () => {
    const testPhrase: string = "Patient presents today with several issues. Number one BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks.";

    const expectedResult: string = "";
    expect(transcribeText(testPhrase)).toEqual(expectedResult);
  })
})