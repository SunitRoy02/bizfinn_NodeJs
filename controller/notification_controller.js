const { validationResult } = require('express-validator');
const notification = require('../models/notifications');


module.exports = {
    createNotification: async (req, res) => {
        try {

            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            //     return res.status(400).send({ success: false, errors: errors.array()[0] });
            // }

            let reqData = req.body;

            reqData.createdAt = new Date().toLocaleString();
            let data = new notification(reqData);
            let result = await data.save();

            const msfIfSuccess = "Notification Sent Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }


    },

    getNotifications: async (req, res) => {
        try {

            const find = await notification.find({ userId : req.body.userId })
           
                const message = "Notifications Found successfully";
                res.status(200).send({ success: true, msg: message, data: find });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },

    clearNotification: async (req, res) => {
        try {
            var id = req.body.userId;
            const query = { userId: id };
            console.log(query);
            const result = await notification.deleteMany(query);
            console.log(result);
            const msg = "Notifications Deleted Successfully";
            res.status(200).send({ success: true, msg: msg, });
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },

}


