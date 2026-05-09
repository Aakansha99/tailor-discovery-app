import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import {
  useOnboarding,
  type ExperienceBucket,
} from '../lib/OnboardingContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TailorOnboardingStep1'>;

const EXPERIENCE_OPTIONS: { value: ExperienceBucket; label: string }[] = [
  { value: '0-2', label: '0–2 yrs' },
  { value: '3-7', label: '3–7 yrs' },
  { value: '8-15', label: '8–15 yrs' },
  { value: '15+', label: '15+ yrs' },
];

const schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(60, 'Name is too long'),
  shopName: z.string().trim().max(60, 'Shop name is too long').optional(),
  locality: z
    .string()
    .trim()
    .min(2, 'Please enter your locality')
    .max(80, 'Locality is too long'),
  experience: z.enum(['0-2', '3-7', '8-15', '15+'], {
    message: 'Pick your years of experience',
  }),
});

type FormValues = z.infer<typeof schema>;

export const TailorOnboardingStep1Screen = (_props: Props) => {
  const { draft, update } = useOnboarding();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fullName: draft.fullName,
      shopName: draft.shopName,
      locality: draft.locality,
      experience: draft.experience ?? undefined,
    },
  });

  const fullName = watch('fullName');
  const shopName = watch('shopName');
  const locality = watch('locality');
  const experience = watch('experience');
  useEffect(() => {
    update({
      fullName: fullName ?? '',
      shopName: shopName ?? '',
      locality: locality ?? '',
      experience: experience ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, shopName, locality, experience]);

  const onSubmit = (_values: FormValues) => {
    // TODO: navigate to Step 2 once it's built
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          <View className="px-6 pt-4">
            <ProgressBar currentStep={1} totalSteps={4} />
            <Text className="mt-1 text-xs text-ink-muted">Step 1 of 4</Text>

            <Text className="mt-6 text-2xl font-bold text-ink">
              Set up your profile
            </Text>
            <Text className="mt-1 text-sm text-ink-muted">
              Tell customers a bit about yourself.
            </Text>

            <View className="mt-8">
              <FormField
                label="Your full name"
                required
                error={errors.fullName?.message}>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="e.g. Meena Kumari"
                      placeholderTextColor="#aaa"
                      className="rounded-xl border border-line bg-white px-3 py-3 text-base text-ink"
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Shop or business name"
                hint="Optional"
                error={errors.shopName?.message}>
                <Controller
                  control={control}
                  name="shopName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="e.g. Meena Tailors"
                      placeholderTextColor="#aaa"
                      className="rounded-xl border border-line bg-white px-3 py-3 text-base text-ink"
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Your locality"
                required
                hint="e.g. HSR Layout, Bengaluru"
                error={errors.locality?.message}>
                <Controller
                  control={control}
                  name="locality"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Area or neighbourhood, City"
                      placeholderTextColor="#aaa"
                      className="rounded-xl border border-line bg-white px-3 py-3 text-base text-ink"
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Years of experience"
                required
                error={errors.experience?.message}>
                <Controller
                  control={control}
                  name="experience"
                  render={({ field: { value, onChange } }) => (
                    <View className="flex-row flex-wrap gap-2">
                      {EXPERIENCE_OPTIONS.map(opt => {
                        const active = value === opt.value;
                        return (
                          <Pressable
                            key={opt.value}
                            onPress={() => onChange(opt.value)}
                            android_ripple={{ color: '#C0AFDC' }}
                            className={`rounded-full border px-4 py-2 ${
                              active
                                ? 'border-brand bg-brand-light'
                                : 'border-line bg-white'
                            } active:opacity-80`}>
                            <Text
                              className={`text-sm font-semibold ${
                                active ? 'text-brand-dark' : 'text-ink'
                              }`}>
                              {opt.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                />
              </FormField>
            </View>
          </View>
        </ScrollView>

        <View className="border-t border-line bg-white px-6 pb-4 pt-3">
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            android_ripple={{ color: '#3F2A75' }}
            className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-3 ${
              isValid ? 'bg-brand' : 'bg-brand-mid'
            } active:opacity-80`}>
            <Text className="text-base font-bold text-white">Continue</Text>
            <Text className="text-base font-bold text-white">→</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type FormFieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

const FormField = ({
  label,
  hint,
  required,
  error,
  children,
}: FormFieldProps) => (
  <View className="mb-4">
    <View className="mb-1.5 flex-row items-baseline">
      <Text className="text-xs font-semibold text-ink">
        {label}
        {required ? <Text className="text-red-600"> *</Text> : null}
      </Text>
      {hint ? (
        <Text className="ml-2 text-[11px] text-ink-faint">{hint}</Text>
      ) : null}
    </View>
    {children}
    {error ? <Text className="mt-1 text-xs text-red-600">{error}</Text> : null}
  </View>
);

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const pct = Math.round((currentStep / totalSteps) * 100);
  return (
    <View className="h-1.5 w-full overflow-hidden rounded-full bg-bg-muted">
      <View
        className="h-full rounded-full bg-brand"
        style={{ width: `${pct}%` }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 16 },
});
