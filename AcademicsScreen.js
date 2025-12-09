import { WebView } from "react-native-webview";

export default function AcademicsScreen() {
  return (
    <WebView
      source={{ uri: "https://elearning.villanova.edu" }}
      style={{ flex: 1 }}
    />
  );
}
