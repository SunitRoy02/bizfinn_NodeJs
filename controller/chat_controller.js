const chat = require('../models/chat');




module.exports = {
    sendMessage : async (data) => {
        try {


            let reqData = req.body;
            reqData.read = false;

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


 

}


