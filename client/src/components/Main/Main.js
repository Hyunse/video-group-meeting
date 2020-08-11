import React, { useEffect } from 'react';
import socket from '../../socket';

const Main = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected');
    });
  }, []);
  return <div>Main</div>;
};

export default Main;
