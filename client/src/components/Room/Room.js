import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';
import BottomBar from '../BottomBar/BottomBar';
import Chat from '../Chat/Chat';

const Room = (props) => {
  const currentUser = sessionStorage.getItem('user');
  const [peers, setPeers] = useState([]);
  const [displayChat, setDisplayChat] = useState(false);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const roomId = props.match.params.roomId;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;

        socket.emit('BE-join-room', { roomId, userName: currentUser });
        socket.on('FE-user-join', (users) => {
          console.log('FE-user-join', users);
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
        });

        socket.on('FE-receive-call', ({ signal, from }) => {
          const peerIdx = peersRef.current.find((p) => p.peerID === from);
          if (peerIdx === undefined || peerIdx === -1) {
            const peer = addPeer(signal, from, stream);

            peersRef.current.push({
              peerID: from,
              peer,
            });
            console.log('FE-receive-call');
            setPeers((users) => [...users, peer]);
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          console.log('FE-call-accepted', answerId);
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
      console.log('Create-Peer-Signal');
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
      console.log('Add-Peer-Signal');
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const clickChat = () => {
    setDisplayChat(!displayChat);
  };

  return (
    <RoomContainer>
      <VideoAndBarContainer>
        <VideoContainer>
          <MyVideo ref={userVideoRef} muted autoPlay playInline />
          {peers &&
            peers.map((peer, index) => {
              return <VideoCard key={index} peer={peer} />;
            })}
        </VideoContainer>
        <BottomBar clickChat={clickChat} />
      </VideoAndBarContainer>
      <Chat display={displayChat} roomId={roomId}/>
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: row;
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const VideoAndBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const MyVideo = styled.video`
  width: 25%;
  height: 100%;
`;

export default Room;
