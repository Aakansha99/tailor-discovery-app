import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import {
  useOnboarding,
  type IdImage,
  type IdType,
} from '../lib/OnboardingContext';
import { PhotoSourceSheet } from '../components/PhotoSourceSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'TailorOnboardingStep4'>;

type Side = 'front' | 'back';

const ID_TABS: { id: IdType; label: string }[] = [
  { id: 'aadhaar', label: 'Aadhaar' },
  { id: 'voter', label: 'Voter ID' },
];

export const TailorOnboardingStep4Screen = ({ navigation }: Props) => {
  const { draft, update } = useOnboarding();
  const idV = draft.idVerification;
  const activeTab: IdType = idV.idType ?? 'aadhaar';

  const [pickerOpen, setPickerOpen] = useState<Side | null>(null);

  const setTab = (idType: IdType) => {
    if (idV.idType !== idType) {
      // switching tab clears any uploaded sides for the previous selection
      update({ idVerification: { idType, front: null, back: null } });
    } else {
      update({ idVerification: { ...idV, idType } });
    }
  };

  const setSide = (side: Side, image: IdImage | null) => {
    update({
      idVerification: {
        ...idV,
        idType: activeTab,
        [side]: image,
      },
    });
  };

  const onPick = (side: Side, asset: Asset | undefined) => {
    if (!asset?.uri) {
      return;
    }
    setSide(side, {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    });
  };

  const handleCamera = async () => {
    const side = pickerOpen;
    setPickerOpen(null);
    if (!side) {
      return;
    }
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });
    if (result.didCancel) {
      return;
    }
    if (result.errorCode) {
      Alert.alert('Camera error', result.errorMessage ?? result.errorCode);
      return;
    }
    onPick(side, result.assets?.[0]);
  };

  const handleGallery = async () => {
    const side = pickerOpen;
    setPickerOpen(null);
    if (!side) {
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (result.didCancel) {
      return;
    }
    if (result.errorCode) {
      Alert.alert('Gallery error', result.errorMessage ?? result.errorCode);
      return;
    }
    onPick(side, result.assets?.[0]);
  };

  const isValid = !!idV.idType && !!idV.front && !!idV.back;

  const onSubmit = () => {
    if (!isValid) {
      return;
    }
    navigation.navigate('OnboardingSubmitted');
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}>
        <View className="px-6 pt-4">
          <ProgressBar currentStep={4} totalSteps={4} />
          <Text className="mt-1 text-xs text-ink-muted">Step 4 of 4</Text>

          <Text className="mt-6 text-2xl font-bold text-ink">
            Verify your identity
          </Text>
          <Text className="mt-1 text-sm text-ink-muted">
            We need a government ID to confirm you're a real tailor. Your
            documents are reviewed by our team within 48 hours.
          </Text>

          <View className="mt-6 flex-row rounded-full bg-bg-muted p-1">
            {ID_TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTab(t.id)}
                  android_ripple={{ color: '#C0AFDC' }}
                  className={`flex-1 items-center rounded-full py-2 ${
                    active ? 'bg-white' : ''
                  }`}
                  style={active ? styles.tabActive : undefined}>
                  <Text
                    className={`text-sm font-bold ${
                      active ? 'text-brand-dark' : 'text-ink-muted'
                    }`}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mt-3 text-xs text-ink-muted">
            Upload clear photos of the {activeTab === 'aadhaar' ? 'Aadhaar' : 'Voter ID'}{' '}
            card. Both sides are required.
          </Text>

          <View className="mt-5">
            <UploadSlot
              label="Front side"
              required
              image={idV.front}
              onPick={() => setPickerOpen('front')}
              onRemove={() => setSide('front', null)}
            />
            <View className="h-3" />
            <UploadSlot
              label="Back side"
              required
              image={idV.back}
              onPick={() => setPickerOpen('back')}
              onRemove={() => setSide('back', null)}
            />
          </View>

          <View className="mt-6 rounded-xl border border-line bg-bg-subtle px-4 py-3">
            <Text className="text-xs font-semibold text-ink">
              🔒 Your privacy
            </Text>
            <Text className="mt-1 text-xs leading-4 text-ink-muted">
              ID documents are only used for verification and are not shown to
              customers. They are stored securely and reviewed by our team.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-line bg-white px-6 pb-4 pt-3">
        <Pressable
          onPress={onSubmit}
          disabled={!isValid}
          android_ripple={{ color: '#3F2A75' }}
          className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-3 ${
            isValid ? 'bg-brand' : 'bg-brand-mid'
          } active:opacity-80`}>
          <Text className="text-base font-bold text-white">
            Submit for verification
          </Text>
        </Pressable>
        {!isValid ? (
          <Text className="mt-2 text-center text-xs text-ink-muted">
            Upload both sides to submit.
          </Text>
        ) : null}
      </View>

      <PhotoSourceSheet
        visible={pickerOpen !== null}
        title={
          pickerOpen === 'front'
            ? 'Add front of ID'
            : pickerOpen === 'back'
            ? 'Add back of ID'
            : 'Add ID photo'
        }
        onClose={() => setPickerOpen(null)}
        onPickCamera={handleCamera}
        onPickGallery={handleGallery}
      />
    </SafeAreaView>
  );
};

type UploadSlotProps = {
  label: string;
  required?: boolean;
  image: IdImage | null;
  onPick: () => void;
  onRemove: () => void;
};

const UploadSlot = ({
  label,
  required,
  image,
  onPick,
  onRemove,
}: UploadSlotProps) => (
  <View>
    <View className="mb-1.5 flex-row items-baseline">
      <Text className="text-xs font-semibold text-ink">
        {label}
        {required ? <Text className="text-red-600"> *</Text> : null}
      </Text>
    </View>

    {image ? (
      <View className="overflow-hidden rounded-xl border border-line">
        <Image
          source={{ uri: image.uri }}
          style={styles.preview}
          resizeMode="cover"
        />
        <View className="flex-row border-t border-line bg-white">
          <Pressable
            onPress={onPick}
            android_ripple={{ color: '#f0f0ec' }}
            className="flex-1 items-center py-2.5 active:opacity-70">
            <Text className="text-xs font-semibold text-brand">Replace</Text>
          </Pressable>
          <View className="w-px bg-line" />
          <Pressable
            onPress={onRemove}
            android_ripple={{ color: '#fee2e2' }}
            className="flex-1 items-center py-2.5 active:opacity-70">
            <Text className="text-xs font-semibold text-red-600">Remove</Text>
          </Pressable>
        </View>
      </View>
    ) : (
      <Pressable
        onPress={onPick}
        android_ripple={{ color: '#C0AFDC' }}
        style={styles.dropzone}
        className="items-center justify-center rounded-xl border border-dashed border-brand-mid bg-brand-light/40">
        <Text className="text-2xl text-brand">+</Text>
        <Text className="mt-1 text-xs font-semibold text-brand-dark">
          Tap to upload
        </Text>
        <Text className="mt-0.5 text-[10px] text-ink-muted">
          Camera or gallery
        </Text>
      </Pressable>
    )}
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
  scrollContent: { paddingBottom: 24 },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  preview: {
    width: '100%',
    height: 160,
    backgroundColor: '#f7f7f5',
  },
  dropzone: {
    height: 120,
  },
});
