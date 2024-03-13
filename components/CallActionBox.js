import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

import Icon from "react-native-vector-icons/MaterialIcons";

const CallActionBox = ({ toggleMute, endCall }) => {
  const [isMicOn, setIsMicOn] = useState(true);

  const onToggleMicrophone = () => {
    toggleMute();
    setIsMicOn(!isMicOn);
  };

  return (
    <View style={{
        borderWidth: 2, // Changed from "2px" to 2
        borderColor: "#2d3748",
        backgroundColor:"#2d3748", 
        borderTopLeftRadius: 24, // Changed from "1.5rem" to 24
        padding: 20, // Changed from "1.25rem" to 20
        paddingBottom: 40, // Changed from "2.5rem" to 40
        width: "100%",
        display: "flex", // Enclosed in quotes
        flexDirection: "row", // Enclosed in quotes
        justifyContent: "space-between" // Enclosed in quotes
    }}>
      <Pressable
        onPress={onToggleMicrophone}
        style={{backgroundColor: "#4a5568", padding: 12, borderRadius: 9999}} // Changed from "0.75rem" to 12
      >
        <Text>
          <Icon name={isMicOn ? "mic" : "mic-off"} size={35} color={"white"} />
        </Text>
      </Pressable>
      <Pressable 
        onPress={endCall}
        style={{backgroundColor: "#dc2626", padding: 12, borderRadius: 9999}} // Changed from "0.75rem" to 12
      
      >
        <Text>
          <Icon name={"call"} size={35} color={"white"} />
        </Text>
      </Pressable>
    </View>
  );
};

export default CallActionBox;
