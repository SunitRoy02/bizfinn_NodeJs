
const authController = require('../controller/auth_controllers')
const lenderController = require('../controller/lender_controllers')
const borrowerController = require('../controller/borrower_controller')
const notificationController = require('../controller/notification_controller')



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
router.post('/updateProfileImage',upload.single('image'),getProfileValidation,authController.updateProfileImage)
router.put('/updateProfile/:id',authController.updateProfile)
router.post('/verifyOtp',authController.verifyOtpFun)
router.patch('/changePassword',authController.changePasswordFun)
router.put('/setActiveStatus/:id',authController.setActiveStatus)

//Lenders ---------
router.post('/registerLenders' , createLenderValidation , lenderController.createLender)
router.get('/getLeanders' , lenderController.getLenders)
router.post('/getSingleLender' , getSingleLenderValidation , lenderController.getSingleLender)
router.delete('/deleteLeander/:lenderId' , getSingleLenderValidation , lenderController.deleteLeander)

//Borrower ---------
router.post('/registerBorrower' , borrowerController.createBrowwer)
router.get('/getBorrowers' , borrowerController.getBorrowers)
router.post('/getSingleBorrower' , borrowerController.getSingleBorrower)
router.delete('/deleteBorrower/:borrowerId' , borrowerController.deleteBorrower)
router.post('/updateBorrowerBusinessDetails' , borrowerController.updateBorrowerBusinessDetails)
router.post('/updateBorrowerKycDetails' , borrowerController.updateBorrowerKycDetails)
router.post('/updateBorrowerFinancialDetails' , borrowerController.updateBorrowerFinancialDetails)

//Notification ---------
router.post('/createNotification' , notificationController.createNotification)
router.post('/getNotifications' , notificationController.getNotifications)
router.post('/clearNotification' , notificationController.clearNotification)
router.delete('/deleteNotification/:notiId' , notificationController.deleteNotification)
router.get('/readNotification/:userId' , notificationController.readNotification)




module.exports = router
