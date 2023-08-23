const { validationResult } = require('express-validator');
const users = require('../models/users');



module.exports = {
    loginFun: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await users.find({ email: req.body.email, password: req.body.password , userType : req.body.userType})

            if (find.length === 0) {
                const msfIferror = "User Not Found";
                res.status(400).send({ success: false, msg: msfIferror, });
            } else {
                const msfIfSuccess = "Login Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: find[0] });
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

            const find = await users.find({ email: req.body.email })
            // console.log("Find IN Register >>> ", find);
            if (find.length === 0) {

                let reqData = req.body;
                reqData.createdAt = new Date().toLocaleString();
                let data = new users(reqData);
                let result = await data.save();
                // console.log(result);

                const msfIfSuccess = "Register Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

            } else {
                const msfIferror = "User Already Exixts";
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

            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            // return res.status(400).send({ success: false, errors: errors.array()[0] });
            // }

            // res.status(200).send(req.body);

            const find = await users.find({ _id: req.body.userId })
            if (find.length === 0) {
                const msfIferror = "User not found";
                res.status(400).send({ success: false, msg: msfIferror });

            } else {
                let file = req.file
                users.findByIdAndUpdate(req.body.userId, req.body, { new: true }, (err, updatedDoc) => {
                    if (err) {
                        // console.error(err);  
                        const message = "Unexpected Error Found";
                        res.status(200).send({ success: false, msg: err });

                    } else {
                        // console.log(updatedDoc);
                        const message = "User Updated successfully";
                        res.status(200).send({ success: true, msg: message, data : req.file });
                    }
                });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },

    updateProfileImage: async (req, res) => {

        try {

            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            // return res.status(400).send({ success: false, errors: errors.array()[0] });
            // }

            res.status(200).send(req.body);

            // const find = await users.find({ _id: req.body.userId })
            // if (find.length === 0) {
            //     const msfIferror = "User not found";
            //     res.status(400).send({ success: false, msg: msfIferror });

            // } else {

            //     let reqData = req.body;
            //     // let img = req.file;
            //     reqData.updatedAt = new Date().toLocaleString();
            //     users.findByIdAndUpdate(req.body.userId, req.body, { new: true }, (err, updatedDoc) => {
            //         if (err) {
            //             // console.error(err);  
            //             const message = "Unexpected Error Found";
            //             res.status(200).send({ success: true, msg: err });

            //         } else {
            //             // console.log(updatedDoc);
            //             const message = "User Updated successfully";
            //             res.status(200).send({ success: true, msg: message, data : updatedDoc });
            //         }
            //     });




            // }
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

    verifyOtpFun: async (req, res) => {


    },

    changePasswordFun: async (req, res) => {



    },
}


