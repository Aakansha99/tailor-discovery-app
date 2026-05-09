import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TailorOnboardingStep1'>;

export const TailorOnboardingStep1Screen = (_props: Props) => (
  <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-xl font-bold text-ink">Step 1 — Basic info</Text>
      <Text className="mt-2 text-center text-sm text-ink-muted">
        Form fields go here in the next PR.
      </Text>
    </View>
  </SafeAreaView>
);
