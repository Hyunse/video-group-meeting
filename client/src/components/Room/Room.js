import React, { useEffect } from 'react';
import Peer from 'simple-peer';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';

const Room = () => {
  useEffect(() => {
    const peer = new Peer('a');
    console.log(peer);

    peer.on('open', (id) => {
      console.log(id);
    });

  }, []);
  return (
    <div>
      <VideoCard />
    </div>
  );
};

export default Room;
