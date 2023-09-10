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
        const { lenderId } = req.body;
        let reqData = req.body;
        let lenders = [];
        if (lenderId) {
            const lenderData = await users.findOne({ _id: lenderId }); // Adjust the query to find the lender based on your schema.

            if (!lenderData) {
                return res.status(400).json({ success: false, message: 'Lender not found' });
            }

            const creatingLender = {
                lenderId: String(lenderData._id),
                lenderName: lenderData.name,
                approved: 1,
                lander_approved: 1,

            };

            lenders.push(creatingLender);
            reqData.status = 1;
            reqData.lender_remark = "Approved";

        }
        try {

            reqData.lenders = lenders;
            reqData.case_no = await generateRandomSixDigitNumber();

            let filterData = { _id: req.body.borrowerId, userType: 3 }
            const findBorrower = await users.find(filterData)

            // console.log('findBorrower >> ', findBorrower);
            if (findBorrower.length == 0) {
                return res.status(400).json({ status: false, message: 'Borrower not found' });
            }
            if (findBorrower[0].kyc_details == null || findBorrower[0].financial_details == null) {
                return res.status(400).json({ status: false, message: 'Please update all related documents first!!' });
            }

            reqData.borrower = findBorrower[0]._id;
            reqData.borrowerName = findBorrower[0].name;
            reqData.borrowerTurnOver = findBorrower[0].annual_turn_over;
            reqData.business_structure = findBorrower[0].bussiness_details.bussiness_structure;




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
                    lender_remark: req.body.lender_remark,

                },
                { new: true } // Return the updated document
            );

            if (!updatedPermission) {

                return res.status(404).json({ msg: 'Case not found' });
            }

            return res.status(200).json({ status: true, msg: 'Status Updated Successfully !!', result: updatedPermission });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },


    // lenderCaseStatus: async (req, res) => {

    //     const caseId = req.params.id;
    //     const lenderId = req.body.lenderId;
    //     const newActiveValue = req.body.approved;

    //     console.log('CaseId >> ', caseId);
    //     console.log('lenderId >> ', lenderId);
    //     console.log('approved >> ', newActiveValue);

    //     try {
    //         let singleCase = await cases.findOne({ _id: ObjectId(caseId) });
    //         console.log('singleCase >> ', singleCase);
    //         if (!singleCase) {
    //             return res.status(200).json({ msg: 'Case not found' });
    //         }

    //         let didUpdated = false;
    //         let lenders = singleCase.lenders;
    //         for (let i = 0; i < lenders.length; i++) {
    //             if (lenders[i].lenderId == lenderId) {
    //                 console.log('Found at Obj >>>', lenders[i]._id);
    //                 for (const keys in req.body) {
    //                     lenders[i][keys] = req.body[keys]
    //                 }
    //                 didUpdated = true;
    //             }
    //         }

    //         if (!didUpdated) {
    //             return res.status(400).json({status : false, message: ' Lender not found in this case' });
    //         }

    //         const updatedCase = await cases.findOneAndUpdate(
    //             ObjectId(caseId),
    //             {
    //                 $set: { lenders: lenders },
    //             },
    //             { new: true }
    //         );

    //         if (!updatedCase) {
    //             return res.status(400).json({status : false, message: 'Case or lender not found' });
    //         }

    //         return res.status(200).json({ status: true, msg: 'Status Updated Successfully !!', result: updatedCase });
    //     } catch (error) {
    //         console.error('Error:', error);
    //         return res.status(400).json({ status: false, msg: error });
    //     }
    // },

    lenderCaseStatus: async (req, res) => {
        const caseId = req.params.id;
        const { lenderId, approved, lander_approved,lender_remark, ...updates } = req.body;

        console.log("CaseId >> ", caseId)
        console.log("lenderId >> ", lenderId)
        console.log("approved >> ", approved)

        try {
            const query = { _id: caseId };

            // If lenderId is a single string, convert it to an array to handle both cases.
            const lenderIds = Array.isArray(lenderId) ? lenderId : [lenderId];

            const update = { ...updates };

            // Check if 'approved' is present in the request body, and update it if necessary.
            if (typeof approved !== 'undefined') {
                update['lenders.$.approved'] = approved;
            }

            // Check if 'lander_approved' is present in the request body, and update it if necessary.
            if (typeof lander_approved !== 'undefined') {
                update['lenders.$.lander_approved'] = lander_approved;
            }
            if (typeof lender_remark !== 'undefined') {
                update['lenders.$.lender_remark'] = lender_remark;
            }

            const updatedCase = await cases.findOneAndUpdate(
                { ...query, 'lenders.lenderId': { $in: lenderIds } },
                { $set: update },
                { new: true, multi: true } // Use multi: true to update multiple documents (if lenderId is an array).
            );

            if (!updatedCase) {
                return res.status(400).json({ status: false, message: 'Case or lender not found' });
            }

            return res.status(200).json({ status: true, msg: 'Status Updated Successfully !!', result: updatedCase });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error.message });
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

    getSingleCaseByNo: async (req, res) => {

        try {
            let caseNo = req.query.caseNo.toString();
            console.log(req.query)

            const queryMap = { case_no: parseInt(caseNo.replace(/\s/g, '')) };
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

    addCommentInCase: async (req, res) => {

        const caseId = req.params.caseId;
        const { commenterId, remark, type } = req.body;

        try {
            const updatedCase = await cases.findByIdAndUpdate(
                caseId,
                {
                    $push: {
                        comments: { commenterId, remark, type },
                    },
                },
                { new: true }
            );

            if (!updatedCase) {
                return res.status(404).json({ error: 'Case not found' });
            }

            return res.status(200).json(updatedCase);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

}


