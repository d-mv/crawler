import { map } from 'ramda';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { getMessages } from 'src/store/app/app.reducer';

const Section = styled.section`
  position: absolute;
  width: 95%;
  height: 10rem;
  left: 2.5%;
  z-index: 1;
  border-radius: 0.3rem;
  padding: 1rem;
  border-radius: 0 0 0.3rem 0.3rem;
  border: 0.1rem solid rgba(0, 0, 0, 0.01);
  padding: 0 1rem;
  background-color: rgba(0, 0, 0, 0.1);
`;

const List = styled.ul`
  height: 8rem;
  overflow: scroll;
  background-color: #415364;
  padding-inline-start: 2rem;
  padding-block-start: 0.3rem;
  list-style-type: circle;
  border-radius: 0.3rem;
  padding-block-end: 0.3rem;
`;

const Message = styled.li`
  color: #fff;
  font-size: 1.2rem;
  padding: 0.1rem 0;
`;

export function Messages() {
  const messages = useSelector(getMessages);

  const focusRef = useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (focusRef.current) {
      // eslint-disable-next-line no-console
      console.log('working', focusRef.current.scrollIntoView());
    }
  }, [messages]);

  if (!messages.length) return <></>;

  const mapMessage = (message: string) => <Message>{message}</Message>;

  const renderMessages = () => (
    <List>
      {map(mapMessage, messages)}
      <div ref={focusRef} style={{ width: '100%', height: '.1rem' }} />
    </List>
  );

  return <Section className='animate__animated animate__slideInDown'>{renderMessages()}</Section>;
}
