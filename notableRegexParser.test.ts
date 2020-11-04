import { transcribeText } from './notableRegexParser';

describe('notableRegexParser', () => {
  it('parses text starting the Number one', () => {
    const start: string = "one";
    const testPhrase: string = `Patient presents today with several issues. Number ${start} BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks.`;

    const expectedResult: string = "Patient presents today with several issues. \
\n1. BMI has increased by 10% since their  last visit.\
\n2. Patient reports experiencing dizziness several times in the last two  weeks.\
\n3. Patient has a persistent cough that hasn’t improved for last four weeks."
    expect(transcribeText(testPhrase)).toEqual(expectedResult);
  })

  it('parses text starting the Number five', () => {
    const start: string = "five";
    const testPhrase: string = `Patient presents today with several issues. Number ${start} BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks.`;

    const expectedResult: string = "Patient presents today with several issues. \
\n5. BMI has increased by 10% since their  last visit.\
\n6. Patient reports experiencing dizziness several times in the last two  weeks.\
\n7. Patient has a persistent cough that hasn’t improved for last four weeks."
    expect(transcribeText(testPhrase)).toEqual(expectedResult);
  })

  it('throws error when starting with number after 9', () => {
    const start: string = "ten";
    const testPhrase: string = `Patient presents today with several issues. Number ${start} BMI has increased by 10% since their\
  last visit.Number next patient reports experiencing dizziness several times in the last two\
  weeks.Number next patient has a persistent cough that hasn’t improved for last four weeks.`;

    expect(() => transcribeText(testPhrase)).toThrow("Please use a number from one through nine and then say next. We do not currently support saying numbers after nine.")
  })
})