import React, { createContext, useContext, useMemo, useState } from 'react';

export type ExperienceBucket = '0-2' | '3-7' | '8-15' | '15+';

export type SkillId =
  | 'blouse-stitching'
  | 'saree-blouse'
  | 'kurta'
  | 'bridal'
  | 'alterations'
  | 'kids-wear'
  | 'lehenga'
  | 'sherwani'
  | 'other';

export type SkillPricing = {
  skillId: SkillId;
  // For 'other', the tailor enters a custom name
  customName?: string;
  minPrice: string; // kept as string so empty input is valid until submit
  maxPrice: string;
  isSaved: boolean;
};

export type OnboardingDraft = {
  fullName: string;
  shopName: string;
  locality: string;
  experience: ExperienceBucket | null;
  skills: SkillPricing[];
};

const initialDraft: OnboardingDraft = {
  fullName: '',
  shopName: '',
  locality: '',
  experience: null,
  skills: [],
};

type OnboardingContextValue = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      update: patch => setDraft(prev => ({ ...prev, ...patch })),
      reset: () => setDraft(initialDraft),
    }),
    [draft],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used inside OnboardingProvider');
  }
  return ctx;
};
