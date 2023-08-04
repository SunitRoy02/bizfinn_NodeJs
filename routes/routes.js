
const authController = require('../controller/auth_controllers')
const lenderController = require('../controller/lender_controllers')
// const homeController = require('../controller/home_controller')
// const productController = require('../controller/products_controller')
// const queryController = require('../controller/query_controller')
const router = require('express').Router();
const multer = require('multer');
const path = require('path');



//multer
const _destinaitonUser = 'upload/user' 
const diskStorage = multer.diskStorage({
    destination : _destinaitonUser,
    filename : (req,file,cb) => {
        return cb(null,`${file.name}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: diskStorage,
    limits: {fileSize : 10000000}
})






//Validation Imports 
const {loginValidation ,registerValidation, forgotPassValidation ,getProfileValidation} = require('../validation/user_validation');
const { createLenderValidation, getSingleLenderValidation , getLeanders } = require('../validation/lender_validation'); 






//Auth --------
router.post('/login' , loginValidation , authController.loginFun)
router.post('/register' , registerValidation , authController.registerFun)
router.post('/forgotPassword',forgotPassValidation,authController.forgotPassFun)
router.post('/getProfile',getProfileValidation,authController.getProfile)
router.post('/updateProfile',upload.single('image'),getProfileValidation,authController.updateProfile)
router.post('/verifyOtp',authController.verifyOtpFun)
router.patch('/changePassword',authController.changePasswordFun)

//Lenders ---------
router.post('/registerLenders' , createLenderValidation , lenderController.createLender)
router.get('/getLeanders' , lenderController.getLenders)
router.post('/getSingleLender' , getSingleLenderValidation , lenderController.getSingleLender)
router.delete('/deleteLeander/:lenderId' , getSingleLenderValidation , lenderController.deleteLeander)




module.exports = router
