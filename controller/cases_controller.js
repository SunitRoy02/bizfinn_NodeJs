const { validationResult } = require('express-validator');
const cases = require('../models/cases');
const users = require('../models/users');


async function generateRandomSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 9999999; // Largest 6-digit number
  
    let generatedNum;
    let isUnique = false;
  
    while (!isUnique) {
      generatedNum = Math.floor(Math.random() * (max - min + 1)) + min;
  
      const existingCase = await cases.findOne({ case_no: generatedNum });
      if (!existingCase) {
        isUnique = true;
      }
    }
    return generatedNum;
  }


module.exports = {
    createCases: async (req, res) => {
        try {
            let reqData = req.body;
            let filterData = { _id: req.body.borrowerId, userType: 3 }
            // let filterData = { _id: mongoose.Types.ObjectId(req.body.borrowerId), userType: 3 }
            console.log('findBorrower ......>> ', filterData );
            const findBorrower = await users.find(filterData)
            console.log('findBorrower >> ', findBorrower);
            if (findBorrower.length == 0) {
            
                return res.status(400).json({ status: false, message: 'Borrower not found' });
            }
            reqData.borrower = findBorrower[0];
            reqData.lender_remark = "";
            reqData.lender = null;
            reqData.case_no = await generateRandomSixDigitNumber();

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

    updateBorrower: async (req, res) => {

        try {

            const itemId = req.params.id;


            console.log('ID >> ', itemId);
            console.log('Borrower >> ', req.body.borrowerId);


            const findBorrower = await users.find({ _id: req.body.borrowerId, userType: 3 })

            if (findBorrower.length == 0) {
                console.log('findBorrower >> ', findBorrower);
                return res.status(400).json({ status: false, message: 'Borrower not found' });
            }

            // Find and update the document with the provided ID
            const updatedItem = await cases.findByIdAndUpdate(
                itemId,
                { $set: { borrower: findBorrower[0] } },
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
    },

    getSingleCase: async (req, res) => {

        try {
            var id = req.params.id;
            console.log(req.params)
            const queryMap = { _id: id };
            const find = await cases.find(queryMap)
            if (find.length === 0) {
                res.status(200).send({ success: false, msg: "No case Found ", data: find });
            } else {
                //send otp work here 
                const message = "Case Found successfully";
                res.status(200).send({ success: true, msg: message, data: find[0] });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },

    deleteCase: async (req, res) => {

        try {
            var id = req.params.id;
            console.log(req.params)
            const queryMap = { _id: id };
            const result = await cases.deleteOne(queryMap)
            if (result.deletedCount === 1) {
                const msg = "Cases Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            } else {
                const msg = "No matched lender found ";
                res.status(201).send({ success: false, msg: msg, });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },
}


