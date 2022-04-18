import React from 'react';
import { map } from 'ramda';
import styled from 'styled-components/macro';

import { Link, PageInfo } from 'src/models';

const List = styled.ul`
  width: 60rem;
  max-width: 95%;
  overflow: scroll;
  max-height: 30rem;
  padding-inline-start: 2rem;
  max-width: 100%;
  font-size: 1.2rem;
  padding-block-end: 1rem;
  p {
    margin-block-start: 0;
    margin-block-end: 0;
    font-weight: 600;

    span {
      font-weight: 400;
    }
  }
  > li {
    padding-block-end: 0.5rem;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);
    margin-block-end: 0.5rem;
  }
`;

const Links = styled.ul`
  display: flex;
  flex-flow: column;
  list-style-type: none;
  li {
    padding-inline-start: 3rem;
  }
`;

interface Props {
  data: PageInfo[];
}

export function PageItems({ data }: Props) {
  const mapLink = (link: Link) => <li>{link}</li>;

  const mapPages = (page: PageInfo) => (
    <li>
      <p>
        title: <span>{page.title}</span>
      </p>
      <p>
        url: <span>{page.url}</span>
      </p>
      <p>
        depth: <span>{page.depth}</span>
      </p>
      <Links>
        <p>links:</p>
        {map(mapLink, page.links)}
      </Links>
    </li>
  );

  return <List id='transition-modal-description'>{map(mapPages, data)}</List>;
}
