import { WebView } from "react-native-webview";

export default function MyNovaScreen() {
  return (
    <WebView
      source={{ uri: "https://mynova.villanova.edu" }}
      style={{ flex: 1 }}
    />
  );
}
