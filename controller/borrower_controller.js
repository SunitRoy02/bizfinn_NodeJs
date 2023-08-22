const { validationResult } = require('express-validator');
const users = require('../models/users');


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

            const find = await users.find({ userType : 3})
            // console.log("Find IN GetProfile >>> ", find);
            if (find.length === 0) {

                res.status(200).send({ success: true ,data: find});

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

            const find = await users.find({ _id: req.body.borrowerId})
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
            }else{
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

            const itemId = req.params.id;
            const updateFields = {};

            // Iterate through request body and populate updateFields object
            for (const key in req.body) {
                if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                    updateFields[key] = req.body[key];
                }else{
                    updateFields[key] = null;
                }
            }

            console.log('ID >> ', itemId);
            console.log('updateFields >> ', updateFields);

            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                itemId,
                { $set: { bussiness_details : updateFields} },
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

    updateBorrowerKycDetails: async (req, res) => {

        try {

            const itemId = req.params.id;
            const updateFields = {};

            // Iterate through request body and populate updateFields object
            for (const key in req.body) {
                if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                    updateFields[key] = req.body[key];
                }else{
                    updateFields[key] = null;
                }
            }

            console.log('ID >> ', itemId);
            console.log('updateFields >> ', updateFields);

            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                itemId,
                { $set: { kyc_details : updateFields} },
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

    updateBorrowerFinancialDetails: async (req, res) => {

        try {

            const itemId = req.params.id;
            const updateFields = {};

            // Iterate through request body and populate updateFields object
            for (const key in req.body) {
                if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                    updateFields[key] = req.body[key];
                }else{
                    updateFields[key] = null;
                }
            }

            console.log('ID >> ', itemId);
            console.log('updateFields >> ', updateFields);

            // Find and update the document with the provided ID
            const updatedItem = await users.findByIdAndUpdate(
                itemId,
                { $set: { financial_details : updateFields} },
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
}


