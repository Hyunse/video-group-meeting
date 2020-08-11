import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/Main/Main';
import styled from 'styled-components';

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Switch>
          <Route exact path="/" component={Main} />
        </Switch>
      </AppContainer>
    </BrowserRouter>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  background-color: #454552;
  text-align: center;
`;

export default App;
