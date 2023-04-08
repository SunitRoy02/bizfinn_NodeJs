const { validationResult } = require('express-validator');
const inquery = require('../models/queryContact');

module.exports = {

    getAllQuery: async (req, res) => {
        const queryData = await inquery.find({});
        res.status(200).send({ success: true, data: queryData });
    },

    addQuery: async (req, res) => {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array() });
            }

            let data = new inquery(req.body);
            let result = await data.save();
            // console.log(result);

            const msfIfSuccess = "Banner Added Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }


    },

    deleteQuery: async (req, res) => {

        try {
            var id = req.params.id;
            const query = { _id: id };
            const result = await inquery.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Query Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            }else{
                const msg = "No matched Query found ";
                res.status(201).send({ success: false, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },
}