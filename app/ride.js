import React from 'react';
import RideScreen from '../src/screens/RideScreen';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function Ride() {
  const params = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RideScreen route={{ params }} />
    </>
  );
} 