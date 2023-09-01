const { validationResult } = require('express-validator');
const users = require('../models/users');
const cases = require('../models/cases');
const { ObjectId } = require('mongodb');


async function generateRandomSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 9999999; // Largest 6-digit number

    let generatedNum;
    let isUnique = false;

    while (!isUnique) {
        generatedNum = Math.floor(Math.random() * (max - min + 1)) + min;

        const existingCase = await users.findOne({ borrower_id: generatedNum });
        if (!existingCase) {
            isUnique = true;
        }
    }
    return generatedNum;
}


module.exports = {
    createBrowwer: async (req, res) => {
        try {

            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            //     return res.status(400).send({ success: false, errors: errors.array()[0] });
            // }

            const find = await users.find({ mobile: req.body.mobile })
            // console.log("Find IN Register >>> ", find);
            if (find.length === 0) {

                let reqData = req.body;
                reqData.case_logged = 0;
                reqData.case_approved = 0;
                reqData.case_pending = 0;
                reqData.userType = 3;
                reqData.bussiness_details = null;
                reqData.kyc_details = null;
                reqData.financial_details = null;
                reqData.name = reqData.companyName
                reqData.borrower_id = await generateRandomSixDigitNumber();

                console.log(reqData);
                let data = new users(reqData);
                let result = await data.save();


                const msfIfSuccess = "Borrower Created Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

            } else {
                const msfIferror = "Borrower Already Exixts";
                res.status(400).send({ success: false, msg: msfIferror });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }


    },

    getBorrowers: async (req, res) => {
        try {
            const { name } = req.query;

            const queryMap = {};
            queryMap.userType = 3;
        
            if (name) {
                queryMap.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
            }

            const find = await users.find(queryMap)
            // console.log("Find IN GetProfile >>> ", find);
            if (find.length === 0) {

                res.status(200).send({ success: true, data: find });

            } else {
                //send otp work here 
                const message = "Lender Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });

            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },


    getSingleBorrower: async (req, res) => {
        try {

            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            // return res.status(400).send({ success: false, errors: errors.array()[0] });
            // }

            const find = await users.find({ _id: req.body.borrowerId })
            // console.log("Find IN GetProfile >>> ", find);
            if (find.length === 0) {

                const msfIferror = "Borrower not found";
                res.status(400).send({ success: false, msg: msfIferror });

            } else {
                //send otp work here 
                const message = "Borrower  Found successfully";
                res.status(200).send({ success: true, msg: message, data: find[0] });

            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },


    deleteBorrower: async (req, res) => {
        try {
            var id = req.params.borrowerId;
            const query = { _id: id };
            const result = await users.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Borrower Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            } else {
                const msg = "No matched borrower found ";
                res.status(201).send({ success: false, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },


    updateBorrowerProfile: async (req, res) => {

        try {

            const itemId = req.params.id;
            const updateFields = {};
            updateFields.name = req.body.companyName;

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


    updateBorrowerBusinessDetails: async (req, res) => {

        try {
            const userId = req.params.id;
            const updatedBusinessDetails = req.body;

            console.log('userId >> ', userId);
            // Find the user by userId
            const userData = await users.findOne({ _id: ObjectId(userId) });

            if (!userData) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            // Update only non-null, non-undefined, and non-empty values in business details
            if (userData.bussiness_details !== null) {
                console.log('userData.bussiness_details >> ', userData.bussiness_details);
                console.log('updatedBusinessDetails >> ', updatedBusinessDetails);
                for (const key in updatedBusinessDetails) {
                    const value = updatedBusinessDetails[key];
                    if (value !== null && value !== undefined && value !== '') {
                        userData.bussiness_details[key] = value;
                    }
                }
            } else {
                userData.bussiness_details = updatedBusinessDetails;
            }

            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                userId,
                { $set: { bussiness_details: userData.bussiness_details } },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            return res.json({ status: true, message: 'Business details updated successfully', data: updatedItem });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: 'An error occurred', error });
        }

    },

    updateBorrowerKycDetails: async (req, res) => {

        try {
            const userId = req.params.id;
            const KycUpdatedObj = req.body;

            // Find the user by userId
            const userData = await users.findOne({ _id: userId });

            if (!userData) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            console.log('userData.kyc_details >> ', userData.kyc_details);
            console.log('KycUpdatedObj >> ', KycUpdatedObj);
            if (userData.kyc_details !== null) {
                // Update only non-null, non-undefined, and non-empty values in business details
                for (const key in KycUpdatedObj) {
                    const value = KycUpdatedObj[key];
                    if (value !== null && value !== undefined && value !== '') {
                        userData.kyc_details[key] = { url: value, };
                    }
                }
            } else {

                let kycMap = {};

                for (const key in KycUpdatedObj) {
                    const value = KycUpdatedObj[key];
                    kycMap[key] = { url: value, };
                }

                userData.kyc_details = kycMap;
            }

            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                userId,
                { $set: { kyc_details: userData.kyc_details } },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            return res.json({ status: true, message: "Kyc updated successfully.", data: updatedItem });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: 'An error occurred', error });
        }

    },

    updateBorrowerFinancialDetails: async (req, res) => {


        try {
            const userId = req.params.id;
            const updatedBusinessDetails = req.body;

            // Find the user by userId
            const userData = await users.findOne({ _id: userId });

            if (!userData) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }


            
            if (userData.financial_details !== null) {
                // Update only non-null, non-undefined, and non-empty values in business details
                for (const key in updatedBusinessDetails) {
                    const value = updatedBusinessDetails[key];
                    if (value !== null && value !== undefined && value !== '') {
                        userData.financial_details[key] = { url: value, };
                    }
                }
            } else {
                let keyMap = {};
                for (const key in updatedBusinessDetails) {
                    const value = updatedBusinessDetails[key];
                    keyMap[key] = { url: value, };
                }

                userData.financial_details = keyMap;
            }
            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                userId,
                { $set: { financial_details: userData.financial_details } },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            return res.json({ status: true, message: "Financial Details updated successfully.", data: updatedItem });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: 'An error occurred', error });
        }

    },


    getCases: async (req, res) => {
        try {

            const borrowerId = req.params.borrowerId;

            console.log("Borrower >> ", borrowerId);
            const find = await cases.find({ 'borrower': ObjectId(borrowerId) });
            if (find.length === 0) {
                res.status(200).send({ success: false, msg: "No Cases Found ", data: find });
            } else {
                //send otp work here 
                const message = "Cases Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });
            }

        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },


}


