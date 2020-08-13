import React, { useEffect, useRef} from 'react';
import styled from 'styled-components'
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;
  
  useEffect(() => {
      peer.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, [peer]);

  return (
      <Video playsInline autoPlay muted ref={ref} />
  );
};

const Video = styled.video`
  width: 300px;
  height: 300px;
`;

export default VideoCard;
