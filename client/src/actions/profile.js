import axios from 'axios';

import {setAlert} from './alert';

import {GET_PROFILE,PROFILE_ERROR,UPDATE_PROFILE,ACCOUNT_DELETED,CLEAR_PROFILE,GET_PROFILES,GET_REPOS,NO_REPOS} from './types';

export const getCurrentProfile = () => async dispatch =>{
    try{
        const res = await axios.get("/api/profile/me");
        console.log("The data from the back end");
        console.log(res.data);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    }catch(err){
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}
// Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
  
    try {
      const res = await axios.get('/api/profile');
  
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Get profile by ID
  export const getProfileById = userId => async dispatch => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);
  
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Get Github repos
  export const getGithubRepos = username => async dispatch => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);
  
      dispatch({
        type: GET_REPOS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: NO_REPOS
      });
    }
  };
//create or update profile

export const createProfile = (formData,history,edit=false) => async dispatch => {
    try{
        const config={
            headers:{
                'Content-Type':"application/json"
            }
        }
        console.log("The form data");
        console.log(formData);
        const res= await axios.post('/api/profile',formData,config);
        console.log("The data from the back end");
        console.log(res);
        console.log(res.data);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Profile Created','success'));

            history.push('/dashboard');

    }catch(err){
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

//EDIT PROFILE
export const editProfile = (formData,history) => async dispatch => {
    try{
        const config={
            headers:{
                'Content-Type':"application/json"
            }
        }
        console.log("The form data");
        console.log(formData);
        const res= await axios.post('/api/profile',formData,config);
        console.log("The data from the back end");
        console.log(res);
        console.log(res.data);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Profile Updated' ,'success'));

    }catch(err){
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}
//ADD EXPERIENCE

export const addExperience = (formData,history) => async dispatch =>{
    try{
        const config={
            headers:{
                'Content-Type':"application/json"
            }
        }
        console.log("form data is here");
        console.log(formData);
        const res= await axios.put('/api/profile/experience',formData,config);
        console.log("back end data is here");
        console.log(res.data);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Experience added','success'));

        history.push("/dashboard");

    }catch(err){
        console.log(err)
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

//ADD EDUCATION

export const addEducation = (formData,history) => async dispatch =>{
    try{
        const config={
            headers:{
                'Content-Type':"application/json"
            }
        }
        const res= await axios.put('/api/profile/education',formData,config);

        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Education added','success'));

        history.push("/dashboard");

    }catch(err){
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

//DELETE EXPERIENCE
export const deleteExperience = id => async dispatch => {
    try{
        const res=await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert("Experience removed","success"))
    }catch(err){
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
    }
//DELETE EDUCATION
    export const deleteEducation = id => async dispatch => {
        try{
            const res=await axios.delete(`/api/profile/education/${id}`);
            dispatch({
                type:UPDATE_PROFILE,
                payload:res.data
            })
            dispatch(setAlert("Education removed","success"))
        }catch(err){
            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText,status:err.response.status}
            });
        }
        }
//DELETE ACCOUNT
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await axios.delete('/api/profile');
  
        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETED });
  
        dispatch(setAlert('Your account has been permanently deleted'));
      } catch (err) {
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
      }
    }
  };