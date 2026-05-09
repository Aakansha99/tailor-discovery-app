import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomeScreen } from '../screens/WelcomeScreen';
import { TailorOnboardingStep1Screen } from '../screens/TailorOnboardingStep1Screen';
import { TailorOnboardingStep2Screen } from '../screens/TailorOnboardingStep2Screen';
import { TailorOnboardingStep3Screen } from '../screens/TailorOnboardingStep3Screen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '600' },
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TailorOnboardingStep1"
        component={TailorOnboardingStep1Screen}
        options={{ title: 'Become a tailor' }}
      />
      <Stack.Screen
        name="TailorOnboardingStep2"
        component={TailorOnboardingStep2Screen}
        options={{ title: 'Skills & pricing' }}
      />
      <Stack.Screen
        name="TailorOnboardingStep3"
        component={TailorOnboardingStep3Screen}
        options={{ title: 'Portfolio' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
