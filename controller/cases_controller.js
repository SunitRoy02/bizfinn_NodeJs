const { validationResult } = require('express-validator');
const cases = require('../models/cases');
const users = require('../models/users');
const { ObjectId } = require('mongodb');


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
            console.log('findBorrower ......>> ', filterData);
            const findBorrower = await users.find(filterData)
            console.log('findBorrower >> ', findBorrower);
            if (findBorrower.length == 0) {

                return res.status(400).json({ status: false, message: 'Borrower not found' });
            }
            reqData.borrower = findBorrower[0]._id;
            reqData.borrowerName = findBorrower[0].name;
            reqData.borrowerTurnOver = findBorrower[0].annual_turn_over;
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
            const lenderId = req.body.lenderId;


            console.log('ID >> ', itemId);
            console.log('Lender >> ', lenderId);
            console.log('Body >> ', req.body);




            const find = await users.find({ _id: ObjectId(lenderId), userType: 2 })

            if (find.length == 0) {
                console.log('findUser >> ', find.lender);
                return res.status(400).json({ status: false, message: 'Lender not found' });
            }

            const lenderFound = find[0];
            console.log(' FOUND Lenders>>', lenderFound)
            let newLenderObj = {};
            newLenderObj.landerName = lenderFound.name;
            newLenderObj.lenderId = lenderFound._id;

            const findCases = await cases.find({ _id: itemId, })
            console.log('CASE FOUND Lenders>>', findCases[0])
            const oldLenders = findCases[0].lenders;

            for (let i = 0; i < oldLenders.length; i++) {
                if (oldLenders[i].lenderId == lenderFound._id) {
                    return res.status(400).json({ status: false, message: 'Lender already assignend to this case !' });
                }
                console.log(i);
            }

            // Find and update the document with the provided ID
            const updatedItem = await cases.findByIdAndUpdate(
                itemId,
                { $push: { lenders: newLenderObj } },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'Case not found' });
            }

            console.log('Updated Value >>', updatedItem)
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

        try {
            const updatedPermission = await cases.findByIdAndUpdate(
                permissionId,
                { 
                    status: req.body.status,
                    status: req.body.status,
                
                },
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


    lenderCaseStatus: async (req, res) => {

        const caseId = req.params.id;
        const lenderId = req.body.lenderId;
        const newActiveValue = req.body.approved;

        console.log('CaseId >> ', caseId);
        console.log('lenderId >> ', lenderId);
        console.log('approved >> ', newActiveValue);

        try {
            let singleCase = await cases.find({ _id: caseId });
            console.log('singleCase >> ', singleCase);
            if (singleCase.length === 0) {
                return res.status(404).json({ msg: 'Case not found' });
            }

            let didUpdated = false;
            let lenders = singleCase[0].lenders;
            for (let i = 0; i < lenders.length; i++) {
                if (lenders[i].lenderId == lenderId) {
                    console.log('Found at Obj >>>', lenders[i]._id);
                    lenders[i].approved = newActiveValue
                    lenders[i].remark = req.body.remark
                    lenders[i].lander_approved = req.body.lander_approved
                    didUpdated = true;
                }
            }

            if(!didUpdated){
                return res.status(404).json({ message: ' lender not found' });
            }

            const updatedCase = await cases.findOneAndUpdate(
                ObjectId(caseId),
                {
                    $set: { lenders : lenders },
                },
                { new: true }
            );

            if (!updatedCase) {
                return res.status(404).json({ message: 'Case or lender not found' });
            }

            return res.status(200).json({ status: true, msg: 'Status Updated Successfully !!', result: updatedCase });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },

    getCases: async (req, res) => {
        try {

            const { name, fromDate, toDate } = req.query;

            const queryMap = {};
        
            if (name) {
                queryMap.borrowerName = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
            }
        
            if (fromDate && toDate) {
                queryMap.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
              };
            }
            const find = await cases.find(queryMap)
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


