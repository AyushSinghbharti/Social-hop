import { TextInput, View, Text } from "react-native";

export default function CustomTextInput({ label, ...textInputProps }: { label: string; [key: string]: any }) {
  return (
    <View className="w-full">
      <Text className="font-semibold text-m pb-1 text-gray-600 dark:text-white mb-1">{label}</Text>
      <TextInput
        {...textInputProps}
        className="p-3 border-2 border-gray-300 rounded-lg shadow-2xl dark:text-white dark:border-gray-600"
      />
    </View>
  );
}
