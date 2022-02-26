import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles =  makeStyles((theme: Theme) =>
createStyles({
  root: {
    flexGrow: 1,
   
    
    
    borderRadius:'20px',
   
},
indicator: {
    backgroundColor: 'transparent',
   
  },
  
}));

interface TabPanelProps {
    children?: React.ReactNode;
    handleIndexChange : any;
    value :any;
  }
export default function NavigationTab(props: TabPanelProps) {
  const classes = useStyles();
  
  const { children, handleIndexChange, value, ...other } = props;
 const default_tab = {
     backgroundColor :'#000000',
     color:'white',
     opacity :1.0,
    
 };
 const active_tab = {
    backgroundColor:'white',
    color :'#000000',
    opacity:1.0,
    border:"3px solid #2c2c2c",
    borderRadius:'20px',
    boxSizing:'border-box'
    
};
  
  const getStyle = isActive => {
    return isActive ? active_tab : default_tab
}
  return (
    <Paper className={classes.root}>
      <Tabs
       
        onChange={handleIndexChange}
        variant="fullWidth"
        style={{borderRadius:'20px',backgroundColor:'black',color:'white'}}
        
       
       
      >
        <Tab label="DEPOSIT" style={ getStyle(value === 0) } fullWidth/>
        <Tab label="WITHDRAW" style={ getStyle(value === 1) } fullWidth/>
        <Tab label="STATS" style={ getStyle(value === 2) } fullWidth/>
        
      </Tabs>
    </Paper>
    
  );
}