import React from 'react';
import styled from 'styled-components';

const BottomBar = ({ clickChat }) => {
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
    </Bar>
  );
};

const Bar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  background-color: #4ea1d3;
`;

const Center = styled.div`
`;

const ChatButton = styled.div`
  width: 75px;
  border: none;
  font-size: 17px;

  :hover {
    background-color: #77B7DD;
    cursor: pointer;
    border-radius: 15px;
  }
`;

const CommentIcon = styled.i`
  width: 30px;
  font-size: 30px;
`

export default BottomBar;
