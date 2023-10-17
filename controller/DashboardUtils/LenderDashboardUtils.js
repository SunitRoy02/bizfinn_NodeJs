const cases = require("../../models/cases");
const LendergetNewsBullitinDataMonthVise = require("./LendergetNewsBullitinDataMonthVise");


const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

module.exports = {
    getDisbursementMonthVise: async (lenderId) => {
        try {
            const sixMonthData = await LendergetNewsBullitinDataMonthVise.get6MData(lenderId)

            const year_to_yearData = await LendergetNewsBullitinDataMonthVise.getY_YData(lenderId)

            const year_to_todayData = await LendergetNewsBullitinDataMonthVise.getYTD_Data(lenderId)

            const quarterData = await LendergetNewsBullitinDataMonthVise.getQuarterdata(lenderId)

            const month_monthData = await LendergetNewsBullitinDataMonthVise.getCurrentMonthData(lenderId)

            console.log(year_to_yearData);
            return ({ sixMonthData, year_to_yearData, year_to_todayData, quarterData, month_monthData })
        } catch (error) {
            console.log(error);
            return error
        }
    },
    getLoanStatus: async (lenderId) => {

        const startOfMonth = new Date(currentYear, currentMonth - 6, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0);

        const approvedCount = await cases.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    },
                    "lenders.lander_approved": 1,
                    "lenders.lenderId": lenderId,
                    "lenders.approved": { $ne: 3 }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    approved: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    approved: 1,
                }
            }
        ])

        const rejectedCount = await cases.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    },
                    "lenders.approved": 3,
                    "lenders.lenderId": lenderId
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    rejected: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    rejected: 1,
                }
            }
        ])

        const progressCount = await cases.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    },
                    "lenders.lander_approved": { $in: [0, 3] },
                    "lenders.lenderId": lenderId
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    progress: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    progress: 1,
                }
            }
        ])


        const data = { approvedCount, rejectedCount, progressCount };


        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        const result = {};

        months.forEach(monthName => {
            result[monthName] = {
                approved: 0,
                rejected: 0,
                progress: 0
            };
        });

        for (const category in data) {
            data[category].forEach(item => {
                const monthName = months[item.month - 1];
                for (const key in item) {
                    if (key !== "month") {
                        result[monthName][key] = item[key];
                    }
                }
            });
        }
        console.log(result);
        return result;

    },
    getAllTypeOfLoanCount: async (lenderId) => {

        const allTypeOfLoan = await cases.aggregate([
            {
                $match: {
                    "lenders.lenderId": lenderId // Match documents with a lenderId in the lenders array equal to yourLenderId
                }
            },
            {
                $group: {
                    _id: "$type_of_loan",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type_of_loan: "$_id",
                    count: 1
                }
            },
            {
                $group: {
                    _id: null,
                    all_cases_chart: {
                        $push: {
                            k: "$type_of_loan",
                            v: "$count"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { all_cases_chart: { $arrayToObject: "$all_cases_chart" } }
                }
            }
        ]);

        const modifiedObject = {};

        const oldObeject = allTypeOfLoan[0].all_cases_chart

        for (const key in oldObeject) {
            if (oldObeject.hasOwnProperty(key)) {
                const newKey = key.toLowerCase().replace(/ /g, '_');
                modifiedObject[newKey] = oldObeject[key];
            }
        }

        console.log("modi", modifiedObject);

        return {
                unsecured_short_term_loan: getValueOrSetZero(modifiedObject.unsecured_short_term_loan),
                vendor_financing: getValueOrSetZero(modifiedObject.vendor_financing),
                sales_bill_discounting: getValueOrSetZero(modifiedObject.sales_bill_discounting),
                exim_financing: getValueOrSetZero(modifiedObject.exim_financing),
                scured_term_loan: getValueOrSetZero(modifiedObject.scured_term_loan),
                credit_line_or_od: getValueOrSetZero(modifiedObject.credit_line_or_od),
                other: getValueOrSetZero(modifiedObject.other)

            }

    },
    getLenderApprovedCount: async (lenderId) => {

        const allTypeOfLoan = await cases.aggregate([
            {
                $match: {
                    "lenders.lenderId": lenderId,
                    "lenders.lander_approved": 1,
                    "lenders.approved": { $ne: 3 }
                }
            },
            {
                $group: {
                    _id: "$type_of_loan",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type_of_loan: "$_id",
                    count: 1
                }
            },
            {
                $group: {
                    _id: null,
                    all_cases_chart: {
                        $push: {
                            k: "$type_of_loan",
                            v: "$count"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { all_cases_chart: { $arrayToObject: "$all_cases_chart" } }
                }
            }
        ]);

        const modifiedObject = {};

        const oldObeject = allTypeOfLoan[0]?.all_cases_chart

        for (const key in oldObeject) {
            if (oldObeject.hasOwnProperty(key)) {
                const newKey = key.toLowerCase().replace(/ /g, '_');
                modifiedObject[newKey] = oldObeject[key];
            }
        }

        console.log(modifiedObject);

        return {
                unsecured_short_term_loan: getValueOrSetZero(modifiedObject.unsecured_short_term_loan),
                vendor_financing: getValueOrSetZero(modifiedObject.vendor_financing),
                sales_bill_discounting: getValueOrSetZero(modifiedObject.sales_bill_discounting),
                exim_financing: getValueOrSetZero(modifiedObject.exim_financing),
                scured_term_loan: getValueOrSetZero(modifiedObject.scured_term_loan),
                credit_line_or_od: getValueOrSetZero(modifiedObject.credit_line_or_od),
                other: getValueOrSetZero(modifiedObject.other)

            }

    },
    getLenderRejectedCount: async (lenderId) => {

        const allTypeOfLoan = await cases.aggregate([
            {
                $match: {
                    "lenders.lenderId": lenderId,
                    "lenders.approved": 3
                }
            },
            {
                $group: {
                    _id: "$lender_remark",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    lender_remark: "$_id",
                    count: 1
                }
            },
            {
                $group: {
                    _id: null,
                    all_cases_chart: {
                        $push: {
                            k: "$lender_remark",
                            v: "$count"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { all_cases_chart: { $arrayToObject: "$all_cases_chart" } }
                }
            }
        ]);

        const modifiedObject = {};

        const oldObeject = allTypeOfLoan[0]?.all_cases_chart

        for (const key in oldObeject) {
            if (oldObeject.hasOwnProperty(key)) {
                const newKey = key.toLowerCase().replace(/ /g, '_');
                modifiedObject[newKey] = oldObeject[key];
            }
        }

        console.log("rej" ,modifiedObject);

        return {
                "incomplete_data": getValueOrSetZero(modifiedObject.incomplete_data),
                "low_cibil": getValueOrSetZero(modifiedObject.low_cibil),
                "high_leverage": getValueOrSetZero(modifiedObject.high_leverage),
                "low_runway": getValueOrSetZero(modifiedObject.low_runway),
              }
             

    },
}


function getMonthName(monthNumber) {
    const months = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    return months[monthNumber - 1]; // Adjust for 0-based index
}

function getValueOrSetZero(val1) {
    return val1 ? val1 : 0
}