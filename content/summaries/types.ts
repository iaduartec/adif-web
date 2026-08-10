export interface LessonSummarySection {
  title: string;
  points: string[];
}

export interface LessonSummary {
  overview: string;
  keyFacts: string[];
  sections: LessonSummarySection[];
}
