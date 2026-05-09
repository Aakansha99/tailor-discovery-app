import './global.css';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { OnboardingProvider } from './src/lib/OnboardingContext';

const App = () => (
  <SafeAreaProvider>
    <OnboardingProvider>
      <RootNavigator />
    </OnboardingProvider>
  </SafeAreaProvider>
);

export default App;
