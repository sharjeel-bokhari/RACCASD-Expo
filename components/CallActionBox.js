import { View, Text, TouchableOpacity } from "react-native";
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
        borderWidth: 2,
        borderColor: "#2d3748",
        backgroundColor:"#2d3748", 
        borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 30,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    }}>
      <TouchableOpacity
        onPress={onToggleMicrophone}
        style={{backgroundColor: "#4a5568", padding: 12, borderRadius: 99}} 
      >
          <Icon name={isMicOn ? "mic" : "mic-off"} size={35} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={endCall}
        style={{backgroundColor: "#dc2626", padding: 12, borderRadius: 99}}
      >
          <Icon name={"call"} size={35} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

export default CallActionBox;
