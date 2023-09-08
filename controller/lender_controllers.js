const { validationResult } = require('express-validator');
// const lenders = require('../models/lenders');
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
  
      const existingCase = await users.findOne({ lender_id: generatedNum });
      if (!existingCase) {
        isUnique = true;
      }
    }
    return generatedNum;
  }


module.exports = {
    createLender: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const email = await users.findOne({ email: req.body.email ,})
            const phone = await users.findOne({ mobile: req.body.mobile })
            // console.log("Find IN Register >>> ", find);
            if (!email && !phone) {

                let reqData = req.body;
                reqData.case_logged = 0;
                reqData.case_approved = 0;
                reqData.case_pending = 0;
                reqData.lender_id = await generateRandomSixDigitNumber();
                reqData.userType = 2; // admin 1 lender 2 borrower 3

                // console.log(reqDataUser);
                let dataUser = new users(reqData);
                let resultUser = await dataUser.save();


                const msfIfSuccess = "Register Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: resultUser });

            } else {
                const msfIferror = email ?  "User with this Email Already Exixts" 
                : phone ? "User with this Mobile Number Already Exixts" : "";
                res.status(400).send({ success: false, msg: msfIferror });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }


    },

    getLenders: async (req, res) => {
        try {

            const { name } = req.query;

            const queryMap = {};
            queryMap.userType = 2;
        
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


    getSingleLender: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await users.find({ _id: req.body.lenderId })
            // console.log("Find IN GetProfile >>> ", find);
            if (find.length === 0) {

                const msfIferror = "Lender not found";
                res.status(400).send({ success: false, msg: msfIferror });

            } else {
                //send otp work here 
                const message = "Lender  Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });

            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },

    updateLenderProfile: async (req, res) => {

        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            // const find = await lenders.find({ email: req.body.email })
            const find = await users.find({ email: req.body.email })
            // console.log("Find IN Register >>> ", find);
            if (find.length === 0) {

                let reqData = req.body;
                reqData.case_logged = 0;
                reqData.case_approved = 0;
                reqData.case_pending = 0;
                reqData.lender_id = generateRandomSixDigitNumber();
                 
                let reqDataUser  = {};
                reqDataUser.lenderData = reqData;
                reqDataUser.name = reqData.name;
                reqDataUser.email = reqData.email;
                reqDataUser.password = reqData.password;
                reqDataUser.avatar = '';
                reqDataUser.userType = 2; // admin 1 lender 2 borrower 3

                // console.log(reqDataUser);
                let dataUser = new users(reqDataUser);
                let resultUser = await dataUser.save();


                const msfIfSuccess = "Register Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: resultUser });

            } else {
                const msfIferror = "USer with same email already exixts";
                res.status(400).send({ success: false, msg: msfIferror });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }


    },


    deleteLeander: async (req, res) => {
        try {
            var id = req.params.lenderId;
            console.log(req.params)
            const query = { _id: id };
            const result = await users.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Lender Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            } else {
                const msg = "No matched lender found ";
                res.status(201).send({ success: false, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },


    getCases : async (req,res)=> {
        try {
            const lenderId = req.params.lenderId;

            const { name, fromDate, toDate } = req.query;

            const queryMap = {'lenders.lenderId': ObjectId(lenderId)};
        
            if (name) {
                queryMap.borrowerName = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
            }
        
            if (fromDate && toDate) {
                queryMap.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
              };
            }


            console.log("lenderId >> ",lenderId);
            const userByLenderId = await users.findOne({ _id:  lenderId});
            if(!userByLenderId){
               return  res.status(400).send({ success: false,msg:"Lander not found",});
            }
            const find = await cases.find(queryMap);
            if (find.length === 0) {
               return  res.status(200).send({ success: false,msg:"No Cases Found ", data: find });
            } else {
                //send otp work here 
                const message = "Cases Found successfully";
               return  res.status(200).send({ success: true, msg: message, data: find });
            }

        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },

}


