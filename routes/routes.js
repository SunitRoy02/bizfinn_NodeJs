
const authController = require('../controller/auth_controllers')
const homeController = require('../controller/home_controller')
const productController = require('../controller/products_controller')
const queryController = require('../controller/query_controller')
const router = require('express').Router();

//Validation Imports 
const {loginValidation ,registerValidation, forgotPassValidation ,getProfileValidation} = require('../validation/user_validation');
const { addBannerValidation } = require('../validation/banner_validation'); 
const { productValidation } = require('../validation/product_validation'); 
const { queryValidation } = require('../validation/queryValidation'); 
const { categoriesValidation, subCategoriesValidation } = require('../validation/categories_validation'); 






//Auth --------
router.post('/login' , loginValidation , authController.loginFun)
router.post('/register' , registerValidation , authController.registerFun)
router.post('/forgotPassword',forgotPassValidation,authController.forgotPassFun)
router.post('/getProfile',getProfileValidation,authController.getProfile)
router.post('/updateProfile',getProfileValidation,authController.updateProfile)
// router.post('/verifyOtp',authController.verifyOtpFun)
// router.patch('/changePassword',authController.changePasswordFun)

//Banner Screen --------
router.post('/addBanner',addBannerValidation,homeController.addBanner)
router.delete('/deleteBanner/:id',homeController.deleteBanner)
router.get('/banners',homeController.bannersFun)
router.patch('/updateBanner',homeController.updateBanner)

//Product Categories 
router.post('/addCategories',categoriesValidation,productController.addCategories)
router.delete('/deleteCategory/:id',productController.deleteCategory)
router.get('/getCategories',productController.getCategories)
// router.patch('/updateBanner',homeController.updateBanner)

router.post('/addSubCategories',subCategoriesValidation,productController.addSubCategories)
router.get('/getSubCategories',productController.getSubCategories)
router.delete('/deleteSubcategories/:id',productController.deleteSubcategories)



//Product 
router.post('/addProduct',productValidation,productController.addProduct)
router.get('/getProducts',productController.getProducts)
router.get('/productDetailes',productController.getSingleProduct)
router.get('/productsByCategory',productController.productsByCategory)
router.delete('/deleteProduct/:id',productController.deleteProduct)

//Contact Query
router.post('/addQuery',queryValidation,queryController.addQuery)
router.get('/getAllQuery',queryController.getAllQuery)
router.delete('/deleteQuery/:id',queryController.deleteQuery)

 


module.exports = router
