import React, { useRef, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import socket from '../../socket';

const Main = () => {
  const roomRef = useRef();
  const userRef = useRef();
  const [toRoom, setToRoom] = useState({ roomName: '', err: false });
  const [room, setRoom] = useState({ roomName: '', users: {} });

  useEffect(() => {
    socket.on('FE-error-user-exist', ({ err }) => {
      setToRoom({ err });
    });

    socket.on('FE-user-join', ({ roomName, users }) => {
      console.log('Enter join');
      joinRoom(roomName, users);
    });
  }, []);

  function joinRoom(roomName, users) {
    setRoom({ roomName, users });
    setToRoom({ roomName });
  }

  function clickJoin() {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;

    socket.emit('BE-join-room', { roomName, userName });
  }

  console.log(toRoom);

  return (
    <MainContainer>
      {toRoom.roomName && !toRoom.err ? (
        <Redirect to={{ pathname: `/room/${toRoom.roomName}`, state: { room } }} />
      ) : null}
      <Row>
        <Label htmlFor="roomName">Room Name</Label>
        <Input type="text" id="roomName" ref={roomRef} />
      </Row>
      <Row>
        <Label htmlFor="userName">User Name</Label>
        <Input type="text" id="userName" ref={userRef} />
      </Row>
      <JoinButton onClick={clickJoin}> Join </JoinButton>
      {toRoom.err ? <Error>{toRoom.err}</Error> : null}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 150px;
  height: 30px;
  margin-left: 15px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 25px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;

export default Main;
