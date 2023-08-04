const { validationResult } = require('express-validator');
const borrower = require('../models/borrower');


function generateRandomSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


module.exports = {
    createLender: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await lenders.find({ email: req.body.email })
            // console.log("Find IN Register >>> ", find);
            if (find.length === 0) {

                let reqData = req.body;
                reqData.case_logged = 0;
                reqData.case_approved = 0;
                reqData.case_pending = 0;


                reqData.lender_id = generateRandomSixDigitNumber();

                reqData.createdAt = new Date().toLocaleString();
                let data = new lenders(reqData);
                let result = await data.save();
                // console.log(result);

                const msfIfSuccess = "Lender Created Successfully";
                res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

            } else {
                const msfIferror = "Lender Already Exixts";
                res.status(400).send({ success: false, msg: msfIferror });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }


    },

    getLenders: async (req, res) => {
        try {

            const find = await lenders.find({ })
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


    getSingleLender: async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            const find = await lenders.find({ _id: req.body.lenderId })
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

            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
                // return res.status(400).send({ success: false, errors: errors.array()[0] });
            // }

            res.status(200).send(req.body);

            // const find = await users.find({ _id: req.body.userId })
            // if (find.length === 0) {
            //     const msfIferror = "User not found";
            //     res.status(400).send({ success: false, msg: msfIferror });

            // } else {

            //     let reqData = req.body;
            //     // let img = req.file;
            //     reqData.updatedAt = new Date().toLocaleString();
            //     users.findByIdAndUpdate(req.body.userId, req.body, { new: true }, (err, updatedDoc) => {
            //         if (err) {
            //             // console.error(err);  
            //             const message = "Unexpected Error Found";
            //             res.status(200).send({ success: true, msg: err });
                    
            //         } else {
            //             // console.log(updatedDoc);
            //             const message = "User Updated successfully";
            //             res.status(200).send({ success: true, msg: message, data : updatedDoc });
            //         }
            //     });




            // }


        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },


    deleteLeander: async (req, res) => {
        try {
            var id = req.params.lenderId;
            const query = { _id: id };
            const result = await lenders.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Lender Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            }else{
                const msg = "No matched lender found ";
                res.status(201).send({ success: false, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },

}


