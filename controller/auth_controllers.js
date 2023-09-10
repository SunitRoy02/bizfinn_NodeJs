const { validationResult } = require('express-validator');
const users = require('../models/users');
const axios = require('axios');



module.exports = {
    loginFun: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await users.find({ email: req.body.email, password: req.body.password, userType: req.body.userType })

            if (find.length === 0) {
                const msfIferror = "User Not Found";
                res.status(400).send({ success: false, msg: msfIferror, });
            } else {
                const msfIfSuccess = "Login Successfully";
                let thisUser = find[0];
                if (req.body.userType == '2' || req.body.userType == '3') {
                    console.log('TYPE >> ', req.body.userType, typeof req.body.userType)
                    const findAdmin = await users.findOne({ userType: 1 });
                    thisUser.admin = findAdmin._id
                    console.log(' findAdmin._id >> ', findAdmin._id);
                    console.log(thisUser);
                }
                res.status(200).send({ success: true, msg: msfIfSuccess, data: thisUser });
            }

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }
    },

    registerFun: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const email = await users.findOne({ email: req.body.email })
            const phone = await users.findOne({ mobile: req.body.mobile })
            // console.log("Find IN Register >>> ", find);
            if (!email && !phone) {

                let reqData = req.body;
                let data = new users(reqData);
                let result = await data.save();
                // console.log(result);

                const msfIfSuccess = "Register Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

            } else {

                const msfIferror = email ? "User Email Already Exixts" : phone ? "User Mobile Number Already Exixts" : "";
                res.status(400).send({ success: false, msg: msfIferror });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },

    forgotPassFun: async (req, res) => {

        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await users.find({ email: req.body.email })
            // console.log("Find IN forgotPassFun >>> ", find);
            if (find.length === 0) {

                const msfIferror = "User not found";
                res.status(400).send({ success: false, msg: msfIferror });

            } else {
                //send otp work here 
                const message = "Otp send successfully";
                res.status(200).send({ success: true, msg: message });

            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },

    setActiveStatus: async (req, res) => {
        const permissionId = req.params.id;
        const newActiveValue = req.body.active; // The new value for the "active" field

        try {
            const updatedPermission = await users.findByIdAndUpdate(
                permissionId,
                { active: newActiveValue },
                { new: true } // Return the updated document
            );

            if (!updatedPermission) {

                return res.status(404).json({ msg: 'Permission not found' });
            }

            return res.status(200).json({ status: true, msg: 'Status Updated Successfully !!', result: updatedPermission });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },

    getProfile: async (req, res) => {

        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await users.find({ _id: req.body.userId })
            // console.log("Find IN GetProfile >>> ", find);
            if (find.length === 0) {

                const msfIferror = "User not found";
                res.status(400).send({ success: false, msg: msfIferror });

            } else {
                //send otp work here 
                const message = "User Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });

            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }
    },

    uploadFile: async (req, res) => {

        try {

            // const find = await users.find({ _id: req.body.userId })
            // if (find.length === 0) {
            //     const msfIferror = "User not found";
            //     res.status(400).send({ success: false, msg: msfIferror });

            // } else {

            // }


            res.json({ message: 'File uploaded successfully', success: true, fileUrl: req.file.location });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }

    },
    updateProfile: async (req, res) => {

        try {

            const itemId = req.params.id;
            const updateFields = {};



            // Iterate through request body and populate updateFields object
            for (const key in req.body) {
                if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                    updateFields[key] = req.body[key];
                }
            }
            console.log('ID >> ', itemId);
            console.log('updateFields >> ', updateFields);

            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                itemId,
                { $set: updateFields },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            return res.status(200).json({ status: true, message: 'Profile Updated Successfully', result: updatedItem });
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ status: false, msg: error.message });

        }

    },

    changePasswordFun: async (req, res) => {

        try {
            let user = await users.findOne({ _id: req.body.id });

            console.log('User >> ', user)

            if (user == null) {
                return res.status(400).send({ success: false, msg: "User not found !!", });
            }
            // if (user.password != req.body.old_password) {
            //     return res.status(400).send({ success: false, msg: "Password did not match !!", });
            // }

            user.password = req.body.new_password;
            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                req.body.id,
                { $set: user },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'Query not found' });
            }

            res.status(200).send({ success: true, msg: "Password Changed Successfully !!", result: updatedItem });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ status: false, msg: error.message });

        }



    },


    // sendOtp: async (req, res) => {

    //     // console.log(req.body);
    //     if(req.body.phone == undefined || req.body.phone == null || req.body.phone == ''){
    //       return  res.status(400).send({ status: false, msg: 'Please enter valid phone number', data : req.body});
    //     }
    //     const msgFormate = ' is the OTP for signing up into your BizFinn account. Keep the OTP safe. We will never call you to ask for your OTP.-BizFinn (RKSP)';
    //     try {

    //         let userId = '';
    //       const thisUser = await users.findOne({ mobile: req.body.phone , userType : req.body.userType});
    //           if (thisUser) {
    //             console.log('Found User:', thisUser);
    //             userId = thisUser._id;
    //             // Do something with the found user
    //           } else {
    //             console.log('User not found.');
    //             return  res.status(400).send({ status: false, msg: 'User not found with this phone number'});
    //             // Handle the case where the user is not found
    //           } 
    //         const apiUrl = `https://api.vialogue.in/pushapi/sendbulkmsg?username=${process.env.USERNAME_OTP}&dest=${req.body.phone}&apikey=${process.env.APIKEY_OTP}&signature=${process.env.SIGNATURE_OTP}&msgtype=PM&msgtxt=${req.body.otp}${msgFormate}&entityid=${process.env.ENTITYIT_IT_OTP}&templateid=${process.env.TMPLATE_ID}`;

    //         // console.log(apiUrl);
    //         if(thisUser){
    //             axios.get(apiUrl)
    //             .then(function (response) {
    //                 // Handle successful response here
    //                 console.log('Response Data:', response.data);
    //                return res.status(200).send({ status: true, msg: 'Otp sent successfully',user : userId});
    //             })
    //             .catch(function (error) {
    //                 // Handle error here
    //                 console.error('Error:', error);
    //                return res.status(400).send({ status: false, msg: 'Something went wrong' });
    //             });
    //         }
    //     } catch (error) {
    //         console.log("Error : ", error);
    //        return res.status(400).send({ status: false, msg: error.message });

    //     }

    // }


    sendOtp: async (req, res) => {
        try {
            const { phone, type, userType } = req.body;

            console.log(req.body);
            if (!phone) {
                return res.status(400).json({ status: false, msg: 'Please enter a valid phone number' });
            }



            let userIdForChagePassword = '';
            if (type !== 'register') {
                const thisUser = await users.findOne({ mobile: phone, userType: userType });
                if (!thisUser) {
                    return res.status(400).json({ status: false, msg: 'User not found with this phone number' });
                }
                thisUser._id

            }

            const msgFormat = `${req.body.otp} is the OTP for signing up into your BizFinn account. Keep the OTP safe. We will never call you to ask for your OTP. - BizFinn (RKSP)`;

            const apiUrl = `https://api.vialogue.in/pushapi/sendbulkmsg?username=${process.env.USERNAME_OTP}&dest=${phone}&apikey=${process.env.APIKEY_OTP}&signature=${process.env.SIGNATURE_OTP}&msgtype=PM&msgtxt=${msgFormat}&entityid=${process.env.ENTITYIT_IT_OTP}&templateid=${process.env.TMPLATE_ID}`;

            const response = await axios.get(apiUrl);

            // console.log('Response Data:', response.data);

            return res.status(200).json({ status: true, msg: 'OTP sent successfully', user: userIdForChagePassword });
        } catch (error) {
            // console.error('Error:', error);

            return res.status(400).json({ status: false, msg: 'Something went wrong' });
        }
    },

    updateDocStatus: async (req, res) => {
        const { userId, schemaType, docType } = req.params;
        const { status } = req.body;

        // Ensure that status is either 0 or 1
        if (status !== 0 && status !== 1) {
            return res.status(400).json({ message: 'Status must be 0 or 1' });
        }

        try {
            // Find the user document by userId
            const user = await users.findOne({ _id: userId });
        
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            // Determine the schema based on schemaType and update the status accordingly
            let schemaToUpdate;
        
            if (schemaType === 'kycSchema') {
              schemaToUpdate = user.kyc_details;
            } else if (schemaType === 'financialSchema') {
              schemaToUpdate = user.financial_details;
            } else {
              return res.status(400).json({ message: 'Invalid schema type' });
            }
        
            if (schemaToUpdate && schemaToUpdate[docType] && schemaToUpdate[docType].status !== undefined) {
              schemaToUpdate[docType].status = status;
              await user.save();
              return res.status(200).json(user);
            } else {
              return res.status(404).json({ message: 'Document type not found' });
            }
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
          }
    },

}


