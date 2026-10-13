/**
 * An activity may only be marked complete after the learner has provided
 * a meaningful attempt and selected the criterion described by the lesson.
 * This is formative self-checking, not automatic grading or certification.
 */
export function canCompleteLesson(answer: string, selectedCriterion: number | null): boolean {
  return selectedCriterion === 0 && answer.trim().length >= 13;
}
