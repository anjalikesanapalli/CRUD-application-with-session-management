
const Information = require('../models/info');

exports.getDashboard = async (req, res) => {
  try {
    
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    // Retrieve user information from the database
    const infoList = await Information.find({ user: userId });

    // Render the dashboard with user information
    res.render('dashboard', { user: req.session.user, infoList });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.showAddUserForm = (req, res) => {
  // Check if the user is logged in (session exists)
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('add-user');
};


exports.saveUserInfo = async (req, res) => {
  // Check if the user is logged in (session exists)
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { name, email, phoneNumber, notes } = req.body;
  const userId = req.session.user.id;

  try {
    // Create new user information in the database
    await Information.create({
      user:userId,
      name,
      email,
      phoneNumber,
      notes,
    });

    // Redirect to the dashboard after successful information creation
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.showUpdateForm = async (req, res) => {
  // Check if the user is logged in (session exists)
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    // Retrieve existing user information from the database
    
    const info = await Information.findById(req.params.infoId);

    // Check if the information belongs to the logged-in user
    if (!info || info.user.toString() !== req.session.user.id) {
      return res.status(404).send('Not Found');
    }

    // Render the update form with the existing information
    res.render('update-info', { info,  });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.updateUserInfo = async (req, res) => {
   
  
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { name, email, phoneNumber, notes } = req.body;
  
  console.log("req.body",req.body)

  try {
    
    console.log('-->',req.params.infoId);
    
    const info = await Information.findById(req.params.infoId);
    console.log("Info found",info);
    if (!info || info.user.toString() !== req.session.user.id) {
        return res.status(404).send('Not Found');
    }
    console.log(info.user.toString())

    await Information.findByIdAndUpdate(
       req.params.infoId,
        { name:req.body.name, email:req.body.email, phoneNumber:req.body.phoneNumber, notes:req.body.notes }
      );
      console.log(info);
   
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};





exports.deleteUserInfo = async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {

    const info = await Information.findById(req.params.infoId);
    console.log('- >',info);


    if (!info) {

      return res.status(404).send('Information not found');
    }
console.log(req.session.user.id)
console.log(info._id.toString())
    if (info.user.toString() !== req.session.user.id) {
      return res.status(403).send('Unauthorized');
    }


    await Information.findByIdAndDelete(req.params.infoId);

   
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

