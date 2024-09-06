import { TextInput, View, Text, StyleSheet, useColorScheme } from "react-native";

export default function CustomTextInput({ label, ...textInputProps }: { label: string; [key: string]: any }) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ffffff' : '#6b7280' }]}>{label}</Text>
      <TextInput
        {...textInputProps}
        style={[
          styles.textInput,
          {
            borderColor: colorScheme === 'dark' ? '#525252' : '#d1d5db',
            color: colorScheme === 'dark' ? '#ffffff' : '#000000',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 4,
    marginBottom: 4,
  },
  textInput: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});