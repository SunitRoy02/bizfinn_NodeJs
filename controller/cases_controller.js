const { validationResult } = require('express-validator');
const cases = require('../models/cases');
// const shortedLenders = require('../models/cases');
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
            reqData.business_structure = findBorrower[0].bussiness_details.type_of_business;
            reqData.kyc_details = findBorrower[0].kyc_details;
            reqData.financial_details = findBorrower[0].financial_details;

            // console.log(reqData);
            let data = new cases(reqData);
            let result = await data.save();


            const msfIfSuccess = "Cases Created Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }
    },

    // updateLender: async (req, res) => {

    //     try {

    //         const itemId = req.params.id;
    //         const lenderId = req.body.lenderId;


    //         console.log('ID >> ', itemId);
    //         console.log('Lender >> ', lenderId);
    //         console.log('Body >> ', req.body);

    //         const find = await users.find({ _id: ObjectId(lenderId), userType: 2 })

    //         if (find.length == 0) {
    //             console.log('findUser >> ', find.lender);
    //             return res.status(400).json({ status: false, message: 'Lender not found' });
    //         }

    //         const lenderFound = find[0];
    //         console.log(' FOUND Lenders>>', lenderFound)
    //         let newLenderObj = {};
    //         newLenderObj.landerName = lenderFound.name;
    //         newLenderObj.lenderId = lenderFound._id;

    //         const findCases = await cases.find({ _id: itemId, })
    //         console.log('CASE FOUND Lenders>>', findCases[0])
    //         const oldLenders = findCases[0].lenders;

    //         for (let i = 0; i < oldLenders.length; i++) {
    //             if (oldLenders[i].lenderId == lenderFound._id) {
    //                 return res.status(400).json({ status: false, message: 'Lender already assignend to this case !' });
    //             }
    //             console.log(i);
    //         }

    //         // Find and update the document with the provided ID
    //         const updatedItem = await cases.findByIdAndUpdate(
    //             itemId,
    //             { $push: { lenders: newLenderObj } },
    //             { new: true } // Return the updated document
    //         );

    //         if (!updatedItem) {
    //             return res.status(400).json({ status: false, message: 'Case not found' });
    //         }

    //         console.log('Updated Value >>', updatedItem)
    //         return res.status(200).json({ status: true, message: 'Case Updated Successfully', result: updatedItem });
    //     } catch (error) {
    //         console.log("Error : ", error);
    //         res.status(400).send({ status: false, msg: error.message });

    //     }

    // },

    updateLender: async (req, res) => {
        try {
            const { id: itemId } = req.params;
            const { lenderIds } = req.body; // Change to accept an array of lenderIds

            // Ensure lenderIds is an array
            if (!Array.isArray(lenderIds)) {
                return res.status(400).json({ status: false, message: 'LenderIds should be an array' });
            }

            // Find all lenders with userType 2 whose IDs are in lenderIds
            const lenders = await users.find({ _id: { $in: lenderIds }, userType: 2 });

            if (lenders.length !== lenderIds.length) {
                return res.status(400).json({ status: false, message: 'One or more lenders not found or have incorrect userType' });
            }

            const caseFound = await cases.findOne({ _id: itemId });

            if (!caseFound) {
                return res.status(400).json({ status: false, message: 'Case not found' });
            }

            const existingLenderIds = caseFound.lenders.map((lender) => lender.lenderId);

            // Filter lenderIds to exclude those already assigned to the case
            const newLenderIds = lenderIds.filter((lenderId) => !existingLenderIds.includes(lenderId));

            if (newLenderIds.length === 0) {
                return res.status(400).json({ status: false, message: 'All lenders are already assigned to this case' });
            }

            const newLenders = newLenderIds.map((lenderId) => {
                const lender = lenders.find((lender) => lender._id.toString() === lenderId);
                return {
                    landerName: lender.name, // Include lenderName
                    lenderId,
                };
            });

            // Remove lenders from the shortedLenders array
            const updatedShortedLenders = caseFound.shortedLenders.filter((shortedLender) => !newLenderIds.includes(shortedLender.lenderId));
            // console.log("newLenders >> ", newLenders);
            const updatedItem = await cases.findByIdAndUpdate(
                itemId,
                {
                    $push: { lenders: { $each: newLenders } },
                    shortedLenders: updatedShortedLenders // Update the shortedLenders array
                },
                { new: true }
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'Failed to update case' });
            }

            return res.status(200).json({ status: true, message: 'Case Updated Successfully', result: updatedItem });
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ status: false, message: error.message });
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
        const caseId = req.params.id;
        const {lenderId } = req.params;

    
        try {

            let caseData = await cases.findOne({ _id: caseId });
            let lenders = caseData.lenders;

            if(lenderId && req.body.status == 2){
                for (let i = 0; i < lenders.length; i++) {
                    if (lenders[i].lenderId === lenderId) {
                        lenders[i].approved = 3;
                        lenders[i].lander_approved = 1;
                        lenders[i].lender_remark = req.body.lender_remark;
                    
                    }
                    console.log(lenders[i]);
                }
            }else{
                if (req.body.status == 1 || req.body.status == 2) {
                    if (caseData) {
                        let lenders = caseData.lenders;
                        if (lenders.length !== 0) {
                            for (let i = 0; i < lenders.length; i++) {
                                if (req.body.status == 1) {
                                    if (lenders[i].approved !== 1) {
                                        lenders[i].approved = 3;
                                        lenders[i].lander_approved = 1;
                                        console.log(lenders[i]);
                                    }
                                } else if (req.body.status == 2) {
                                    lenders[i].approved = 3;
                                    lenders[i].lander_approved = 1;
                                    console.log(lenders[i]);
                                }
                            }
                        }
                    } else {
                        console.log('Error >> ')
                    }
                }
            }

            const updatedPermission = await cases.findByIdAndUpdate(
                caseId,
                {
                    status: lenderId ? caseData.status : req.body.status,
                    lender_remark: req.body.lender_remark,
                    lenders: lenders

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
        const { lenderId, approved, lander_approved, lender_remark, approved_amount } = req.body;
        try {
            const queryObj = { _id: caseId };

            console.log("CaseId >>>",queryObj);
            // If lenderId is a single string, convert it to an array to handle both cases.
            const lenderIds = Array.isArray(lenderId) ? lenderId : [lenderId];

            console.log("lenderIds >>>",lenderIds);

            let caseData = await cases.findOne(queryObj);
            if (!caseData) {
                return res.status(200).json({ status: false, msg: 'Case Not Found !!', });
            }

            let lenders = caseData.lenders;
            console.log("Lender before Admin approvel >>> \n\n",lenders)

            if(typeof approved !== 'undefined'){
                console.log("In Approved")
                for (let i = 0; i < lenderIds.length; i++) {
                    for (let k = 0; k < lenders.length; k++) {
                        if (lenders[k].lenderId == lenderIds[i]) {
                            lenders[k].approved = approved;
                            break;
                        }
                    }
                }
            }else{
                console.log("In Other")

                for (let i = 0; i < lenderIds.length; i++) {
                    for (let k = 0; k < lenders.length; k++) {
                        if (lenders[k].lenderId == lenderIds[i]) {
                            if (typeof lander_approved !== 'undefined') {
                                lenders[k].lander_approved = lander_approved;
                            }
                            if (typeof lender_remark !== 'undefined') {
                                lenders[k].lender_remark = lender_remark;
                            }
                            if (typeof approved_amount !== 'undefined') {
                                lenders[k].approved_amount = approved_amount;
                            }
                            break;
                        }
                    }
                }
            }

            
            console.log("Lender after Admin approvel >>> \n\n",lenders)
            const updateddCase = await cases.findByIdAndUpdate(
                caseId,
                { lenders: lenders},
                { new: true } // Return the updated document
            );
            if (typeof approved !== 'undefined') {
                await updateBorrowerCaseData(caseId, approved);
            }

            return res.status(200).json({ status: true, msg: 'Case Status Updated Successfully !!', result: updateddCase });


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


    addShortedLenders: async (req, res) => {
        try {
            const { caseId } = req.params;
            const { lenderId, landerName } = req.body;

            // Check if the lenderId already exists in shortedLenders for the given caseId
            const caseWithLender = await cases.exists({ _id: caseId, 'shortedLenders.lenderId': lenderId });

            if (caseWithLender) {
                return res.status(400).json({ status: false, message: 'Lender already exists in shortedLenders' });
            }

            // Create a new Shorted document
            const shorted = { lenderId, landerName };

            // Find the case by ID, update it, and return the updated document
            const updatedCase = await cases.findByIdAndUpdate(
                caseId,
                { $push: { shortedLenders: shorted } },
                { new: true }
            );

            if (!updatedCase) {
                return res.status(404).json({ status: false, message: 'Case not found' });
            }

            return res.status(201).json({ status: true, message: 'Lender added to shortedLenders', result: updatedCase });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ status: false, message: 'Internal server error' });
        }

    },

    deleteShortedLenders: async (req, res) => {
        try {
            const { caseId, lenderId } = req.params;

            // Use findOneAndUpdate to find and update the case
            const updatedCase = await cases.findOneAndUpdate(
                { _id: caseId, 'shortedLenders.lenderId': lenderId },
                { $pull: { shortedLenders: { lenderId: lenderId } } },
                { new: true }
            );

            if (!updatedCase) {
                return res.status(404).json({ status: false, message: 'Case or lender not found' });
            }

            res.status(200).send({ status: true, message: 'Shorted lender removed successfully !' }); // No content in the response, indicating success
        } catch (error) {
            console.error('Error deleting shorted lender:', error);
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
    },


    updateDocStatus: async (req, res) => {
        const { caseId, schemaType, docType } = req.params;
        const { status } = req.body;

        // Ensure that status is either 0 or 1

        if (status !== 0 && status !== 1) {
            return res.status(400).json({ message: 'Status must be 0 or 1' });
        }

        try {
            // Find the user document by userId
            const caseData = await cases.findOne({ _id: caseId });

            if (!caseData) {
                return res.status(404).json({ message: 'Case not found' });
            }

            // Determine the schema based on schemaType and update the status accordingly
            let schemaToUpdate;

            if (schemaType === 'kycSchema') {
                schemaToUpdate = caseData.kyc_details;
            } else if (schemaType === 'financialSchema') {
                schemaToUpdate = caseData.financial_details;
            } else {
                return res.status(400).json({ message: 'Invalid schema type' });
            }

            if (schemaToUpdate && schemaToUpdate[docType] && schemaToUpdate[docType].status !== undefined) {
                schemaToUpdate[docType].status = status;
                await caseData.save();
                return res.status(200).json(caseData);
            } else {
                return res.status(404).json({ message: 'Document type not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
}


async function updateBorrowerCaseData(caseId, approved) {

    try {

        //get and update borrower case count -----
        const find = await cases.findOne({ _id: ObjectId(caseId) });
        if (!find) {
            return res.status(400).json({ status: false, message: 'Case not found' });
        }




        const allCases = await cases.find({ 'borrower': ObjectId(find.borrower) });

        let updateFields = {
            case_pending: allCases.filter(obj => obj.status === 0).length,
            case_approved: allCases.filter(obj => obj.status === 1).length,
            // rejectedCases : allCases.filter(obj => obj.status === 2).length,
            case_logged: allCases.filter(obj => obj.status === 3).length,
        }

        // Find and update the document with the provided ID
        const updatedItem = await users.findByIdAndUpdate(
            find.borrower,
            { $set: updateFields },
            { new: true } // Return the updated document
        );

        if (updatedItem) {
            console.log("Borrower Updated Successfully !\n\n")
        }

    } catch (error) {
        console.log("Error 1 >> ", error)
    }


}