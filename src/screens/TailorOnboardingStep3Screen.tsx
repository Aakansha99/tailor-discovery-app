import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  Image,
  StyleSheet,
  Dimensions,
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
  type PortfolioPhoto,
} from '../lib/OnboardingContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TailorOnboardingStep3'>;

const MIN_PHOTOS = 4;
const MAX_PHOTOS = 12;
const COLUMNS = 3;
const SCREEN_PADDING = 24;
const TILE_GAP = 8;

export const TailorOnboardingStep3Screen = (_props: Props) => {
  const { draft, update } = useOnboarding();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const photos = draft.portfolio;
  const canAddMore = photos.length < MAX_PHOTOS;
  const canContinue = photos.length >= MIN_PHOTOS;

  const screenWidth = Dimensions.get('window').width;
  const tileSize =
    (screenWidth - SCREEN_PADDING * 2 - TILE_GAP * (COLUMNS - 1)) / COLUMNS;

  const addPhotosFromAssets = (assets: Asset[]) => {
    const next: PortfolioPhoto[] = assets
      .filter(a => !!a.uri)
      .slice(0, MAX_PHOTOS - photos.length)
      .map((a, i) => ({
        id: `${Date.now()}-${i}-${a.fileName ?? 'photo'}`,
        uri: a.uri as string,
        width: a.width,
        height: a.height,
      }));
    if (next.length > 0) {
      update({ portfolio: [...photos, ...next] });
    }
  };

  const handleCamera = async () => {
    setPickerOpen(false);
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });
    if (result.didCancel || !result.assets) {
      return;
    }
    if (result.errorCode) {
      Alert.alert('Camera error', result.errorMessage ?? result.errorCode);
      return;
    }
    addPhotosFromAssets(result.assets);
  };

  const handleGallery = async () => {
    setPickerOpen(false);
    const remaining = MAX_PHOTOS - photos.length;
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: remaining,
    });
    if (result.didCancel || !result.assets) {
      return;
    }
    if (result.errorCode) {
      Alert.alert('Gallery error', result.errorMessage ?? result.errorCode);
      return;
    }
    addPhotosFromAssets(result.assets);
  };

  const removePhoto = (id: string) => {
    update({ portfolio: photos.filter(p => p.id !== id) });
    setPreviewIndex(null);
  };

  const onContinue = () => {
    if (!canContinue) {
      return;
    }
    // TODO: navigate to Step 4 once it's built
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}>
        <View className="px-6 pt-4">
          <ProgressBar currentStep={3} totalSteps={4} />
          <Text className="mt-1 text-xs text-ink-muted">Step 3 of 4</Text>

          <Text className="mt-6 text-2xl font-bold text-ink">
            Show off your work
          </Text>
          <Text className="mt-1 text-sm text-ink-muted">
            Upload photos of work you've actually done. Add at least{' '}
            {MIN_PHOTOS} to be eligible for the Verified badge.
          </Text>

          <View className="mt-6 flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-ink">
              Portfolio photos <Text className="text-red-600">*</Text>
            </Text>
            <Text
              className={`text-xs font-semibold ${
                canContinue ? 'text-emerald-700' : 'text-ink-muted'
              }`}>
              {photos.length}/{MAX_PHOTOS}
              {canContinue ? ' ✓' : ` · need ${MIN_PHOTOS - photos.length} more`}
            </Text>
          </View>

          <View className="mt-3 flex-row flex-wrap" style={styles.grid}>
            {photos.map((p, idx) => (
              <Pressable
                key={p.id}
                onPress={() => setPreviewIndex(idx)}
                style={[styles.tile, { width: tileSize, height: tileSize }]}>
                <Image
                  source={{ uri: p.uri }}
                  style={styles.tileImage}
                  resizeMode="cover"
                />
              </Pressable>
            ))}

            {canAddMore ? (
              <Pressable
                onPress={() => setPickerOpen(true)}
                android_ripple={{ color: '#C0AFDC' }}
                style={[
                  styles.tile,
                  styles.addTile,
                  { width: tileSize, height: tileSize },
                ]}>
                <Text className="text-3xl text-brand">+</Text>
                <Text className="mt-1 text-[11px] font-semibold text-brand-dark">
                  Add photo
                </Text>
              </Pressable>
            ) : null}
          </View>

          {photos.length === 0 ? (
            <Text className="mt-3 text-xs text-ink-muted">
              💡 Good photos: front-on shots of finished pieces in clear light.
              Avoid stock images — admin reviews these.
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <View className="border-t border-line bg-white px-6 pb-4 pt-3">
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          android_ripple={{ color: '#3F2A75' }}
          className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-3 ${
            canContinue ? 'bg-brand' : 'bg-brand-mid'
          } active:opacity-80`}>
          <Text className="text-base font-bold text-white">Continue</Text>
          <Text className="text-base font-bold text-white">→</Text>
        </Pressable>
        {!canContinue && photos.length > 0 ? (
          <Text className="mt-2 text-center text-xs text-ink-muted">
            Add {MIN_PHOTOS - photos.length} more photo
            {MIN_PHOTOS - photos.length === 1 ? '' : 's'} to continue.
          </Text>
        ) : null}
      </View>

      {/* Source picker bottom sheet */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}>
        <Pressable
          onPress={() => setPickerOpen(false)}
          style={styles.modalBackdrop}
          className="bg-black/40">
          <Pressable
            onPress={() => {
              /* prevent backdrop tap from closing inner */
            }}
            style={styles.sheetCard}
            className="rounded-t-2xl bg-white px-6 py-6">
            <Text className="mb-4 text-base font-bold text-ink">
              Add a photo
            </Text>
            <Pressable
              onPress={handleCamera}
              android_ripple={{ color: '#f0f0ec' }}
              className="flex-row items-center rounded-xl border border-line px-4 py-3 active:bg-bg-subtle">
              <Text className="mr-3 text-2xl">📷</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-ink">
                  Take a new photo
                </Text>
                <Text className="text-xs text-ink-muted">
                  Use your camera now
                </Text>
              </View>
            </Pressable>
            <View className="h-2" />
            <Pressable
              onPress={handleGallery}
              android_ripple={{ color: '#f0f0ec' }}
              className="flex-row items-center rounded-xl border border-line px-4 py-3 active:bg-bg-subtle">
              <Text className="mr-3 text-2xl">🖼️</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-ink">
                  Pick from gallery
                </Text>
                <Text className="text-xs text-ink-muted">
                  Choose existing photos
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setPickerOpen(false)}
              className="mt-4 py-2 active:opacity-60">
              <Text className="text-center text-sm font-semibold text-ink-muted">
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Preview / delete modal */}
      <Modal
        visible={previewIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewIndex(null)}>
        <View style={styles.previewBackdrop} className="bg-black/85">
          <SafeAreaView className="flex-1">
            <View className="flex-1 items-center justify-center px-6">
              {previewIndex !== null && photos[previewIndex] ? (
                <Image
                  source={{ uri: photos[previewIndex].uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : null}
            </View>
            <View className="px-6 pb-6">
              <Pressable
                onPress={() => {
                  if (previewIndex !== null) {
                    removePhoto(photos[previewIndex].id);
                  }
                }}
                android_ripple={{ color: '#fee2e2' }}
                className="rounded-xl bg-red-600 px-4 py-3 active:opacity-80">
                <Text className="text-center text-sm font-bold text-white">
                  Remove this photo
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setPreviewIndex(null)}
                className="mt-3 py-2 active:opacity-60">
                <Text className="text-center text-sm font-semibold text-white">
                  Close
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
  grid: {
    gap: TILE_GAP,
  },
  tile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f7f7f5',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  addTile: {
    borderWidth: 1.5,
    borderColor: '#C0AFDC',
    borderStyle: 'dashed',
    backgroundColor: '#E8E1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetCard: {
    width: '100%',
  },
  previewBackdrop: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});
