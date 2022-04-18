import React from 'react';
import { useDispatch } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import styled from 'styled-components/macro';

import { Form } from 'src/pages';
import { Modal } from 'src/components';

const Page = styled.main`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
`;

function App() {
  const dispatch = useDispatch();

  dispatch({ type: 'BOOT' });
  return (
    <Page>
      <CssBaseline />
      <Form />
      <Modal />
    </Page>
  );
}

export default App;
