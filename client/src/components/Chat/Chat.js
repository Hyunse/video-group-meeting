import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import socket from '../../socket';

const Chat = ({ display, roomId }) => {
  const currentUser = sessionStorage.getItem('user');
  const [msg, setMsg] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef();
  
  useEffect(() => {
    socket.on('FE-receive-message', ({ msg, sender }) => {
      setMsg((msgs) => [...msgs, { sender, msg }]);
    });
  }, []);

  // Scroll to Bottom of Message List
  useEffect(() => {scrollToBottom()}, [msg])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth'});
  }

  const sendMessage = (e) => {
    if (e.key === 'Enter') {
      const msg = e.target.value;

      if (msg) {
        socket.emit('BE-send-message', { roomId, msg, sender: currentUser });
        inputRef.current.value = '';
      }
    }
  };

  return (
    <ChatContainer className={display ? '' : 'width0'}>
      <TopHeader>Group Chat Room</TopHeader>
      <ChatArea>
        <MessageList>
          {msg &&
            msg.map(({ sender, msg }, idx) => {
              if (sender !== currentUser) {
                return (
                  <Message key={idx}>
                    <strong>{sender}</strong>
                    <p>{msg}</p>
                  </Message>
                );
              } else {
                return (
                  <UserMessage key={idx}>
                    <strong>{sender}</strong>
                    <p>{msg}</p>
                  </UserMessage>
                );
              }
            })}
            <div style={{float:'left', clear: 'both'}} ref={messagesEndRef} />
        </MessageList>
      </ChatArea>
      <BottomInput
        ref={inputRef}
        onKeyUp={sendMessage}
        placeholder="Enter your message"
      />
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  hieght: 100%;
  background-color: white;
  transition: all 0.5s ease;
  overflow: hidden;
`;

const TopHeader = styled.div`
  width: 100%;
  margin-top: 15px;
  font-weight: 600;
  font-size: 20px;
  color: black;
`;

const ChatArea = styled.div`
  width: 100%;
  height: 83%;
  max-height: 83%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const MessageList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 15px;
  color: #454552;
`;

const Message = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 16px;
  margin-top: 15px;
  margin-left: 15px;
  text-align: left;

  > strong {
    margin-left: 3px;
  }

  > p {
    max-width: 65%;
    width: auto;
    padding: 9px;
    margin-top: 3px;
    border: 1px solid rgb(78, 161, 211, 0.3);
    border-radius: 15px;
    box-shadow: 0px 0px 3px #4ea1d3;
    font-size: 14px;
  }
`;

const UserMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  font-size: 16px;
  margin-top: 15px;
  text-align: right;

  > strong {
    margin-right: 35px;
  }

  > p {
    max-width: 65%;
    width: auto;
    padding: 9px;
    margin-top: 3px;
    margin-right: 30px;
    border: 1px solid rgb(78, 161, 211, 0.3);
    border-radius: 15px;
    background-color: #4ea1d3;
    color: white;
    font-size: 14px;
    text-align: left;
  }
`;

const BottomInput = styled.input`
  bottom: 0;
  width: 100%;
  height: 8%;
  padding: 15px;
  border-top: 1px solid rgb(69, 69, 82, 0.25);
  box-sizing: border-box;
  opacity: 0.7;

  :focus {
    outline: none;
  }
`;

export default Chat;
