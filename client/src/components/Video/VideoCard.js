import React from 'react';
import styled from 'styled-components'
const VideoCard = () => {
  return (
      <VideoContainer>
        <Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" controls/>
      </VideoContainer>
  );
};

const VideoContainer = styled.div`
  width: 500px;
  height: 500px;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

export default VideoCard;
