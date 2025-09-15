import { View, Text } from "react-native";

export default function MetricsPanel({
  steps,
  distance,
  drift,
  speed,
}: {
  steps: number;
  distance: number;
  drift: number;
  speed: number;
}) {
  return (
    <View className="bg-white p-2 m-2 border border-gray-200 rounded-lg">
      <Text className="text-gray-700">Steps: {steps}</Text>
      <Text className="text-gray-700">Distance: {distance.toFixed(2)} m</Text>
      <Text className="text-gray-700">Drift: {drift.toFixed(2)} m</Text>
      <Text className="text-gray-700">Speed: {speed.toFixed(2)} m/s</Text>
    </View>
  );
}
