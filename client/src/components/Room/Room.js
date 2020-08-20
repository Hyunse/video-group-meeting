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
    // Set Back Button Event
    window.addEventListener('popstate', goToBack);

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;

        socket.emit('BE-join-room', { roomId, userName: currentUser });
        socket.on('FE-user-join', (users) => {
          // all users
          const peers = [];
          users.forEach(({ userId, userName }) => {
            if (userName !== currentUser) {
              const peer = createPeer(userId, socket.id, stream);

              peersRef.current.push({
                peerID: userId,
                peer,
              });

              peers.push(peer);
            }
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
            setPeers((users) => {
              return [...users, peer];
            });
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peer = peersRef.current.find((p) => p.peerID === answerId);
          peer.peer.signal(signal);
        });

        socket.on('FE-user-leave', ({ userId, userName }) => {
          const peer = peersRef.current.find((p) => p.peerID === userId);
          peer.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) =>{
              if(user.peerID !== peer.peer.peerID) {
                return user;
              }
            });
            return [...users];
          });
        });
      });

    return () => {
      socket.disconnect();
    };
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

    peer.on('disconnect', () => {
      peer.destroy();
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

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  // Open Chat
  const clickChat = () => {
    setDisplayChat(!displayChat);
  };

  // BackButton
  const goToBack = (e) => {
    e.preventDefault();
    socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <RoomContainer>
      <VideoAndBarContainer>
        <VideoContainer>
          <MyVideo
            ref={userVideoRef}
            muted
            autoPlay
            playInline
            className={
              peers.length > 0
                ? `width-peer${peers.length > 8 ? '' : peers.length}`
                : ''
            }
          />
          {peers &&
            peers.map((peer, index, arr) => {
              return <VideoCard key={index} peer={peer} number={arr.length} />;
            })}
        </VideoContainer>
        <BottomBar clickChat={clickChat} goToBack={goToBack} />
      </VideoAndBarContainer>
      <Chat display={displayChat} roomId={roomId} />
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
  max-width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
  gap: 10px;
`;

const VideoAndBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const MyVideo = styled.video`
  width: 50%;
`;

export default Room;
