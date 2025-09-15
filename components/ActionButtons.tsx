import { View, TouchableOpacity, Text } from "react-native";

type Props = {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
};

export default function ActionButtons({ running, onStart, onStop }: Props) {
  return (
    <View className="flex-row justify-center p-2 m-2">
      {!running ? (
        <TouchableOpacity
          className="bg-green-600 px-6 py-3 rounded-lg"
          onPress={onStart}
        >
          <Text className="text-white font-bold text-lg">Start</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-red-600 px-6 py-3 rounded-lg"
          onPress={onStop}
        >
          <Text className="text-white font-bold text-lg">Stop</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
