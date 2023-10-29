const { validationResult } = require('express-validator');
const users = require('../models/users');
const cases = require('../models/cases');
const { ObjectId } = require('mongodb');
const axios = require('axios');

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
            const { email, mobile } = req.body;

            console.log(req.body);
            console.log(email);
            console.log(mobile);

            if (email != undefined) {
                console.log('inside email');
                const emailData = await users.findOne({ email: email })
                if (emailData !== null) {
                    console.log('emailData >> ', emailData);
                    return res.status(400).send({
                        success: false,
                        msg: "User with this email already exixts"
                    });
                }
            }
            if (mobile !== undefined) {
                console.log('inside phone');

                const phoneData = await users.findOne({ mobile: mobile })
                if (phoneData !== null) {
                    console.log('phoneData >> ', phoneData);

                    return res.status(400).send({
                        success: false,
                        msg: "User with this mobile number already exixts"
                    });
                }
            }

            // console.log("Find IN Register >>> ", find);

            let reqData = req.body;
            reqData.case_logged = 0;
            reqData.case_approved = 0;
            reqData.case_pending = 0;
            reqData.userType = 3;
            reqData.bussiness_details = {
                bussiness_structure: ""
            };
            reqData.kyc_details = null;
            reqData.financial_details = null;
            reqData.name = reqData.companyName
            reqData.borrower_id = await generateRandomSixDigitNumber();

            console.log(reqData);
            let data = new users(reqData);
            let result = await data.save();


            const msfIfSuccess = "Borrower Created Successfully";
            return res.status(200).send({ success: true, msg: msfIfSuccess, data: result });
        } catch (error) {
            console.log("Error : ", error);
            return res.status(400).send({ success: false, msg: error.message });

        }


    },

    getBorrowers: async (req, res) => {
        try {

            const { name, fromDate, toDate } = req.query;

            const queryMap = {};
            queryMap.userType = 3;

            if (name) {
                queryMap.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
            }

            if (fromDate && toDate) {
                queryMap.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                };
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

            if (!updatedBusinessDetails.gst_number) {
                return res.status(400).json({ status: false, message: 'Gst Number not found' });
            }
            var result = await checkGstNumber(updatedBusinessDetails.gst_number);

            console.log('Check GST result >> ', result);
            if (!result && result != 200) {
                return res.status(400).json({ status: false, message: 'Please enter a valid GST number' });
            }

            // Update only non-null, non-undefined, and non-empty values in business details
            if (userData.bussiness_details !== null) {
                // console.log('userData.bussiness_details >> ', userData.bussiness_details);
                // console.log('updatedBusinessDetails >> ', updatedBusinessDetails);
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

    updateBorrowerExtraDocs: async (req, res) => {

        try {
            const userId = req.params.id;
            const newObjects = req.body.extraDocArray;

            // Find the user by userId
            const userData = await users.findOne({ _id: userId });

            if (!userData) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            const updatedUser = await users.findOneAndUpdate(
                { _id: userId },
                { $push: { userExtraDocs: { $each: newObjects } } });


            // const updatedUser =  users.findOneAndUpdate(
            //         { _id: documentId },
            //         { $pull: { userExtraDocs: { _id: objectIdToRemove } } })


            return res.json({ status: true, message: "Kyc updated successfully.", data: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: 'An error occurred', error });
        }

    },

    removeBorrowerExtraDocs: async (req, res) => {

        try {
            const userId = req.query.id;
            const imageId = req.query.imageId;

            // Find the user by userId
            const userData = await users.findOne({ _id: userId });

            if (!userData) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }
            const updatedUser =  users.findOneAndUpdate(
                    { _id: documentId },
                    { $pull: { userExtraDocs: { _id: imageId } } })


            return res.json({ status: true, message: "Kyc updated successfully.", data: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: 'An error occurred', error });
        }

    },

    updateBorrowerFinancialDetails: async (req, res) => {


        try {
            const userId = req.params.id;
            const { caseId } = req.params
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

            if (caseId) {
                const caseData = await cases.findOne({ _id: caseId });
                if (caseData.financial_details !== null) {
                    // Update only non-null, non-undefined, and non-empty values in business details
                    for (const key in updatedBusinessDetails) {
                        const value = updatedBusinessDetails[key];
                        if (value !== null && value !== undefined && value !== '') {
                            caseData.financial_details[key] = { url: value, };
                        }
                    }
                }

                const caseUpdatedItem = await cases.findByIdAndUpdate(
                    caseId,
                    { $set: { financial_details: caseData.financial_details } },
                );
            }


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

            const { name, fromDate, toDate } = req.query;

            let queryMap = { 'borrower': ObjectId(borrowerId) };

            if (name) {
                queryMap.borrowerName = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
            }

            if (fromDate && toDate) {
                queryMap.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                };
            }


            console.log("borrowerId >> ", borrowerId);
            const userByborrowerId = await users.findOne({ _id: borrowerId });
            if (!userByborrowerId) {
                return res.status(400).send({ success: false, msg: "Borrower not found", });
            }
            const find = await cases.find(queryMap);
            if (find.length === 0) {
                return res.status(200).send({ success: false, msg: "No Cases Found ", data: find });
            } else {
                const message = "Cases Found successfully";
                return res.status(200).send({ success: true, msg: message, data: find });
            }

        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },


    borrowerDashbord: async (req, res) => {

        try {
            const borrowerId = req.params.borrowerId;

            const { fromDate, toDate } = req.query;

            let queryMap = { 'borrower': ObjectId(borrowerId) };


            if (fromDate && toDate) {
                queryMap.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                };
            }


            console.log("borrowerId >> ", borrowerId);
            const userByborrowerId = await users.findOne({ _id: borrowerId });
            if (!userByborrowerId) {
                return res.status(400).send({ success: false, msg: "Borrower not found", });
            }
            const find = await cases.find(queryMap);
            if (find.length === 0) {
                return res.status(200).send({ success: false, msg: "No Cases Found ", data: find });
            } else {
                const message = "Cases Found successfully";
                let dataObjact = {
                    pendingCases: find.filter(obj => obj.status === 0).length,
                    completeCases: find.filter(obj => obj.status === 1).length,
                    rejectedCases: find.filter(obj => obj.status === 2).length,
                    inprogressCases: find.filter(obj => obj.status === 3).length,
                }
                return res.status(200).send({ success: true, msg: message, data: dataObjact });
            }

        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },



}

async function getAccessTocken() {

    var testingUrl = "https://preproduction.signzy.tech/api/v2/patrons/login";
    // var prodgUrl = "https://signzy.tech/api/v2/patrons/login";

    var options = {
        method: 'POST',
        url: testingUrl,
        headers: { 'Accept-Language': 'en-US,en;q=0.8', Accept: '*/*' },
        data: { username: 'Bizfinn_test', password: '9r5fruraclko9wug' }
    };

    let res = await axios.request(options).catch(function (error) {
        console.error(error);
    });
    //   console.log("Axios Responce >>>> ",res.data);
    return res.data;
}


async function checkGstNumber(gstNumber) {

    var res = await getAccessTocken();
    console.log("Axios Responce >>>> ", res);

    if (res !== null) {

        var testingUrl = `https://preproduction.signzy.tech/api/v2/patrons/${res.userId}/gstns`;
        // var prodgUrl = `https://signzy.tech/api/v2/patrons/${res.userId}/gstns`;

        console.log(testingUrl);
        var options = {
            method: 'POST',
            url: testingUrl,
            headers: {
                'Accept-Language': 'en-US,en;q=0.8',
                'content-type': 'application/json',
                'Authorization': res.id
            },
            data: { task: 'gstinSearch', essentials: { gstin: gstNumber } }
        };

        try {
            var result = await axios.request(options);
            return result.status;
        } catch (error) {
            console.error(error.message);
        }

    }



}

