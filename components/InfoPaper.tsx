import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  root: {
    
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      height: theme.spacing(10),
    },
  },
}));

export default function InfoPaper() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
     
      <Paper elevation={3} style ={{background : '#f8f8f8'}}/>
          
     
    </div>
  );
}
