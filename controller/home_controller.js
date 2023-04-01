const { validationResult } = require('express-validator');
const banners = require('../models/banner');

module.exports = {

    bannersFun: async (req, res) => {

        const bannrsData = await banners.find({});
        res.status(200).send({ success: true, data: bannrsData });



    },


    updateBanner : async (req,res) => {
        console.log('UpdateRequest',req.body);
        
        const filter = {_id : req.body.id};
        var newvalues = {imageUrl: req.body.imageUrl };
        const bannrsData = await banners.findOneAndUpdate(filter,newvalues);
        res.status(200).send({ success: true, data: bannrsData});
    },

    addBanner: async (req, res) => {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            let data = new banners(req.body);
            let result = await data.save();
            console.log(result);

            const msfIfSuccess = "Banner Added Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }


    },

    deleteBanner: async (req, res) => {

        try {
            var id = req.params.id;
            const query = { _id: id };
            const result = await banners.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Banner Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            }else{
                const msg = "No matched banner found ";
                res.status(201).send({ success: true, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },
}