import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { useOnboarding } from '../lib/OnboardingContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingSubmitted'>;

const generateRefId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 0xfff)
    .toString(16)
    .toUpperCase()
    .padStart(3, '0');
  return `TD-${ts.slice(-6)}-${rand}`;
};

const formatEta = () => {
  const eta = new Date(Date.now() + 48 * 60 * 60 * 1000);
  return eta.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const OnboardingSubmittedScreen = ({ navigation }: Props) => {
  const { draft, reset } = useOnboarding();

  const refId = useMemo(generateRefId, []);
  const eta = useMemo(formatEta, []);
  const firstName = draft.fullName.trim().split(/\s+/)[0] || 'there';

  const handleDone = () => {
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      }),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-subtle">
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="bg-white px-6 pb-8 pt-10">
          <View className="items-center">
            <View
              style={styles.iconCircle}
              className="items-center justify-center rounded-full bg-brand-light">
              <Text style={styles.icon}>✓</Text>
            </View>

            <Text className="mt-6 text-center text-2xl font-bold text-ink">
              You're all set, {firstName}!
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-ink-muted">
              Your profile is submitted for verification. We'll get back to you
              soon.
            </Text>

            <View className="mt-5 w-full flex-row rounded-xl border border-line bg-bg-subtle">
              <View className="flex-1 px-4 py-3">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Reference ID
                </Text>
                <Text
                  className="mt-1 text-sm font-bold text-ink"
                  numberOfLines={1}
                  ellipsizeMode="middle">
                  {refId}
                </Text>
              </View>
              <View className="w-px bg-line" />
              <View className="flex-1 px-4 py-3">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Decision by
                </Text>
                <Text className="mt-1 text-sm font-bold text-ink">{eta}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status timeline */}
        <View className="mt-3 bg-white px-6 py-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
            Status
          </Text>
          <Timeline />
        </View>

        {/* What you can do meanwhile */}
        <View className="mt-3 bg-white px-6 py-5">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
            While you wait
          </Text>
          <TipRow
            icon="📸"
            title="Add more portfolio photos"
            description="Verified profiles with 8+ photos get 3× more orders."
          />
          <TipRow
            icon="🔔"
            title="Turn on notifications"
            description="So you don't miss your verification update."
          />
          <TipRow
            icon="💬"
            title="Need help?"
            description="Reach out at help@tailordiscovery.com"
            isLast
          />
        </View>

        <View className="mt-3 bg-white px-6 py-4">
          <Text className="text-center text-[11px] leading-4 text-ink-faint">
            By submitting, you confirm that all information and documents
            provided are accurate and belong to you.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View className="border-t border-line bg-white px-6 pb-4 pt-3">
        <Pressable
          onPress={handleDone}
          android_ripple={{ color: '#3F2A75' }}
          className="rounded-full bg-brand px-5 py-3 active:opacity-80">
          <Text className="text-center text-base font-bold text-white">
            Got it
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const Timeline = () => (
  <View>
    <TimelineItem
      state="done"
      title="Profile submitted"
      description="Your basic info, skills, portfolio and ID are with us."
      meta="Just now"
    />
    <TimelineItem
      state="active"
      title="Under review"
      description="Our team is checking your details. Usually within 48 hours."
      meta="In progress"
    />
    <TimelineItem
      state="pending"
      title="Verified badge"
      description="You'll be notified the moment your profile is approved."
      isLast
    />
  </View>
);

type TimelineItemProps = {
  state: 'done' | 'active' | 'pending';
  title: string;
  description: string;
  meta?: string;
  isLast?: boolean;
};

const TimelineItem = ({
  state,
  title,
  description,
  meta,
  isLast,
}: TimelineItemProps) => (
  <View className="flex-row">
    {/* Rail */}
    <View className="mr-3 items-center">
      <View
        className={`h-7 w-7 items-center justify-center rounded-full ${
          state === 'done'
            ? 'bg-brand'
            : state === 'active'
            ? 'border-2 border-brand bg-brand-light'
            : 'border border-line bg-white'
        }`}>
        {state === 'done' ? (
          <Text className="text-xs font-bold text-white">✓</Text>
        ) : state === 'active' ? (
          <View
            style={styles.activeDot}
            className="h-2.5 w-2.5 rounded-full bg-brand"
          />
        ) : null}
      </View>
      {!isLast ? (
        <View
          className={`flex-1 ${
            state === 'done' ? 'bg-brand' : 'bg-line'
          }`}
          style={styles.railLine}
        />
      ) : null}
    </View>

    {/* Content */}
    <View className={`flex-1 ${isLast ? '' : 'pb-5'}`}>
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-sm font-bold ${
            state === 'pending' ? 'text-ink-muted' : 'text-ink'
          }`}>
          {title}
        </Text>
        {meta ? (
          <Text
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              state === 'active' ? 'text-brand' : 'text-ink-muted'
            }`}>
            {meta}
          </Text>
        ) : null}
      </View>
      <Text className="mt-1 text-xs leading-4 text-ink-muted">
        {description}
      </Text>
    </View>
  </View>
);

type TipRowProps = {
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
};

const TipRow = ({ icon, title, description, isLast }: TipRowProps) => (
  <View
    className={`flex-row items-start ${
      isLast ? '' : 'mb-3 border-b border-line pb-3'
    }`}>
    <Text className="mr-3 text-xl">{icon}</Text>
    <View className="flex-1">
      <Text className="text-sm font-semibold text-ink">{title}</Text>
      <Text className="mt-0.5 text-xs leading-4 text-ink-muted">
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 16 },
  iconCircle: {
    width: 80,
    height: 80,
  },
  icon: {
    fontSize: 44,
    color: '#4A2D8F',
    fontWeight: '700',
    lineHeight: 52,
  },
  railLine: {
    width: 2,
    minHeight: 24,
    marginTop: 4,
    marginBottom: -2,
  },
  activeDot: {},
});
