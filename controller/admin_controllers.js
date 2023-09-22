const { validationResult } = require('express-validator');
// const lenders = require('../models/lenders');
const users = require('../models/users');
const cases = require('../models/cases');
const { ObjectId } = require('mongodb');




module.exports = {

    dashbord: async (req, res) => {
        try {
           
                const allCases = await cases.find({});

                //Rejection reason graph data
                const rejection_reason = errorGraphCount(lenderRemarksToCount, allCases);
                console.log(rejection_reason);

                

                    // Send the response with the rejected_chart object
                    res.json({ rejection_reason });
            

        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ status: false, msg: error });
        }
    },



}

const lenderRemarksToCount = [
    'Incomplete data',
    'Low CIBIL',
    'High Leverage',
    'Low Runway',
];

function errorGraphCount(remarksToCount, data) {
    // Create an object to store the counts of each lender remark
    const remarkCounts = {};
  
    // Initialize the counts to 0 for all lender remarks
    for (const remark of remarksToCount) {
      remarkCounts[remark] = 0;
    }
  
    // Iterate through the data and count the occurrences of lender remarks
    for (const item of data) {
      if (item.status === 3) {
        const lenderRemark = item.lender_remark;
        if (remarksToCount.includes(lenderRemark)) {
          remarkCounts[lenderRemark]++;
        }
      }
    }
  
    // Create the desired mapping
    const remarkMapping = {};
    for (const remark of remarksToCount) {
      // Convert the remark to lowercase and replace spaces with underscores
      const formattedRemark = remark.toLowerCase().replace(/ /g, '_');
      remarkMapping[formattedRemark] = remarkCounts[remark];
    }
  
    return remarkMapping;
  }
  
