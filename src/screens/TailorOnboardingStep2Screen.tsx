import React from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import {
  useOnboarding,
  type SkillId,
  type SkillPricing,
} from '../lib/OnboardingContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TailorOnboardingStep2'>;

const SKILL_OPTIONS: { id: SkillId; label: string }[] = [
  { id: 'blouse-stitching', label: 'Blouse stitching' },
  { id: 'saree-blouse', label: 'Saree blouse' },
  { id: 'kurta', label: 'Kurta' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'alterations', label: 'Alterations' },
  { id: 'kids-wear', label: 'Kids wear' },
  { id: 'lehenga', label: 'Lehenga' },
  { id: 'sherwani', label: 'Sherwani' },
  { id: 'other', label: '+ Other' },
];

const skillLabel = (s: SkillPricing): string => {
  if (s.skillId === 'other') {
    return s.customName?.trim() ? s.customName : 'Custom skill';
  }
  return SKILL_OPTIONS.find(o => o.id === s.skillId)?.label ?? s.skillId;
};

type SkillRowError = {
  customName?: string;
  minPrice?: string;
  maxPrice?: string;
};

const validateSkill = (s: SkillPricing): SkillRowError => {
  const errors: SkillRowError = {};
  if (s.skillId === 'other' && !s.customName?.trim()) {
    errors.customName = 'Enter a skill name';
  }
  const min = Number(s.minPrice);
  const max = Number(s.maxPrice);
  if (!s.minPrice.trim() || Number.isNaN(min) || min <= 0) {
    errors.minPrice = 'Required';
  }
  if (!s.maxPrice.trim() || Number.isNaN(max) || max <= 0) {
    errors.maxPrice = 'Required';
  }
  if (
    !errors.minPrice &&
    !errors.maxPrice &&
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    max < min
  ) {
    errors.maxPrice = 'Must be ≥ Min';
  }
  return errors;
};

export const TailorOnboardingStep2Screen = (_props: Props) => {
  const { draft, update } = useOnboarding();

  const skills = draft.skills;

  const toggleSkill = (id: SkillId) => {
    const exists = skills.find(s => s.skillId === id);
    if (exists) {
      update({ skills: skills.filter(s => s.skillId !== id) });
    } else {
      const next: SkillPricing = {
        skillId: id,
        minPrice: '',
        maxPrice: '',
        isSaved: false,
        ...(id === 'other' ? { customName: '' } : {}),
      };
      update({ skills: [...skills, next] });
    }
  };

  const updateSkill = (id: SkillId, patch: Partial<SkillPricing>) => {
    update({
      skills: skills.map(s => (s.skillId === id ? { ...s, ...patch } : s)),
    });
  };

  const allSaved = skills.length > 0 && skills.every(s => s.isSaved);

  const onContinue = () => {
    if (!allSaved) {
      return;
    }
    // TODO: navigate to Step 3 once it's built
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
            <ProgressBar currentStep={2} totalSteps={4} />
            <Text className="mt-1 text-xs text-ink-muted">Step 2 of 4</Text>

            <Text className="mt-6 text-2xl font-bold text-ink">
              What can you stitch?
            </Text>
            <Text className="mt-1 text-sm text-ink-muted">
              Pick all the work you take on. Customers see your prices as a
              range.
            </Text>

            <View className="mt-8">
              <Text className="mb-3 text-xs font-semibold text-ink">
                Select your skills{' '}
                <Text className="text-red-600">*</Text>
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {SKILL_OPTIONS.map(opt => {
                  const active = !!skills.find(s => s.skillId === opt.id);
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => toggleSkill(opt.id)}
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
                        {active ? `✓ ${opt.label.replace(/^\+ /, '')}` : opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {skills.length > 0 ? (
              <View className="mt-8">
                <Text className="mb-3 text-xs font-semibold text-ink">
                  Set your price ranges{' '}
                  <Text className="text-red-600">*</Text>
                </Text>

                {skills.map(s =>
                  s.isSaved ? (
                    <SavedSkillRow
                      key={s.skillId}
                      skill={s}
                      onEdit={() =>
                        updateSkill(s.skillId, { isSaved: false })
                      }
                      onRemove={() => toggleSkill(s.skillId)}
                    />
                  ) : (
                    <EditingSkillRow
                      key={s.skillId}
                      skill={s}
                      onChange={patch => updateSkill(s.skillId, patch)}
                      onSave={() => updateSkill(s.skillId, { isSaved: true })}
                      onRemove={() => toggleSkill(s.skillId)}
                    />
                  ),
                )}
              </View>
            ) : (
              <View className="mt-6 rounded-xl border border-dashed border-line bg-bg-subtle px-4 py-6">
                <Text className="text-center text-xs text-ink-muted">
                  Select at least one skill to set your prices.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="border-t border-line bg-white px-6 pb-4 pt-3">
          <Pressable
            onPress={onContinue}
            disabled={!allSaved}
            android_ripple={{ color: '#3F2A75' }}
            className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-3 ${
              allSaved ? 'bg-brand' : 'bg-brand-mid'
            } active:opacity-80`}>
            <Text className="text-base font-bold text-white">Continue</Text>
            <Text className="text-base font-bold text-white">→</Text>
          </Pressable>
          {skills.length > 0 && !allSaved ? (
            <Text className="mt-2 text-center text-xs text-ink-muted">
              Save the price for every skill to continue.
            </Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type EditingProps = {
  skill: SkillPricing;
  onChange: (patch: Partial<SkillPricing>) => void;
  onSave: () => void;
  onRemove: () => void;
};

const EditingSkillRow = ({
  skill,
  onChange,
  onSave,
  onRemove,
}: EditingProps) => {
  const [touched, setTouched] = React.useState({
    customName: false,
    minPrice: false,
    maxPrice: false,
  });
  const errs = validateSkill(skill);
  const isValid = Object.keys(errs).length === 0;

  const handleSave = () => {
    setTouched({ customName: true, minPrice: true, maxPrice: true });
    if (isValid) {
      onSave();
    }
  };

  return (
    <View className="mb-2.5 rounded-xl border border-brand-mid bg-white px-3 py-2.5">
      {skill.skillId === 'other' ? (
        <View className="mb-2">
          <TextInput
            value={skill.customName}
            onChangeText={text => onChange({ customName: text })}
            onBlur={() => setTouched(t => ({ ...t, customName: true }))}
            placeholder="Skill name (e.g. School uniform)"
            placeholderTextColor="#aaa"
            style={priceStyles.customNameInput}
            className="border-b border-brand-mid text-sm font-semibold text-ink"
            autoCapitalize="words"
          />
          {touched.customName && errs.customName ? (
            <Text className="mt-0.5 text-[11px] text-red-600">
              {errs.customName}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text className="mb-2 text-sm font-semibold text-ink">
          {skillLabel(skill)}
        </Text>
      )}

      <View className="flex-row items-center gap-1.5">
        <PriceInput
          value={skill.minPrice}
          placeholder="Min"
          onChange={text => onChange({ minPrice: text })}
          onBlur={() => setTouched(t => ({ ...t, minPrice: true }))}
          error={touched.minPrice ? errs.minPrice : undefined}
        />
        <Text className="text-xs text-ink-faint">to</Text>
        <PriceInput
          value={skill.maxPrice}
          placeholder="Max"
          onChange={text => onChange({ maxPrice: text })}
          onBlur={() => setTouched(t => ({ ...t, maxPrice: true }))}
          error={touched.maxPrice ? errs.maxPrice : undefined}
        />
      </View>

      <View className="mt-2.5 flex-row items-center justify-end gap-4">
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          className="active:opacity-60">
          <Text className="text-xs font-semibold text-red-600">Remove</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          disabled={!isValid}
          android_ripple={{ color: '#3F2A75' }}
          className={`rounded-full px-4 py-1 ${
            isValid ? 'bg-brand' : 'bg-brand-mid'
          } active:opacity-80`}>
          <Text className="text-xs font-bold text-white">Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

type SavedProps = {
  skill: SkillPricing;
  onEdit: () => void;
  onRemove: () => void;
};

const SavedSkillRow = ({ skill, onEdit, onRemove }: SavedProps) => (
  <View className="mb-3 flex-row items-center justify-between rounded-xl border border-line bg-bg-subtle px-4 py-3">
    <View className="mr-3 flex-1">
      <Text className="text-base font-semibold text-ink" numberOfLines={1}>
        {skillLabel(skill)}
      </Text>
      <Text className="mt-0.5 text-sm text-ink-muted">
        ₹{skill.minPrice} – ₹{skill.maxPrice}
      </Text>
    </View>
    <View className="flex-row items-center gap-3">
      <Pressable onPress={onEdit} hitSlop={8} className="active:opacity-60">
        <Text className="text-xs font-semibold text-brand">Edit</Text>
      </Pressable>
      <View className="h-4 w-px bg-line" />
      <Pressable onPress={onRemove} hitSlop={8} className="active:opacity-60">
        <Text className="text-xs font-semibold text-red-600">Remove</Text>
      </Pressable>
    </View>
  </View>
);

type PriceInputProps = {
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
  onBlur: () => void;
  error?: string;
};

const PriceInput = ({
  value,
  placeholder,
  onChange,
  onBlur,
  error,
}: PriceInputProps) => (
  <View className="flex-1">
    <View
      style={priceStyles.inputBox}
      className={`flex-row items-center rounded-md border bg-bg-subtle px-2 ${
        error ? 'border-red-500' : 'border-line'
      }`}>
      <Text className="mr-1 text-xs text-ink-muted">₹</Text>
      <TextInput
        value={value}
        onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))}
        onBlur={onBlur}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        style={priceStyles.input}
        className="flex-1 text-sm font-semibold text-ink"
      />
    </View>
    {error ? (
      <Text className="mt-0.5 text-[11px] text-red-600">{error}</Text>
    ) : null}
  </View>
);

const priceStyles = StyleSheet.create({
  inputBox: {
    height: 36,
  },
  input: {
    paddingVertical: 0,
  },
  customNameInput: {
    paddingVertical: 4,
  },
});

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
