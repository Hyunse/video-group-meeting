import React, { useEffect, useRef} from 'react';
import styled from 'styled-components';
const VideoCard = (props) => {
  const ref = useRef();
  const num = props.number;
  const peer = props.peer;

  useEffect(() => {
      peer.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, [peer]);

  return (
    <Video
      playsInline
      autoPlay
      muted
      ref={ref}
      className={num > 0 ? `width-peer${num > 8 ? '' : num}` : ''}
    />
  );
};

const Video = styled.video`
`;

export default VideoCard;
