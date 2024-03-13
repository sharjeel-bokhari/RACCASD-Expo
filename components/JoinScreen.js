import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Button, View } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
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
import CallActionBox from "../components/CallActionBox";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinScreen({ roomId, screens, setScreen }) {
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();

  const [isMuted, setIsMuted] = useState(false);

  //Automatically start stream
  useEffect(() => {
    startLocalStream();
  }, []);
  useEffect(() => {
    if (localStream) {
      joinCall(roomId);
    }
  }, [localStream]);

  //End call button
  async function endCall() {
    if (cachedLocalPC) {
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    const roomRef = doc(db, "room", roomId);
    await updateDoc(roomRef, { answer: deleteField(), connected: false });

    setLocalStream();
    setRemoteStream(); // set remoteStream to null or empty when callee leaves the call
    setCachedLocalPC();
    // cleanup
    setScreen(screens.ROOM); //go back to room screen
  }

  //start local webcam on your device
  const startLocalStream = async () => {
    const constraints = {
      audio: true,
      video: false
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  //join call function
  const joinCall = async (id) => {
    const roomRef = doc(db, "room", id);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists) return;
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      addDoc(calleeCandidatesCollection, e.candidate.toJSON());
    });

    localPC.ontrack = (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };

    const offer = roomSnapshot.data().offer;
    await localPC.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    await updateDoc(roomRef, { answer, connected: true }, { merge: true });

    onSnapshot(callerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (!data.answer) {
        setScreen(screens.ROOM);
      }
    });

    setCachedLocalPC(localPC);
  };


  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  return (
    <View style={{flex: 1}}>
      <RTCView
        style={{flex: 1}}
        streamURL={remoteStream && remoteStream.toURL()}
        objectFit={"cover"}
      />

      {remoteStream && (
        <RTCView
        style={{
            width: "8rem", 
            height: "12rem", 
            position: "absolute",
            right: "1.5rem",
            top: "2rem"
          }}
          streamURL={localStream && localStream.toURL()}
        />
      )}
      <View style={{position: "absolute", bottom: "0", width: '100%'}}>
        <CallActionBox
          toggleMute={toggleMute}
          endCall={endCall}
        />
      </View>
    </View>
  );
}