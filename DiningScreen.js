import { WebView } from 'react-native-webview';

export default function DiningScreen() {
  return (
    <WebView 
      source={{ uri: 'https://www1.villanova.edu/villanova/services/dining/menus-ii.html' }} 
      style={{ flex: 1 }} 
    />
  );
}
