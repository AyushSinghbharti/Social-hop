import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

type ButtonProps = {
  title: string;
  onPress?: () => void;
}

const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff', // blue-500
    padding: 12, // p-3
    borderRadius: 8, // rounded-lg
    marginTop: 'auto', // mt-auto
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // text-white
    fontWeight: '600', // font-semibold
  },
});

export default Button;