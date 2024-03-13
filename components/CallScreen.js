import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
    RTCPeerConnection, 
    RTCView,
    mediaDevices, 
    RTCIceCandidate,
    RTCSessionDescription,
    MediaStream 
} from "react-native-webrtc";

import { 
    db, 
    addDoc, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    onSnapshot, 
    deleteField 
} from "../firebase/index";
import CallActionBox from "./CallActionBox";

const configuration = {
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
    iceCandidatePoolSize: 10,
  };

const CallScreen = ({ roomId, screens, setScreen }) => {

    const [localStream, setLocalStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [cachedLocalPC, setCachedLocalPC] = useState();

    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        startLocalStream();
    },[])

    useEffect(() => {
        if (localStream && roomId) {
          startCall(roomId);
        }
    }, [localStream, roomId]);
    
    async function endCall() {
        if (cachedLocalPC) {
          const senders = cachedLocalPC.getSenders();
          senders.forEach((sender) => {
            cachedLocalPC.removeTrack(sender);
          });
          cachedLocalPC.close();
        }
    
        const roomRef = doc(db, "room", roomId);
        await updateDoc(roomRef, { answer: deleteField() });
    
        setLocalStream();
        setRemoteStream(); // set remoteStream to null or empty when callee leaves the call
        setCachedLocalPC();
        // cleanup
        setScreen(screens.ROOM); //go back to room screen
    }
      
  const startLocalStream = async () => {    
      const constraints = {
        audio: true,
        video: false,
      };
      const newStream = await mediaDevices.getUserMedia(constraints);
      setLocalStream(newStream);
  };

  const startCall = async (id) => {
      const localPC = new RTCPeerConnection(configuration);
      localStream.getTracks().forEach((track) => {
        localPC.addTrack(track, localStream);
      })

      const roomRef = doc(db, "room", id);
      const callerCandidatesCollection = collection(roomRef, "callerCandidates");
      const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

      localPC.addEventListener("icecandidate", (e) => {
          if (!e.candidate) {
              console.log("Got final Candidate");
              return;
          }
          addDoc(callerCandidatesCollection, e.candidate.toJSON());
      });

      localPC.ontrack = (e) => {
          const newStream = new MediaStream();
          e.streams[0].getTracks().forEach((track) => {
            newStream.addTrack(newStream);
          });
          setRemoteStream(newStream);
      }

      const offer = await localPC.createOffer();
      await localPC.setLocalDescription(offer);

      await setDoc(roomRef, {offer, connected: false}, {merge: true});
      // listen for remote answer
      onSnapshot(roomRef, (doc) => {
        const data = doc.data();
        if (!localPC.currentRemoteDescription && data.answer) {
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            localPC.setRemoteDescription(rtcSessionDescription);
        } else {
          setRemoteStream();
        }
      });

      onSnapshot(calleeCandidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              let data = change.doc.data();
              localPC.addIceCandidate(new RTCIceCandidate(data));
          }
        });
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

    return(
        <SafeAreaView>
            <View style={{flex: 1, backgroundColor: '#dc2626'}}>
                {!remoteStream && (
                  <RTCView
                    style={{flex:1}}
                    streamURL={localStream && localStream.toURL()}
                    objectFit={"cover"}
                  />
                )}

                {remoteStream && (
                  <>
                    <RTCView
                      style={{flex:1}}
                      streamURL={remoteStream && remoteStream.toURL()}
                      objectFit={"cover"}
                    />
                    (
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
                    )
                  </>
                )}
                <View style={{position: "absolute", bottom: "0", width: '100%'}}>
                  <CallActionBox
                    toggleMute={toggleMute}
                    endCall={endCall}
                  />
                </View>
              </View>
        </SafeAreaView>
    );
}

export default CallScreen;