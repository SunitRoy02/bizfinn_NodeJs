const { validationResult } = require('express-validator');
// const lenders = require('../models/lenders');
const users = require('../models/users');
const cases = require('../models/cases');
const { ObjectId } = require('mongodb');




module.exports = {

  dashbord: async (req, res) => {
    try {

      const {lenderId} = req.params;
      let filterBody = {};
      if(lenderId){
        filterBody = { 'lenders.lenderId': ObjectId(lenderId)  };
      }

      const allCases = await cases.find({});

      //Rejection reason graph data
      const rejection_reason = errorGraphCount(lenderRemarksToCount, allCases, 3);
      console.log(rejection_reason);
      //Approved graph data
      const approved_cases = approveGraphCount(typesOfLoan, allCases, 2);
      console.log(approved_cases);
      //AllType Of  graph data
      const all_cases_type = allGraphCount(typesOfLoan, allCases,);
      console.log(allCases);

      const totalValue = await calculateReq(allCases);
      console.log('TOtal >>>',totalValue);
      const activeCases = await activeCasesCount(allCases);
      console.log('Acive Cases >>>',activeCases);
      // Send the response with the rejected_chart object
      const dummyData = {
        jan : {
          approved : 5,
          rejected : 7,
          progress : 3
        },
        feb : {
          approved : 5,
          rejected : 4,
          progress : 6
        },
        mar : {
          approved : 2,
          rejected : 4,
          progress : 5
        },
        apr :{
          approved : 6,
          rejected : 3,
          progress : 4
        },
        may : {
          approved : 4,
          rejected : 5,
          progress : 6
        },
        jun : {
          approved : 2,
          rejected : 5,
          progress : 1
        },
        jul : {
          approved : 2,
          rejected : 3,
          progress : 4
        },
        aug : {
          approved : 0,
          rejected : 0,
          progress : 0
        },
        sep : {
          approved : 0,
          rejected : 0,
          progress : 0
        },
        oct : {
          approved : 0,
          rejected : 0,
          progress : 0
        },
        nov : {
          approved : 0,
          rejected : 0,
          progress : 0
        },
        dec : {
          approved : 0,
          rejected : 0,
          progress : 0
        },
      };

      const kummyData = {
        jan : {
          gross_revenue : 23,
          gross_transaction : 32,
          disbursement : 23
        },
        feb : {
          gross_revenue : 43,
          gross_transaction : 23,
          disbursement : 34
        },
        mar : {
          gross_revenue : 23,
          gross_transaction : 34,
          disbursement : 53
        },
        apr : {
          gross_revenue : 93,
          gross_transaction : 12,
          disbursement : 32
        },
        may : {
          gross_revenue : 42,
          gross_transaction : 52,
          disbursement : 24
        },
        jun : {
          gross_revenue : 32,
          gross_transaction : 52,
          disbursement : 12
        },
        jul : {
          gross_revenue : 0,
          gross_transaction : 0,
          disbursement : 0
        },
        aug : {
          gross_revenue : 0,
          gross_transaction : 0,
          disbursement : 0
        },
        sep : {
          gross_revenue : 0,
          gross_transaction : 0,
          disbursement : 0
        },
        oct : {
          gross_revenue : 0,
          gross_transaction : 0,
          disbursement : 0
        },
        nov : {
          gross_revenue : 0,
          gross_transaction : 0,
          disbursement : 0
        },
        dec : {
          gross_revenue : 0,
          gross_transaction : 0,
          disbursement : 0
        },
      }

      res.json(
        { 
        total_origination_value: totalValue,
        gross_transaction_value: 0,
        active_cases_count: activeCases,
        gross_revenue: 0,

        growth_statistics_year : kummyData,
        loan_status_year : dummyData,

        total_origination_value: totalValue,
        all_cases_chart: all_cases_type,
        approved_chart: approved_cases, 
        rejection_chart: rejection_reason, 
      });


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

const typesOfLoan = [
  'Unsecured Short term loan',
  'Vendor Financing',
  'Sales Bill discounting',
  'EXIM Financing',
  'Scured Term Loan',
  'Credit Line Or OD',
  'Other',
];

function errorGraphCount(remarksToCount, data, status) {
  // Create an object to store the counts of each lender remark
  const remarkCounts = {};

  // Initialize the counts to 0 for all lender remarks
  for (const remark of remarksToCount) {
    remarkCounts[remark] = 0;
  }

  // Iterate through the data and count the occurrences of lender remarks
  for (const item of data) {
    if (item.status === status) {
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

function approveGraphCount(remarksToCount, data, status) {
  // Create an object to store the counts of each lender remark
  const remarkCounts = {};

  // Initialize the counts to 0 for all lender remarks
  for (const remark of remarksToCount) {
    remarkCounts[remark] = 0;
  }

  // Iterate through the data and count the occurrences of lender remarks
  for (const item of data) {
    if (item.status === status) {
      const lenderRemark = item.type_of_loan;
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

function allGraphCount(remarksToCount, data,) {
  // Create an object to store the counts of each lender remark
  const remarkCounts = {};

  // Initialize the counts to 0 for all lender remarks
  for (const remark of remarksToCount) {
    remarkCounts[remark] = 0;
  }

  // Iterate through the data and count the occurrences of lender remarks
  for (const item of data) {
    const lenderRemark = item.type_of_loan;
    if (remarksToCount.includes(lenderRemark)) {
      remarkCounts[lenderRemark]++;
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


async function calculateReq( data ) {
  let totalRequirement = 0;
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i].requirement === 'number') {
      totalRequirement += data[i].requirement;
    }
  }
  return totalRequirement;
}

async function activeCasesCount( data ) {
  let activeCases = 0;
  for (let i = 0; i < data.length; i++) {
    if(data[i].status === 1){
        activeCases ++ ;
    }
  }
  return activeCases;
}
