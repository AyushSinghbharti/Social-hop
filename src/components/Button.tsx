import { View, Text, Pressable } from "react-native";
import React from "react";

type ButtonProps = {
    title: string;
    onPress ?: () => void;
}

const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <Pressable onPress={onPress} className="bg-blue-500 w-full p-3 items-center rounded-lg mt-auto">
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
};

export default Button;
