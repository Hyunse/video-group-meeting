import React, { useEffect } from 'react';
import Peer from 'peerjs'
import socket from '../../socket';
import VideoCard from '../Video/VideoCard'

const Room = () => {

  useEffect(() => {
    const peer = new Peer('a');
    console.log(peer);

    peer.on('open', (id) => {
      console.log(id);
    });

    socket.on('connect', () => {
      console.log(`socket connected : ${socket.id}`);
    });
  }, []);
  return (
      <div>
        <VideoCard />
      </div>
  );
};

export default Room;
