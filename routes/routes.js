
const authController = require('../controller/auth_controllers')
const lenderController = require('../controller/lender_controllers')
const borrowerController = require('../controller/borrower_controller')
const notificationController = require('../controller/notification_controller')
const casesController = require('../controller/cases_controller')
const queryController = require('../controller/query_controller')
const adminController = require('../controller/admin_controllers')

const { upload } = require('../routes/upload')

const router = require('express').Router();




//Validation Imports 
const {loginValidation ,registerValidation, forgotPassValidation ,getProfileValidation} = require('../validation/user_validation');
const { createLenderValidation, getSingleLenderValidation , getLeanders } = require('../validation/lender_validation'); 
const chat_controller = require('../controller/chat_controller')



router.get('/dash',adminController.testBoard)

//Admin--------
router.get('/admin/dashbord',adminController.dashbord)
router.get('/admin/dashbord/:lenderId',adminController.dashbord)




//Auth --------
router.post('/login' , loginValidation , authController.loginFun)
router.post('/register' , registerValidation , authController.registerFun)
router.post('/forgotPassword',forgotPassValidation,authController.forgotPassFun)
router.post('/getProfile',getProfileValidation,authController.getProfile)
router.post('/uploadfile',upload.single('file'),getProfileValidation,authController.uploadFile)
router.put('/updateProfile/:id',authController.updateProfile)
router.post('/sendOtp',authController.sendOtp)
router.patch('/changePassword',authController.changePasswordFun)
router.put('/setActiveStatus/:id',authController.setActiveStatus)
router.put('/updateDocStatus/:userId/:schemaType/:docType',authController.updateDocStatus)

//Lenders ---------
router.post('/registerLenders' , createLenderValidation , lenderController.createLender)
router.get('/getLeanders' , lenderController.getLenders)    
router.post('/getSingleLender' , getSingleLenderValidation , lenderController.getSingleLender)
router.delete('/deleteLeander/:lenderId' , getSingleLenderValidation , lenderController.deleteLeander)
router.get('/lenderCases/:lenderId',lenderController.getCases)
router.get('/lender/dashbord/:lenderId',lenderController.lenderDashbord)

//Borrower ---------
router.post('/registerBorrower' , borrowerController.createBrowwer)
router.get('/getBorrowers' , borrowerController.getBorrowers)
router.post('/getSingleBorrower' , borrowerController.getSingleBorrower)
router.delete('/deleteBorrower/:borrowerId' , borrowerController.deleteBorrower)
router.put('/updateBorrowerProfile/:id' , borrowerController.updateBorrowerProfile)
router.put('/updateBorrowerBusinessDetails/:id' , borrowerController.updateBorrowerBusinessDetails)
router.post('/updateBorrowerExtradocs/:id' , borrowerController.updateBorrowerExtraDocs)
router.put('/updateBorrowerFinancialDetails/:id/:caseId' , borrowerController.updateBorrowerFinancialDetails)
router.put('/updateBorrowerFinancialDetails/:id' , borrowerController.updateBorrowerFinancialDetails)
router.get('/borrowerCases/:borrowerId',borrowerController.getCases)
router.get('/borrowerDashbord/:borrowerId',borrowerController.borrowerDashbord)
router.put('/removeBorrowerExtradocs/:id' , borrowerController.removeBorrowerExtraDocs)


//Notification ---------
router.post('/createNotification' , notificationController.createNotification)
router.post('/getNotifications' , notificationController.getNotifications)
router.post('/clearNotification' , notificationController.clearNotification)
router.delete('/deleteNotification/:notiId' , notificationController.deleteNotification)
router.get('/readNotification/:userId' , notificationController.readNotification)

//Cases -------------
router.post('/createCases' , casesController.createCases)
router.put('/createCases/:id' , casesController.updateLender)
router.put('/updateBorrower/:id' , casesController.updateBorrower)
router.put('/caseStatus/:id',casesController.updateCase)
router.put('/caseStatus/:id/:lenderId',casesController.caseStatus)
// router.put('/updateCase/:id',casesController.updateCase)
router.get('/download-zip/:caseId' , casesController.downloadZipFile)

router.put('/lenderCaseStatus/:id',casesController.lenderCaseStatus)
router.get('/getCases',casesController.getCases)
router.get('/getSingleCase/:id',casesController.getSingleCase)
router.get('/getSingleCase/',casesController.getSingleCaseByNo)
router.post('/cases/:caseId/shortedLenders',casesController.addShortedLenders)
router.delete('/cases/:caseId/shortedLenders/:lenderId',casesController.deleteShortedLenders)

router.delete('/deleteCase/:id',casesController.deleteCase)

router.put('/updateCaseDocStatus/:caseId/:schemaType/:docType',casesController.updateDocStatus)


//Query -------------
router.post('/createQuery' , queryController.createQuery)
router.get('/getQuery',queryController.getQuery)
router.get('/getQuery/:borrowerId',queryController.getQuery)
router.get('/getSingleQuery/:queryId',queryController.getSingleQuery)
router.delete('/deleteQuery/:queryId',queryController.deleteQuery)
router.put('/queryStatus/:id',queryController.queryStatus)
router.post('/query/:queryId/document',queryController.addQueryDoc)
router.delete('/query/:queryId/document/:docId',queryController.deleteQueryDoc)
router.post('/query/:queryId/comments',queryController.addCommentInCase)

//Chat -------------
router.get('/getOldMessages/:roomId',chat_controller.getMsgs)


module.exports = router
