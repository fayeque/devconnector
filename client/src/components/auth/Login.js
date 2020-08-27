import React,{Fragment,useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth.js';

const Login =(props) => {
 const  [formData,setformData] = useState({
    email:"",
    password:""
  });

  const {email,password} = formData;

  const onChange=e => setformData({...formData,[e.target.name]:e.target.value});

  const onSubmit = (e) => {
    e.preventDefault();
    props.login(email,password);
  }

if(props.isAuthenticated){
  return <Redirect to="/dashboard"></Redirect>
}

  return (
    <Fragment>
    <section class="container">
    <h1 class="large text-primary">Sign In</h1>
    <p class="lead"><i class="fas fa-user"></i> Sign in to your Your Account</p>
    </section>
    <section>
    <form class="form" onSubmit={e => onSubmit(e)}>
      <div class="form-group">
        <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e) => onChange(e)}/>
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password} 
          onChange={(e) => onChange(e)}
          minLength="6"
        />
      </div>
      <input type="submit" class="btn btn-primary" value="Login" />
    </form>
    <p class="my-1">
     Not have an account? <Link to="/register">Signup</Link>
    </p>
    </section>
    </Fragment>
)
  }
  Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

const mapStateToProps = state => ({
  isAuthenticated:state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login);