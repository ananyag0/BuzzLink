import { useRef, useState } from 'react';
import './chatroom.css'
import { io } from 'socket.io-client'

const signalServerURL = 'http://localhost:8001';

const iceConfig = {};

function Chatroom() {

  function connect() {
    if (!userID) {
      alert('you need to have a user id');
      return;
    }
    const socket = io(signalServerURL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`connected to the server`);
      socket.emit('join', userID);
    })

    socket.on('call_request', (fromID) => {
      // this is callee
      setCalling(true);
      setOtherID(fromID);
    })

    socket.on('call_start', async (body) => {
      // both caller and callee will receive this event

      console.log(`receive call_start`);
      if (!localVideoRef.current) {
        console.log(`local localVideoRef has no current`);
        return;
      }

      const other = body.toID === userID ? body.fromID : body.toID;

      peerConnectionRef.current = new RTCPeerConnection(iceConfig);
      
      peerConnectionRef.current.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          const remoteStream = new MediaStream();
          remoteStreamRef.current = remoteStream;
          remoteVideoRef.current.srcObject = remoteStream;
        }
        remoteStreamRef.current.addTrack(event.track);
      }

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', other, event.candidate);
        }
      }

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },  // Ideal width (you can also use exact, min, or max)
          height: { ideal: 180 }   // Ideal height
        },
        audio: true
      });

      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
      // localVideoRef.current.style.display = 'inline-block';
    
      for (const track of localStream.getTracks()) {
        peerConnectionRef.current.addTrack(track);
      }

      if (body.fromID === userID) {
        // this is the caller, so create offer
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit('offer', { ...body, offer })
      }

    })

    socket.on('offer', async (body) => {
      console.log(`receive offer`);
      // this is callee
      if (!peerConnectionRef.current) {
        console.log(`peerConnectionRef has no current`);
        return;
      }
      await peerConnectionRef.current.setRemoteDescription(body.offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { ...body, answer });
    })

    socket.on('answer', async (body) => {
      // this is caller
      peerConnectionRef.current?.setRemoteDescription(body.answer);
    })

    socket.on('candidate', (candidate) => {
      peerConnectionRef.current?.addIceCandidate(candidate);
    })

  }


  function acceptCall() {
    const body = {
      fromID: otherID,
      toID: userID,
    }
    socketRef.current?.emit('call_accept', body);
    setCalling(false);
  }

  function rejectCall() {
    const body = {
      fromID: otherID,
      toID: userID,
    }
    socketRef.current?.emit('call_reject', body);
    setCalling(false);
  }

  function CallingTag() {
    if (calling === false) {
      return <div>no call now</div>
    }
    if (otherID === targetID) {
      return <div>calling {targetID}</div>
    }
    return <div>
      there is a call from {otherID}
      <button onClick={acceptCall}>Accept</button>
      <button onClick={rejectCall}>Reject</button>
    </div>
  }

  async function requestCall() {
    if (!targetID || !userID) {
      alert('You need to have a room and user ID');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia is not supported!');
      alert('The browser does not navigator.mediaDevices is not supported! This can be due to http/s');
      return null;
    }
    if (peerConnectionRef.current) {
      console.log(`peerConnection already exists, you should not request another call`);
      return;
    } 
    if (localStreamRef.current) {
      console.log(`local stream already exists, you should not request another call`);
      return;
    }
    if (!localVideoRef.current || !remoteVideoRef.current) {
      console.log(`local/remote video element not rendered yet (current not ready)`);
      return;
    }
    if (!socketRef.current) {
      console.log(`socketRef has no current`);
      return;
    }

    const body = {
      toID: targetID,
      fromID: userID
    }

    setCalling(true);
    setOtherID(targetID);
    socketRef.current.emit('call_request', body);

  }

  const socketRef = useRef();

  const [targetID, setTargetID] = useState("");
  const [userID, setUserID] = useState("");
  const [otherID, setOtherID] = useState("");

  const [calling, setCalling] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();
  const peerConnectionRef = useRef();

  return <div>

    <CallingTag />

    <div>
      your ID <input type='text' value={userID} onChange={e => setUserID(e.target.value)} disabled={calling} />
    </div>

    <button onClick={connect} disabled={calling}>Connect to server</button>

    <div>
      target ID <input type="text" value={targetID} onChange={e => setTargetID(e.target.value)} disabled={calling} />
    </div>

    <button onClick={requestCall} disabled={calling}>
      call
    </button> <br />

    <video className='myVideo' autoPlay ref={localVideoRef}></video>
    <video className='otherVideo' autoPlay ref={remoteVideoRef}></video>

  </div>
}

export default Chatroom;
