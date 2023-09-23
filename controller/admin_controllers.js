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
      console.log(all_cases_type);

      const totalValue = await calculateReq();


      // Send the response with the rejected_chart object
      res.json({ total_origination_value: totalValue, all_cases_chart: all_cases_type, approved_chart: approved_cases, rejection_chart: rejection_reason, });


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
  let totalRequirement;

    return totalRequirement;
}
