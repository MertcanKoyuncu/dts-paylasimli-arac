import React from 'react';
import ProfileScreen from '../src/screens/ProfileScreen';
import { Stack } from 'expo-router';

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreen />
    </>
  );
} 