import { TextInput, View, Text } from "react-native";

export default function CustomTextInput({ label, ...textInputProps }: { label: string; [key: string]: any }) {
  return (
    <View>
      <Text className="font-semibold text-m pb-1 text-gray-600">{label}</Text>
      <TextInput
        {...textInputProps}
        className="p-3 border-2 border-gray-300 rounded-lg shadow-2xl"
      />
    </View>
  );
}
