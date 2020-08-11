import React, { useRef } from 'react';
import styled from 'styled-components';
import socket from '../../socket';

const Main = () => {
  const roomRef = useRef();
  const userRef = useRef();

  const clickJoin = () => {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;

    socket.emit('BE-join-room', {roomName, userName});    
  };

  return (
    <MainContainer>
      <Row>
        <Label htmlFor="roomName">Room Name</Label>
        <Input type="text" id="roomName" ref={roomRef} />
      </Row>
      <Row>
        <Label htmlFor="userName">User Name</Label>
        <Input type="text" id="userName" ref={userRef} />
      </Row>
      <button onClick={clickJoin}> Join </button>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
`;

const Label = styled.label`
`;

const Input = styled.input`
  width: 150px;
  height: 20px;
  margin-left: 15px;
`;

export default Main;
