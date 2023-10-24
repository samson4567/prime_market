const router = require('express').Router();
const userController = require('../controllers/authController');

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});


// Define user routes
router.post('/signup', userController.signupUser);
router.post('/sign-in', userController.signInUser);
router.post('/logout', userController.logoutUser);



module.exports = router;
