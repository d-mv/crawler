import React from 'react';
import { assoc } from 'ramda';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl, FormControlLabel, Input, InputLabel, Switch, Typography } from '@material-ui/core';
import styled from 'styled-components/macro';
import { useDispatch } from 'react-redux';

import { isValidUrl, makeErrorsString, thereAreErrors } from 'src/toolbelt';

import { FormErrors, Query, QueryActions, QueryDomain } from 'src/models';
import { startCrawling } from 'src/store/app/app.actions';

import { Messages } from 'src/components';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    color: 'rgba(0, 0, 0, 0.3)',
  },
}));

const Wrapper = styled.main`
  position: relative;
`;

const Page = styled.div`
  background-color: #fff;
  position: relative;
  z-index: 2;
  padding: 2rem;
  border-radius: 0.3rem;
  border: 0.1rem solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.7rem rgba(0, 0, 0, 0.15);
  h5 {
    font-weight: 700;
    text-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.3);
    margin-block-end: 1rem;
  }
  label {
    font-size: 1.3rem;
  }

  .MuiFormControlLabel-label {
    font-size: 1.2rem !important;
    color: #415364;
  }

  .MuiFormLabel-asterisk {
    color: #f21d84;
  }

  input {
    font-size: 1.6rem;
    &:nth-of-type(1) {
      min-width: 20rem;
    }
  }
`;

const Group = styled.div`
  display: flex;
  flex-flow: row;
  margin: 2rem 0;
`;

const Spacer = styled.div`
  width: 2rem;
  height: 0.1rem;
`;

const Spaced = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    color: #f21d84;
    font-size: 1.2rem;
    max-width: calc(100% - 6.5rem);
    width: 100%;
  }
`;

export function Form() {
  const dispatch = useDispatch();

  const [errors, setErrors] = React.useState<Partial<FormErrors>>({});

  const [submitIsDisabled, setSubmitIsDisabled] = React.useState(true);

  const [query, setQuery] = React.useState<Partial<Query>>({
    domain: QueryDomain.CRAWL,
    action: QueryActions.START,
  });

  const classes = useStyles();

  const toggleIgnoreSelf = () =>
    setQuery(assoc('options', assoc('ignoreSelf', !query.options?.ignoreSelf, query.options), query));

  const handleStart = () => dispatch(startCrawling(query as Query));

  React.useEffect(() => {
    if (query.startUrl && query.startUrl.length > 2) {
      if (isValidUrl(query.startUrl) && !thereAreErrors(errors) && submitIsDisabled) setSubmitIsDisabled(false);
      else if ((!isValidUrl(query.startUrl) || thereAreErrors(errors)) && !submitIsDisabled) {
        setSubmitIsDisabled(true);
        setErrors(assoc('startUrl', 'URL is incorrect', errors));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors) setErrors({});

    if (e.target.id === 'ignoreSelf') toggleIgnoreSelf();
    else if (e.target.id === 'maxDepth' || e.target.id === 'maxTotalPages') {
      if (parseInt(e.target.value) < 0)
        setErrors(assoc(e.target.id, `${e.target.id} can't be negative. Leave empty for default.'}`, errors));

      setQuery(assoc('options', assoc(e.target.id, e.target.value, query.options), query));
    } else setQuery(assoc('startUrl', e.target.value, query));
  };

  return (
    <Wrapper>
      <Page>
        <Spaced>
          <Typography variant='h5'>Crawler</Typography>
          <Typography variant='body1'>{makeErrorsString(errors)}</Typography>
        </Spaced>
        <form className={classes.root} noValidate>
          <FormControl>
            <InputLabel required htmlFor='startURl'>
              URL, starting with http/https
            </InputLabel>
            <Input autoFocus id='startURl' onChange={handleChange} />
          </FormControl>
          <Group>
            <FormControl>
              <InputLabel htmlFor='maxDepth'>Maximum Scan Depth</InputLabel>
              <Input id='maxDepth' type='number' onChange={handleChange} />
            </FormControl>
            <Spacer />
            <FormControl>
              <InputLabel htmlFor='maxTotalPages'>Max Total Pages</InputLabel>
              <Input id='maxTotalPages' type='number' onChange={handleChange} />
            </FormControl>
            <Spacer />
            <FormControlLabel
              style={{ paddingBlockStart: '1rem' }}
              control={<Switch onChange={handleChange} id='ignoreSelf' name='ignoreSelf' color='primary' />}
              label='Ignore "self"?'
            />
          </Group>
          <Button
            disabled={submitIsDisabled}
            onClick={handleStart}
            variant='contained'
            color='primary'
            style={{ fontSize: '1.4rem' }}
          >
            Start
          </Button>
        </form>
      </Page>
      <Messages />
    </Wrapper>
  );
}
