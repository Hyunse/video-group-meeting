import React from 'react';
import styled from 'styled-components';

const BottomBar = ({ clickChat, goToBack }) => {
  return (
    <Bar>
      <Center>
        <ChatButton onClick={clickChat}>
          <div>
            <CommentIcon className="fa fa-comments"></CommentIcon>
          </div>
          Chat
        </ChatButton>
      </Center>
      <Right>
        <StopButton onClick={goToBack}>
          Stop
        </StopButton>
      </Right>
    </Bar>
  );
};

const Bar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  background-color: #4ea1d3;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Right = styled.div``;

const ChatButton = styled.div`
  width: 75px;
  border: none;
  font-size: 15px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }
`;

const CommentIcon = styled.i`
  width: 30px;
  font-size: calc(16px + 1vmin);
`;

const StopButton = styled.div`
  width: 75px;
  height: 30px;
  border: none;
  font-size: 15px;
  line-height: 30px;
  margin-right: 15px;
  background-color: #ee2560;
  border-radius: 15px;

  :hover {
    background-color: #f25483;
    cursor: pointer;
  }
`;

export default BottomBar;
