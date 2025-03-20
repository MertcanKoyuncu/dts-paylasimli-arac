import { Redirect } from 'expo-router';

export default function Index() {
  // Uygulamayı login ekranına yönlendir
  return <Redirect href="/login" />;
} 