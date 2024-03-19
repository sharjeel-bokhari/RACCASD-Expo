import React, { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";

export default function RoomScreen({ setScreen, screens, setRoomId, roomId }) {
  const onCallOrJoin = (screen) => {
    if (roomId.length > 0) {
      setScreen(screen);
    }
  };

  //generating random room id
  useEffect(() => {
    const generateRandomId = () => {
      const characters = "abcdefghijklmnopqrstuvwxyz";
      let result = "";
      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return setRoomId(result);
    };
    generateRandomId();
  }, []);

  //checks if room is existing
  const checkMeeting = async () => {
    if (roomId) {
      const roomRef = doc(db, "room", roomId);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists() || roomId === "") {
        Alert.alert("Wait for your instructor to start the meeting.");
        return;
      } else {
        onCallOrJoin(screens.JOIN);
      }
    } else {
      Alert.alert("Provide a valid Room ID.");
    }
  };

  return (
    <View>
      <Text style={{
        fontSize: 24,
        fontWeight: "bold", 
        textAlign: "center"
      }}>
          Enter Room ID:
        </Text>
      <TextInput
        style={{
            backgroundColor: '#fff',
            borderColor: '#38b2ac',
            borderWidth: 2,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 12,
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
        }}
        value={roomId}
        onChangeText={setRoomId}
      />
      <View style={{
        marginTop: 12, 
        marginLeft: 20,
        marginRight: 20,
        marginTop: 8
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#60a5fa',
            padding: 8,
            borderRadius: 6
          }}
          onPress={() => onCallOrJoin(screens.CALL)}
        >
          <Text style={{
            color: "#000",
            textAlign: "center", 
            fontSize: 20,
            fontWeight: "bold"
          }}>
            Start meeting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#60a5fa',
            padding: 8,
            borderRadius: 6
          }}
          onPress={() => checkMeeting()}
        >
          <Text 
          style={{
            backgroundColor: '#60a5fa',
            padding: 8,
            borderRadius: 6
          }}>
            Join meeting
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
