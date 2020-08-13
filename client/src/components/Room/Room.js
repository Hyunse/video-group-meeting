import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';

const Room = (props) => {
  // const currentUser = sessionStorage.getItem('user');
  const { users } = props.location.state;
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const userVideoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        // all users
        const peers = [];
        users.forEach(({ userId }) => {
          const peer = createPeer(userId, socket.id, stream);

          peersRef.current.push({
            peerID: userId,
            peer,
          });

          peers.push(peer);
        });
        setPeers(peers);

        socket.on('FE-receive-call', ({ signal, from }) => {
          const peer = addPeer(signal, from, stream);

          peersRef.current.push({
            peerID: from,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peer = peersRef.current.find((p) => p.peerID === answerId);
          peer.peer.signal(signal);
        });
      });
    // eslint-disable-next-line
  }, []);

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  console.log('Peers', peers);

  return (
    <RoomContainer>
      {/* {stream && <video playsInline muted ref={userVideoRef} autoPlay />} */}
      {/* {callAccepted && (
        <video playsInline muted ref={partnerVideoRef} autoPlay />
      )} */}
      {/* {receiveCall && (
        <div>
          <div>{caller} is calling you</div>
          <button onClick={acceptCall}>Accept</button>
        </div>
      )} */}
      {/* {allUser &&
        allUser.map((user, _, arr) => {
          console.log('All user map', user);
          console.log(currentUser);

          if (user.userName === currentUser) {
            return null;
          }
          console.log('All user map2', user);
          return (
            <button onClick={() => initCall(user)} key={user.userName}>
              Call To {user.userName}
            </button>
          );
        })} */}

      <MyVideo ref={userVideoRef} muted autoPlay playInline />
      {peers &&
        peers.map((peer, index) => {
          return <VideoCard key={index} peer={peer} />;
        })}
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const MyVideo = styled.video`
  width: 500px;
  height: 500px;
`;
export default Room;
