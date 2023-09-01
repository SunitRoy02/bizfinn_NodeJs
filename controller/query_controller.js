const { validationResult } = require('express-validator');
const cases = require('../models/cases');
const users = require('../models/users');
const query = require('../models/query');


async function generateRandomSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 9999999; // Largest 6-digit number
  
    let generatedNum;
    let isUnique = false;
  
    while (!isUnique) {
      generatedNum = Math.floor(Math.random() * (max - min + 1)) + min;
  
      const existingCase = await query.findOne({ query_no: generatedNum });
      if (!existingCase) {
        isUnique = true;
      }
    }
    return generatedNum;
  }


module.exports = {
    createQuery: async (req, res) => {
        try {
            let reqData = req.body;

            let lender = await users.findOne({ _id: req.body.lenderId});
            if(lender == null){
                res.status(400).send({ success: false, msg: "Lender not found !!",});
            }

            reqData.query_no = await generateRandomSixDigitNumber();
            const caseNo = reqData.case_no.toString(); // Fix 1: Correct destructuring
            console.log(caseNo);

            const find = await cases.find({ case_no: parseInt(caseNo.replace(/\s/g, '')) });
            console.log('FindeCase >> ', find);
            if(find.length === 0){
                res.status(400).send({ success: false, msg: "Case not found !!", data: result });
            }
            reqData.case = find[0]._id;
            reqData.case_no = find[0].case_no;
            reqData.borrower = find[0].borrower;
            reqData.borrowerName = find[0].borrowerName;
            reqData.lender_name = lender.name;

            let data = new query(reqData);  
            let result = await data.save();


            const msfIfSuccess = "Query Created Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }
    },

    getQuery: async (req, res) => {
        try {

            const { name, fromDate, toDate } = req.query;

            const queryMap = {};
        
            if (name) {
                queryMap.lender_name = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
            }
        
            if (fromDate && toDate) {
                queryMap.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
              };
            }
            const find = await query.find(queryMap)
            if (find.length === 0) {
                res.status(200).send({ success: false, msg: "No query Found ", data: find });
            } else {
                //send otp work here 
                const message = "Query Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },

    getSingleQuery: async (req, res) => {

        try {
            var id = req.params.queryId;
            console.log(req.params)
            const queryMap = { _id: id };
            const find = await query.find(queryMap)
            if (find.length === 0) {
                res.status(200).send({ success: false, msg: "No query Found ", data: find });
            } else {
                //send otp work here 
                const message = "Query Found successfully";
                res.status(200).send({ success: true, msg: message, data: find[0] });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },


    deleteQuery: async (req, res) => {

        try {
            var id = req.params.queryId;
            console.log(id)

            if(id.toString() == ':queryId'){
                const msg = "Query id is compulsory";
                res.status(400).send({ success: false, msg: msg, });
            }

            const queryMap = { _id: id };
            const result = await query.deleteOne(queryMap)
            if (result.deletedCount === 1) {
                const msg = "Query Deleted Successfully";
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

    queryStatus: async (req, res) => {
        const permissionId = req.params.id;
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
            const updatedItem = await query.findByIdAndUpdate(
                itemId,
                { $set: updateFields },
                { new: true } // Return the updated document
            );

            if (!updatedItem) {
                return res.status(400).json({ status: false, message: 'Query not found' });
            }

            return res.status(200).json({ status: true, msg: 'Status Updated Successfully !!', result: updatedItem });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },
    
}


