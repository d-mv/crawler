import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ModalUI from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useSelector } from 'react-redux';

import { getResults } from 'src/store/app/app.reducer';

import { PageItems } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

export function Modal() {
  const results = useSelector(getResults);

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(!!results);
  }, [results]);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <ModalUI
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id='transition-modal-title'>Results:</h2>
            <p
              id='transition-modal-description'
              style={{ fontWeight: 'bold' }}
            >{`Elapsed time: ${results?.elapsedTime}s, quantity of pages: ${results?.qty}.`}</p>
            <PageItems data={results?.data || []} />
          </div>
        </Fade>
      </ModalUI>
    </div>
  );
}
