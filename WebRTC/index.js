import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';

let mediaConstraints = {
	audio: true,
	video:false
};

let localMediaStream;
try {
	
	const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );
	localMediaStream = mediaStream;
                             
} catch( err ) {
	console.log("\n\n\nError Media Stream:\t", err,"\n\n\n\n");
};

let peerConstraints = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		}
	]
};

let peerConnection = new RTCPeerConnection( peerConstraints );

peerConnection.addEventListener( 'connectionstatechange', event => { console.log(event);} );
peerConnection.addEventListener( 'icecandidate', event => {} );
peerConnection.addEventListener( 'icecandidateerror', event => {} );
peerConnection.addEventListener( 'iceconnectionstatechange', event => {} );
peerConnection.addEventListener( 'icegatheringstatechange', event => {} );
peerConnection.addEventListener( 'negotiationneeded', event => {} );
peerConnection.addEventListener( 'signalingstatechange', event => {} );
peerConnection.addEventListener( 'track', event => {} );

const endCallCleanup = () => {
	localMediaStream.getTracks().forEach(
		track => {track.stop();}
	)
	
	localMediaStream = null
}

const createConnection = () => {

	localMediaStream.getTracks().forEach( 
		track => peerConnection.addTrack( track, localMediaStream )
	);

	let datachannel = peerConnection.createDataChannel( 'my_channel' );

	datachannel.addEventListener( 'open', event => {} );
	datachannel.addEventListener( 'close', event => {} );
	datachannel.addEventListener( 'message', message => {} );
	peerConnection.addEventListener( 'datachannel', event => {
		let datachannel = event.channel;
	
		// Now you've got the datachannel.
		// You can hookup and use the same events as above ^
	} );

	datachannel.send( 'Hey There!' );
}

const creatingOffer = async () => {
	let sessionConstraints = {
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: false,
			VoiceActivityDetection: true,
		}
	};
	try {
		const offerDescription = await peerConnection.createOffer( sessionConstraints );
		await peerConnection.setLocalDescription( offerDescription );
		
		
		// Send the offerDescription to the other participant.
	} catch( err ) {
		console.log("\n\n\n\nError Offer:", err,"\n\n\n\n");
	};
	try {
		// Use the received offerDescription
		// const offerDescription = creatingOffer();
		const rtcOfferDescription = new RTCSessionDescription( offerDescription );
		await peerConnection.setRemoteDescription( rtcOfferDescription );
	
		const answerDescription = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription( answerDescription );
	
		// Send the answerDescription back as a response to the offerDescription.
	} catch( err ) {
		console.log("\n\n\n\nError Answer:", err,"\n\n\n\n");
	};
}

// const createAnswer = async () => {
// 	try {
// 		// Use the received offerDescription
// 		// const offerDescription = creatingOffer();
// 		const rtcOfferDescription = new RTCSessionDescription( offerDescription );
// 		await peerConnection.setRemoteDescription( rtcOfferDescription );
	
// 		const answerDescription = await peerConnection.createAnswer();
// 		await peerConnection.setLocalDescription( answerDescription );
	
// 		// Send the answerDescription back as a response to the offerDescription.
// 	} catch( err ) {
// 		console.log("\n\n\n\nError Answer:", err,"\n\n\n\n");
// 	};
// }

const toggleMicrophone = async () => {
	let isMuted = false;
	try {
		const audioTrack = await localMediaStream.getAudioTracks()[ 0 ];
		audioTrack.enabled = !audioTrack.enabled;

		isMuted = !isMuted;
	} catch( err ) {
		// Handle Error
	};
}
const remoteAudioTrackControl = () => {
	const audioTrack = remoteMediaStream.getAudioTracks()[0];
	audioTrack._setVolume(0.5);
}

export {
	ScreenCapturePickerView, 
	RTCPeerConnection, 
	RTCIceCandidate,
	RTCSessionDescription, 
	RTCView, 
	MediaStream, 
	MediaStreamTrack, 
	mediaDevices,
	registerGlobals,
	createAnswer,
	createConnection,
	creatingOffer, 
	toggleMicrophone,
	remoteAudioTrackControl
};