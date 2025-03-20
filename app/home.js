import React from 'react';
import HomeScreen from '../src/screens/HomeScreen';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  );
} 