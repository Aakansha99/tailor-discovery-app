import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import CustomerIllustration from '../assets/illustrations/customer.svg';
import TailorIllustration from '../assets/illustrations/tailor.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen = ({ navigation }: Props) => (
  <SafeAreaView className="flex-1 bg-white">
    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
    <ScrollView
      className="flex-1"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-6 pt-10 pb-6">
        <View className="mb-6">
          <Text className="text-4xl text-ink">Welcome!</Text>
          <Text className="mt-1 text-4xl font-bold leading-tight text-ink">
            Let's get you{'\n'}started
          </Text>
          <Text className="mt-4 text-base leading-6 text-ink-muted">
            Choose how you want to continue. You can change this later in
            settings.
          </Text>
        </View>

        <View className="flex-1 justify-center">
          <View className="flex-row gap-3">
            <RoleCard
              Illustration={CustomerIllustration}
              label="Continue as"
              roleName="Customer"
              description="Discover, explore and find verified tailors near you."
              comingSoon
            />

            <RoleCard
              Illustration={TailorIllustration}
              label="Continue as"
              roleName="Tailor"
              description="Build your profile, share your work and grow your business."
              onPress={() => navigation.navigate('TailorOnboardingStep1')}
            />
          </View>
        </View>

        <View>
          <View className="flex-row items-center">
            <View className="h-px flex-1 bg-line" />
            <Text className="mx-3 text-xs text-ink-muted">
              Already have an account?
            </Text>
            <View className="h-px flex-1 bg-line" />
          </View>

          <Pressable
            onPress={() => {
              /* TODO: wire up login flow once auth is implemented */
            }}
            android_ripple={{ color: '#C0AFDC' }}
            style={styles.loginButton}
            className="mt-4 flex-row items-center justify-center rounded-xl border-2 border-brand bg-white px-4 py-4 active:opacity-80">
            <Text className="text-base font-bold text-brand">Log in</Text>
          </Pressable>

          <Text className="mt-5 text-center text-[11px] text-ink-faint">
            By continuing you agree to our{' '}
            <Text className="font-semibold text-ink-muted">Terms</Text>
            {' and '}
            <Text className="font-semibold text-ink-muted">Privacy Policy</Text>
            .
          </Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const ILLUSTRATION_SIZE = 110;

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  illustrationWrap: {
    width: ILLUSTRATION_SIZE + 24,
    height: ILLUSTRATION_SIZE + 24,
  },
  loginButton: {
    shadowColor: '#4A2D8F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  ctaButton: {
    shadowColor: '#4A2D8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});

type RoleCardProps = {
  Illustration: React.FC<{ width?: number; height?: number }>;
  label: string;
  roleName: string;
  description: string;
  onPress?: () => void;
  comingSoon?: boolean;
};

const RoleCard = ({
  Illustration,
  label,
  roleName,
  description,
  onPress,
  comingSoon,
}: RoleCardProps) => {
  const Inner = (
    <>
      <View className="items-center pt-2">
        <View
          className="items-center justify-center rounded-2xl bg-white"
          style={styles.illustrationWrap}>
          <Illustration
            width={ILLUSTRATION_SIZE}
            height={ILLUSTRATION_SIZE}
          />
        </View>
      </View>

      <Text className="mt-4 text-center text-xs text-ink-muted">{label}</Text>
      <Text className="text-center text-lg font-bold text-brand-dark">
        {roleName}
      </Text>

      <Text className="mt-2 text-center text-xs leading-4 text-ink-muted">
        {description}
      </Text>

      <View className="mt-5 items-center">
        {comingSoon ? (
          <View className="flex-row items-center justify-center rounded-full bg-brand-mid px-5 py-2.5">
            <Text className="text-sm font-bold text-brand-dark">
              Coming soon
            </Text>
          </View>
        ) : (
          <View
            style={styles.ctaButton}
            className="flex-row items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5">
            <Text className="text-sm font-bold text-white">Continue</Text>
            <Text className="text-base font-bold text-white">→</Text>
          </View>
        )}
      </View>
    </>
  );

  if (comingSoon) {
    return (
      <View className="flex-1 rounded-2xl bg-brand-light p-4 opacity-70">
        {Inner}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#C0AFDC', borderless: false }}
      className="flex-1 rounded-2xl bg-brand-light p-4 active:opacity-80">
      {Inner}
    </Pressable>
  );
};

