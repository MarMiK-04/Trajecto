import { View, Text } from "react-native";

export default function Header({ title }: { title: string }) {
  return (
    <View className="bg-blue-600 p-4">
      <Text className="text-white text-2xl font-bold">{title}</Text>
    </View>
  );
}
