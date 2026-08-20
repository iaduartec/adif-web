export type OnboardingFormState = {
  errors: Record<string, string | undefined>;
  values: {
    weeklyTargetMinutes: string;
    preferredDays: string[];
    sessionMinutes: string;
    examDate: string;
    diagnostic: boolean;
  };
};

export const initialOnboardingFormState: OnboardingFormState = {
  errors: {},
  values: {
    weeklyTargetMinutes: "120",
    preferredDays: [],
    sessionMinutes: "30",
    examDate: "",
    diagnostic: false,
  },
};
