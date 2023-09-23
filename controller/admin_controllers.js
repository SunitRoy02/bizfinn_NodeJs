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

      const d = {
        approved : 0,
        rejected : 0,
        progress : 0
      };

      const dummyData = {
        jan : d,
        feb : d,
        mar : d,
        apr : d,
        may : d,
        jun : d,
        jul : d,
        aug : d,
        sep : d,
        oct : d,
        nov : d,
        dec : d,
      }

      res.json(
        { 
        total_origination_value: totalValue,
        gross_transaction_value: 0,
        active_cases_count: activeCases,
        gross_revenue: 0,

        growth_statistics_year : dummyData,
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
