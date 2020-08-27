const express = require("express");
const Profile = require("../../models/Profile");
const User= require("../../models/User");
const router=express.Router();
const auth= require("../../middleware/auth");
const normalize = require('normalize-url');

const {check,validationResult}=require('express-validator/check');



// get current user profile
router.get("/me",auth,async (req,res) =>{
    try{
        const profile= await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:"There is no profile for this user"});
        }

        res.json(profile)
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }

});

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty(),
      check('facebook',"Facebook link is required").not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    const profileFields = {
      user: req.user.id,
      company,
      location,
      website,
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map(skill => ' ' + skill.trim()),
      status,
      githubusername
    };

    // Build social object and add to profileFields
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
      if (value && value.length > 0)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      console.log(profile);
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//get all user profile
router.get("/",async (req,res) => {
    try{
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);

    }catch(err){
        console.error(err);
        res.status(500).send("Server error")
    }
})

router.get("/user/:user_id",async (req,res) => {
    try{
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        res.json(profile);

        if(!profile){
            return res.status(400).json({msg:"There is no profile for the user"});
        }

    }catch(err){
        console.error(err);
        res.status(500).send("Server error")
    }
})

router.delete("/",auth,async (req,res) => {
    try{
       await Profile.findOneAndRemove({user:req.user.id});

       await User.findOneAndRemove({_id:req.user.id});

       res.status(200).json({msg:"User deleted"});

    }catch(err){
        console.error(err);
        res.status(500).send("Server error");
    }
})

router.put("/experience",[auth,[
    check('title','title is required').not().isEmpty(),
    check("company","company is required").not().isEmpty(),
    check("from","from date is required").not().isEmpty()
]
],async(req,res) => {

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
}=req.body;

const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
}

try{

    const profile = await Profile.findOne({user:req.user.id});

    profile.experience.unshift(newExp);
    await profile.save();

    res.json(profile);

}catch(err){
    console.error(err.message);
    res.satus(500).json("Server error");
}
})

router.delete("/experience/:exp_id",auth,async(req,res) => {
    try{
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.put(
    '/education',
    [
      auth,
      [
        check('school', 'School is required')
          .not()
          .isEmpty(),
        check('degree', 'Degree is required')
          .not()
          .isEmpty(),
        check('fieldofstudy', 'Field of study is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

router.delete("/education/:edu_id",auth,async(req,res) => {
    try{
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubToken')}`
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });

module.exports=router;
