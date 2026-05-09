import React, { createContext, useContext, useMemo, useState } from 'react';

export type ExperienceBucket = '0-2' | '3-7' | '8-15' | '15+';

export type OnboardingDraft = {
  fullName: string;
  shopName: string;
  locality: string;
  experience: ExperienceBucket | null;
};

const initialDraft: OnboardingDraft = {
  fullName: '',
  shopName: '',
  locality: '',
  experience: null,
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
