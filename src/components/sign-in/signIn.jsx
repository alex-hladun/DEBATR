import React, { useState } from 'react';
import axios from 'axios';

//all the material-ui components
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useStore} from '../../Store'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function SignIn(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, dispatch] = useStore();
 
  const submitLogin = (event) => {
    event.preventDefault();
    // console.log(email, 'email')
    // console.log(password, "password")
    // console.log('submitlogin called')
    axios.post('/api/login',  {
      email,
      password
    })
      .then((res) => {
        if (res.data.authenticated) {
          dispatch({ type: 'SET_USERNAME', payload: res.data.username })
          dispatch({ type: 'SET_USER_ID', payload: res.data.userID })
          props.handleCloseSignIn();

        }
        // if (!res.data.authenticated) {
        //   console.log('is this e3')
        //   props.handleCloseSignIn();
        //   alert('something went wrong')
          
        // }
        // console.log('other stuff')
        return true
        // dispatch({ type: 'SET_USERNAME', payload: res })

      })
      .catch((error) => {
        console.error(error, "error from axios request")
      })
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={submitLogin} noValidate>
          <TextField
            // onChange={event => setEmail(event.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={event => setEmail(event.target.value)}
          />
          <TextField

            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={event => setPassword(event.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>

          </Grid>
        </form>
      </div>
      <Box mt={8}>
      </Box>
    </Container>
  );
}


//Remember me logic
{/* <FormControlLabel
control={<Checkbox value="remember" color="primary" />}
label="Remember me" */}
{/* /> */ }