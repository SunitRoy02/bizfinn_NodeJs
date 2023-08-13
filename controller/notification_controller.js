const { validationResult } = require('express-validator');
const notification = require('../models/notifications');


module.exports = {
    createNotification: async (req, res) => {
        try {

            let reqData = req.body;
            reqData.read = false;

            let data = new notification(reqData);
            let result = await data.save();

            const msfIfSuccess = "Notification Sent Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },


    readNotification: async (req, res) => {
        try {

            // Update documents where read=false
            const result = await notification.updateMany(
                { "read": false,
                 "userId": req.params.userId
             },
                { $set: { "read": true } }
            );
            const message = "Notifications Found successfully";
            res.status(200).send({ success: true, result : result  });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });

        }

    },

    getNotifications: async (req, res) => {
        try {        
            const find = await notification.find({ userId: req.body.userId })

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

    deleteNotification: async (req, res) => {
        try {
            var id = req.params.notiId;
            const query = { _id: id };
            const result = await notification.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Notification Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            } else {
                const msg = "No matched Notification found ";
                res.status(201).send({ success: false, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    }

}


