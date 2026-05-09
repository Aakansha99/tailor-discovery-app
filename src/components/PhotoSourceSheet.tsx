import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
};

export const PhotoSourceSheet = ({
  visible,
  title = 'Add a photo',
  onClose,
  onPickCamera,
  onPickGallery,
}: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}>
    <Pressable
      onPress={onClose}
      style={styles.backdrop}
      className="bg-black/40">
      <Pressable
        onPress={() => {
          /* swallow inner taps so they don't close the sheet */
        }}
        style={styles.sheet}
        className="rounded-t-2xl bg-white px-6 py-6">
        <Text className="mb-4 text-base font-bold text-ink">{title}</Text>

        <Pressable
          onPress={onPickCamera}
          android_ripple={{ color: '#f0f0ec' }}
          className="flex-row items-center rounded-xl border border-line px-4 py-3 active:bg-bg-subtle">
          <Text className="mr-3 text-2xl">📷</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink">
              Take a new photo
            </Text>
            <Text className="text-xs text-ink-muted">Use your camera now</Text>
          </View>
        </Pressable>

        <View className="h-2" />

        <Pressable
          onPress={onPickGallery}
          android_ripple={{ color: '#f0f0ec' }}
          className="flex-row items-center rounded-xl border border-line px-4 py-3 active:bg-bg-subtle">
          <Text className="mr-3 text-2xl">🖼️</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink">
              Pick from gallery
            </Text>
            <Text className="text-xs text-ink-muted">
              Choose an existing photo
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onClose}
          className="mt-4 py-2 active:opacity-60">
          <Text className="text-center text-sm font-semibold text-ink-muted">
            Cancel
          </Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
  },
});
