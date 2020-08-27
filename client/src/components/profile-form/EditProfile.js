import React,{useState,useEffect,Fragment} from 'react';
import {Link,withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {editProfile,getCurrentProfile} from '../../actions/profile';

const EditProfile = (props) => {
    const [formData,setFormdata] = useState({
        company: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        githubusername:"",
        bio: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: ''
    });


        const [displaySocialInput,toggleSocialInput] = useState(false);

        useEffect(() => {
            props.getCurrentProfile();
                setFormdata({
                  company:props.profile.loading || !props.profile.profile.company ? "" : props.profile.profile.company,
                  website:props.profile.loading || !props.profile.profile.website ? "" : props.profile.profile.website,
                  location:props.profile.loading || !props.profile.profile.location ? "" : props.profile.profile.location,
                  status:props.profile.loading || !props.profile.profile.status ? "" : props.profile.profile.status,
                  skills:props.profile.loading || !props.profile.profile.skills ? "" : props.profile.profile.skills,
                  bio:props.profile.loading || !props.profile.profile.bio ? "" : props.profile.profile.bio,
                  githubusername:props.profile.loading || !props.profile.profile.githubusername ? "" : props.profile.profile.githubusername,
                 
                  twitter:props.profile.loading || !props.profile.profile.social.twitter ? "" : props.profile.profile.social.twitter,
                  facebook:props.profile.loading || !props.profile.profile.social.facebook ? "" : props.profile.profile.social.facebook,
                  linkedin:props.profile.loading || !props.profile.profile.social.linkedin ? "" : props.profile.profile.social.linkedin,
                  youtube:props.profile.loading || !props.profile.profile.social.youtube ? "" : props.profile.profile.social.youtube,
                  instagram:props.profile.loading || !props.profile.profile.social.instagram ? "" : props.profile.profile.social.instagram
              })
        },[props.profile.loading])
        const {
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            twitter,
            facebook,
            linkedin,
            youtube,
            instagram
        } = formData;

        const onChange=(e) => setFormdata({...formData,[e.target.name]:e.target.value});

        const onSubmit = e => {
            e.preventDefault();
            props.editProfile(formData,props.history);
        }

    return (
        <Fragment>
              <h1 className="large text-primary">
        Edit Your Profile
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <select name="status" value={status} onChange={e => onChange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text"
            >Give us an idea of where you are at in your career</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Company" name="company" value={formData.company} onChange={e => onChange(e)}/>
          <small className="form-text"
            >Could be your own company or one you work for</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Website" name="website" value={website} onChange={e => onChange(e)}/>
          <small className="form-text"
            >Could be your own or a company website</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={e => onChange(e)}/>
          <small className="form-text"
            >City & state suggested (eg. Boston, MA)</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={e => onChange(e)}/>
          <small className="form-text"
            >Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)</small>
        </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={e => onChange(e)}></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={e => onChange(e)}/>
            </div>

        <div className="my-2">
          <button onClick={() => toggleSocialInput(!displaySocialInput)}  type="button" className="btn btn-light">
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>
        {displaySocialInput && <Fragment>
            <div className="form-group social-input">
          <i className="fab fa-twitter fa-2x"></i>
          <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={e => onChange(e)}/>
        </div>

        <div className="form-group social-input">
          <i className="fab fa-facebook fa-2x"></i>
          <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={e => onChange(e)}/>
        </div>

        <div className="form-group social-input">
          <i className="fab fa-youtube fa-2x"></i>
          <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={e => onChange(e)} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-linkedin fa-2x"></i>
          <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={e => onChange(e)} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-instagram fa-2x"></i>
          <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={e => onChange(e)} />
        </div>

        </Fragment>}
        <input type="submit" className="btn btn-primary my-1" />
        <Link to="/dashboard" className="btn btn-light my-1">Go Back</Link>
      </form>

        </Fragment>
    )
}

const mapStateToProps = state => ({
    profile:state.profile
})


export default connect(mapStateToProps,{editProfile,getCurrentProfile})(withRouter(EditProfile));