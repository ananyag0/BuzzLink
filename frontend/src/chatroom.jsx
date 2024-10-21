import { useEffect, useRef, useState } from 'react';
import './chatroom.css'
import { io } from 'socket.io-client'

const signalServerURL = 'http://localhost:8001';

/**
 * A simple client component to establish a one-to-one real time communication.
 * It is only for demonstration and has no any style so far.
 * */
function Chatroom() {

  /**
   * the function is called when the user clicks 'connect' 
   * It registers a bunch of event handlers
   * */
  async function connect() {
    if (!userID) {
      alert('you need to have a user id');
      return;
    }

    // const response = await fetch(`${signalServerURL}/ice`);
    // const iceServers = await response.json();

    const socket = io(signalServerURL);
    socketRef.current = socket;

    setConnected(true);

    socket.on('connect', () => {
      console.log(`connected to the server`);
      socket.emit('join', userID);
    })

    socket.on('current_users', (userList) => {
      setUserList(userList);
    })

    socket.on('peer_join', (newUser) => {
      setUserList(old => [...old, newUser]);
    })

    socket.on('peer_leave', (user) => {
      const newList = userList.filter((id) => id !== user);
      setUserList(newList);
    })

    socket.on('call_request', (body) => {
      // this is callee
      setCalling(true);
      setCallerID(body.fromID);
      setCalleeID(body.toID);
    })

    socket.on('call_start', async (body) => {
      // both caller and callee will receive this event
      setCommunicating(true);
      startCall(body.fromID, body.toID);
    })

    socket.on('communication_stop', () => {
      alert('the communication has been stopped!');
      clean();
    })

    socket.on('offer', async (body) => {
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
      // both caller and callee
      peerConnectionRef.current?.addIceCandidate(candidate);
    })

  }

  /**
   * a simple function used in CallingTag to accept a call
   * */
  function acceptCall() {
    const body = {
      fromID: callerID,
      toID: calleeID
    }
    socketRef.current.emit('call_accept', body);
    setCalling(false);
  }

  /**
   * a simple function used in CallingTag to reject a call
   * */
  function rejectCall() {
    const body = {
      fromID: callerID,
      toID: calleeID
    }
    socketRef.current?.emit('call_reject', body);
    setCalling(false);
  }

  /**
   * the function is called when you click 'call'. It request a call from you to the target
   * */
  async function requestCall(target) {
    if (calling) {
      console.log('You should not start another call before resolving the current one');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia is not supported!');
      alert('The browser does not support navigator.mediaDevices! This is likely because of the http/s issue. You can try localhost.');
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
      console.log(`local/remote video element not rendered yet`);
      return;
    }
    if (!socketRef.current) {
      console.log(`socketRef has no current`);
      return;
    }

    const body = {
      toID: target,
      fromID: userID
    }

    setCalleeID(target)
    setCallerID(userID);
    setCalling(true);
    socketRef.current.emit('call_request', body);

  }

  /**
   * different from requestCall, this function is called after the call has been accepted.
   * it starts ice and sdp exchange.
   * */
  async function startCall(fromID, toID ) {
    const other = toID === userID ? fromID : toID;

    peerConnectionRef.current = new RTCPeerConnection();
      
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
        socketRef.current.emit('candidate', other, event.candidate);
      }
    }

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 320 },  
        height: { ideal: 180 }  
      },
      audio: true
    });

    localStreamRef.current = localStream;
    localVideoRef.current.srcObject = localStream;
    localVideoRef.current.muted = true;
    
    for (const track of localStream.getTracks()) {
      peerConnectionRef.current.addTrack(track);
    }

    if (fromID === userID) {
      // this is the caller, so create offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', { fromID, toID, offer })
    }
  }

  function sendStopEvent() {
    socketRef.current.emit('communication_stop', [callerID, calleeID])
  }

  function clean() {
    peerConnectionRef.current.close();
    localStreamRef.current.getTracks().forEach(track => track.stop());
    remoteStreamRef.current.getTracks().forEach(track => track.stop());
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    setCommunicating(false);
    setCallerID('');
    setCalleeID(''); 
    peerConnectionRef.current = null; 
  }

  /**
   * display some information when you are the caller or callee
   * */
  function CallingTag() {
    if (calling === false) {
      return <div>no call now</div>
    }
    if (userID === callerID) {
      return <div>calling {calleeID}</div>
    }
    return <div>
      there is a call from {callerID}
      <button onClick={acceptCall}>Accept</button>
      <button onClick={rejectCall}>Reject</button>
    </div>
  }

  function UserList() {
    if (userList.length === 0) {
      return <div>no other online peers</div>
    }
    return (
      userList.map(peerID => (
        <li key={peerID}>
          {peerID}
          <button onClick={() => requestCall(peerID)}>call</button>
        </li>
      ))
    )
  }

  const socketRef = useRef(); // socket

  const [userID, setUserID] = useState("");
  const [callerID, setCallerID] = useState("");
  const [calleeID, setCalleeID] = useState("");

  const [connected, setConnected] = useState(false);
  // calling here refers to the state where one is waiting for the other to accept. 
  // once it is accepted or rejected, it is no longer calling. 
  // if accepted, it becomes 'communicating' until stopped
  const [calling, setCalling] = useState(false); 
  const [communicating, setCommunicating] = useState(false);

  const [userList, setUserList] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();
  const peerConnectionRef = useRef();

  // disconnect from the server when the page is closed or refreshed
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        setUserList([]);
        setConnected(false);
        clean();
      }
    }
  }, []);

  return <div>

    <div>
      your ID <input type='text' value={userID} onChange={e => setUserID(e.target.value)} disabled={connected} />

      <button onClick={connect} disabled={connected}>Connect to server</button>
      <span>
        {connected ? "connected" : 'not connected'}
      </span>
    </div>

    <UserList />

    <CallingTag />

    {communicating ? <button onClick={sendStopEvent}> Stop </button> : ""}

    <video className='myVideo' autoPlay ref={localVideoRef}></video>
    <video className='otherVideo' autoPlay ref={remoteVideoRef}></video>

  </div>
}

export default Chatroom;
