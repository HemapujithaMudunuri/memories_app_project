import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { AUTH } from '../../constants/actionTypes';
import {signin, signup } from '../../actions/auth';


const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''};

 const SignUp = () =>{
      const classes = useStyles();
      const [showPassword, setShowPassword] = useState(false);
      const [isSignup, setIsSignUp] = useState(false);
      const [formData, setFormData ] = useState(initialState);
      const dispatch = useDispatch();
      const history = useHistory();
      
      const handleShowPassword = () => setShowPassword(!showPassword);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup) {
          dispatch(signup(formData, history));
        } else {
          dispatch(signin(formData, history));
        }
        console.log(formData);
      };

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const switchMode = () => {
        setFormData(initialState);
        setIsSignUp((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
      };

      const googleSuccess = async (res) => {
        // console.log(jwt_decode(res.credential));
        const result = jwt_decode(res.credential);
        try {
          dispatch({ type: 'AUTH', data: { result }});
          history.push('/');
        } catch (error) {
          console.log(error);
        }
      };

      const googleFailure = (error) => {
        console.log(error);
        console.log('Google Sign In was unsuccessful. Try Again Later');
      };
      return (
          <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={6}>
            <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
          </Button>
          <GoogleLogin
            clientId="576195967645-vec38qlore7011h8t9db7pco2ptniid2.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess} 
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
                </form>
            </Paper>

          </Container>
      );
 };
export default SignUp;