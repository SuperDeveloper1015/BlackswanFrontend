import React,{useState} from 'react'
import { Backdrop, Fade, makeStyles, Modal as MuiModal } from '@material-ui/core'
import styled from 'styled-components'
import { Button } from "./styled/button";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '35vw',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

interface OwnProps {

  message: JSX.Element

  buttonStyle:string,
  buttonText:string
}

export const Modal: React.FC<OwnProps> = ({


  message,
  buttonStyle,
  buttonText
}) => {
  const classes = useStyles()
  const [open,setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
<Button className = {buttonStyle} onClick={handleOpen}>
      {buttonText}
    </Button>
    <MuiModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
      timeout: 500,
      }}>
        <Fade in={open}>
          <div className={classes.paper}>
            {message}
          </div>
        </Fade>
    </MuiModal>
    </div>
    
  )
}