import React from 'react';
import styled from 'styled-components';

const Chat = ({ display }) => {
  return (
    <ChatContainer className={display ? '': 'width0'}>
      <TopHeader>Header</TopHeader>
      <ChatArea>Chat ARea</ChatArea>
      <BottomInput placeholder="Enter your message" />
    </ChatContainer>
  );
};

// const slide = keyframes`
//   width: 25%;
// `;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  hieght: 100%;
  background-color: white;
  transition: all 0.5s ease;
  overflow:hidden;
`;

const ChatArea = styled.div`
  width: 100%;
  height: 83%;
`;

const TopHeader = styled.div`
  top: 0;
  width: 100%;
  height: 10%;
`;

const BottomInput = styled.input`
  bottom: 0;
  width: 100%;
  height: 7%;
  padding: 15px;
  border-top: 1px solid rgb(69, 69, 82, 0.25);
  box-sizing: border-box;
  opacity: 0.7;

  :focus {
    outline: none;
  }
`;

export default Chat;
