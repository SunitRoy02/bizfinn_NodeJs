const cases = require("../../models/cases");
const getNewsBullitinDataMonthVise = require("./getNewsBullitinDataMonthVise");


const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

module.exports = {
    getDisbursementMonthVise: async () => {
         try {
            const sixMonthData = await getNewsBullitinDataMonthVise.get6MData()

            const year_to_yearData = await getNewsBullitinDataMonthVise.getY_YData()

            const year_to_todayData = await getNewsBullitinDataMonthVise.getYTD_Data()

            const quarterData = await getNewsBullitinDataMonthVise.getQuarterdata()

            const month_monthData= await getNewsBullitinDataMonthVise.getCurrentMonthData()

            console.log(year_to_yearData);
            return({ sixMonthData ,year_to_yearData ,year_to_todayData ,quarterData ,month_monthData})
         } catch (error) {
            console.log(error);
            return error
        }
    },
    getLoanStatus: async () => {

        const startOfMonth = new Date(currentYear, currentMonth - 6, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0);

        const approvedCount = await cases.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    },
                    status: 1,
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
                    status: 2,
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
                    status: { $in: [0, 3] },
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
    getGrowthStatics: async () => {
        try {
            //For 1year
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            //For last 6month
            // const startOfMonth = new Date(currentYear, currentMonth - 6, 1);
            // const endOfMonth = new Date(currentYear, currentMonth, 0);
            // console.log(startOfMonth, endOfMonth);

            const result = await cases.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfYear,
                            $lte: endOfYear
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        requirement: { $sum: "$requirement" },
                        approved_amount: { $sum: "$approved_amount" },
                        case_comissioned_amount: { $sum: "$case_comissioned_amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        requirement: 1,
                        approved_amount: 1,
                        case_comissioned_amount: 1
                    }
                }
            ]);

            console.log('result', result);

            let monthlyData = {};

            const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

            months.forEach(monthName => {
                monthlyData[monthName] = {
                    disbursement: 0,
                    gross_transaction: 0,
                    gross_revenue: 0
                };
            });

            result.forEach(item => {
                const monthName = getMonthName(item.month);
                monthlyData[monthName] = { "disbursement": item.requirement, "gross_transaction": item.approved_amount, 'gross_revenue': item.case_comissioned_amount };
            });

            console.log(monthlyData);

            return monthlyData;
        } catch (error) {
            console.log(error);
            return error
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