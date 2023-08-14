const { validationResult } = require('express-validator');
const cases = require('../models/cases');
const users = require('../models/users');


function generateRandomSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
    createCases: async (req, res) => {
        try {
            let reqData = req.body;
            reqData.lender_remark = "";
            reqData.borrower = null;
            reqData.lender = null;
            reqData.case_no = generateRandomSixDigitNumber();

            console.log(reqData);
            let data = new cases(reqData);
            let result = await data.save();


            const msfIfSuccess = "Cases Created Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }
    },

    updateLender: async (req, res) => {

        try {

            const itemId = req.params.id;


            console.log('ID >> ', itemId);
            console.log('Lender >> ', req.body.lenderId);


            const find = await users.find({ _id: req.body.lenderId, userType: 2 })

            if (find.length == 0) {
                console.log('findUser >> ', findUser.lender);
                return res.status(400).json({ status: false, message: 'Lender not found' });
            }

            // Find and update the document with the provided ID
            const updatedItem = await cases.findByIdAndUpdate(
                itemId,
                { $set: { lender: find[0] } },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'Case not found' });
            }

            return res.status(200).json({ status: true, message: 'Case Updated Successfully', result: updatedItem });
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ status: false, msg: error.message });

        }

    },

    caseStatus: async (req, res) => {
        const permissionId = req.params.id;
        const newActiveValue = req.body.status; // The new value for the "active" field

        try {
            const updatedPermission = await cases.findByIdAndUpdate(
                permissionId,
                { status: newActiveValue },
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


    getCases : async (req,res)=> {
        try {
            
            const find = await cases.find({})
            if (find.length === 0) {
                res.status(200).send({ success: false,msg:"No Cases Found ", data: find });
            } else {
                //send otp work here 
                const message = "Cases Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });

            }

        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    }
}


