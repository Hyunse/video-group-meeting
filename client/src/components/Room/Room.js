import React, { useState } from 'react';
import Peer from 'simple-peer';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';

const Room = (props) => {
  const { users } = props.location.state.room;
  const [peers, setPeers] = useState({});

  function createPeer(socketId, caller, userName) {
    console.log(`${socketId}, ${caller}, ${userName}`);
    const peer = new Peer({
      initiator: true,
      trickle: false,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-send-call', {});
    });

    peer.on('error', (err) => {
      console.log(err);
    });

    peer.on('close', () => {
      console.log('Peer close');
    });

    return peer;
  }

  function initCall(users) {
    const peers = {};

    users.forEach(({ socketId, userName }) => {
      const newPeer = createPeer(socketId, socket.id, userName);
      peers[userName] = newPeer;
    });

    setPeers(peers);
  }

  console.log('PEERS', peers);
  return (
    <div>
      Main
      {users &&
        users.map((socketId, userName) => {
          console.log('Peer', peers[userName]);
          return (
            <div>
              {`userName: ${userName}`}
              <VideoCard initCall={initCall} />
            </div>
          );
        })}
    </div>
  );
};

export default Room;
