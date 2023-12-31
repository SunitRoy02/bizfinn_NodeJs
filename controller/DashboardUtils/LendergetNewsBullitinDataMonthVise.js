const cases = require("../../models/cases");

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

module.exports = {
    get6MData: async (lenderId) => {
        try {
            //For 1year
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            //For last 6month
            const startOfMonth = new Date(currentYear, currentMonth - 6, 1);
            const endOfMonth = new Date(currentYear, currentMonth, 0);
            console.log(startOfMonth, endOfMonth);

            const result = await cases.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfMonth,
                            $lte: endOfMonth
                        }
                    }
                },
                {
                    $unwind: "$lenders"
                },
                {
                    $match: {
                        "lenders.lenderId": lenderId
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        approved_amount: { $sum: "$lenders.approved_amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        approved_amount: 1
                    }
                }
            ]);

            console.log('result', result);

            let monthlyData = {};

            const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

            // Create a list of the last 6 months
            const last6Months = months.slice(currentMonth - 6, currentMonth);

            last6Months.forEach(monthName => {
                monthlyData[monthName] = {
                    gross_transaction: 0,
                };
            });

            result.forEach(item => {
                const monthName = getMonthName(item.month);
                if (last6Months.includes(monthName)) {
                    monthlyData[monthName] = { "gross_transaction": item.approved_amount };
                }
            });

            console.log(monthlyData);


            return monthlyData;
        } catch (error) {
            console.log(error);
            return error
        }

    },
    getY_YData: async (lenderId) => {

        try {
            //For 1year
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            //For last 6month
            const startOfMonth = new Date(currentYear, currentMonth - 6, 1);
            const endOfMonth = new Date(currentYear, currentMonth, 0);
            console.log(startOfMonth, endOfMonth);

           

            const result = await cases. aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfYear,
                            $lte: endOfYear
                        }
                    }
                },
                {
                    $unwind: "$lenders"
                },
                {
                    $match: {
                        "lenders.lenderId": lenderId
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        approved_amount: { $sum: "$lenders.approved_amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        approved_amount: 1
                    }
                }
            ])
            console.log('result', result);

            let monthlyData = {};

            const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

            months.forEach(monthName => {
                monthlyData[monthName] = {
                    gross_transaction: 0,
                };
            });

            result.forEach(item => {
                const monthName = getMonthName(item.month);
                monthlyData[monthName] = { "gross_transaction": item.approved_amount, };
            });

            console.log(monthlyData);

            return monthlyData;
        } catch (error) {
            console.log(error);
            return error
        }
    },
    getYTD_Data: async (lenderId) => {
        try {
            const today = new Date(currentYear, currentMonth, 0); // Get the last day of the current month

            // Calculate the start of the year
            const startOfYear = new Date(currentYear, 0, 1);

            console.log(startOfYear, today);

            const result = await cases.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfYear,
                            $lte: today
                        }
                    }
                },
                {
                    $unwind: "$lenders"
                },
                {
                    $match: {
                        "lenders.lenderId": lenderId
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        approved_amount: { $sum: "$lenders.approved_amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        approved_amount: 1
                    }
                }
            ]);

            console.log('result', result);

            let monthlyData = {};

            const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

            // Create a list of months from the start of the year till the current month
            const monthsInRange = months.slice(0, currentMonth);

            monthsInRange.forEach(monthName => {
                monthlyData[monthName] = {
                    gross_transaction: 0,
                };
            });

            result.forEach(item => {
                const monthName = getMonthName(item.month);
                if (monthsInRange.includes(monthName)) {
                    monthlyData[monthName] = { "gross_transaction": item.approved_amount };
                }
            });

            console.log(monthlyData);

            return monthlyData;

        }
        catch (error) {
            console.log(error);
        }
    },
    getQuarterdata: async (lenderId) => {
        try {

            // Determine the current quarter
            let quarterStartMonth;
            if (currentMonth <= 3) {
                quarterStartMonth = 1; // January to March
            } else if (currentMonth <= 6) {
                quarterStartMonth = 4; // April to June
            } else if (currentMonth <= 9) {
                quarterStartMonth = 7; // July to September
            } else {
                quarterStartMonth = 10; // October to December
            }

            const today = new Date(currentYear, currentMonth, 0); // Get the last day of the current month
            const startOfQuarter = new Date(currentYear, quarterStartMonth - 1, 1);

            console.log(startOfQuarter, today);

            const result = await cases.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfQuarter,
                            $lte: today
                        }
                    }
                },
                {
                    $unwind: "$lenders"
                },
                {
                    $match: {
                        "lenders.lenderId": lenderId
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        approved_amount: { $sum: "$lenders.approved_amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        approved_amount: 1
                    }
                }
            ]);

            console.log('result', result);

            let monthlyData = {};

            const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

            // Create a list of months within the current quarter
            const currentQuarterMonths = months.slice(quarterStartMonth - 1, currentMonth);

            // If the current month is the first or second month of the quarter, populate the other months as zero
            if (currentMonth === quarterStartMonth || currentMonth === quarterStartMonth + 1) {
                months.forEach(monthName => {
                    monthlyData[monthName] = {
                        gross_transaction: 0,
                    };
                });
            }

            currentQuarterMonths.forEach(monthName => {
                monthlyData[monthName] = {
                    gross_transaction: 0,
                };
            });

            result.forEach(item => {
                const monthName = getMonthName(item.month);
                if (currentQuarterMonths.includes(monthName)) {
                    monthlyData[monthName] = { "gross_transaction": item.approved_amount };
                }
            });

            console.log(monthlyData);

            const currentMonth_1 = new Date().getMonth();

            // Determine the start month of the current quarter
            const startMonth_1 = Math.floor(currentMonth_1 / 3) * 3;

            // Extract the data for the three months of the current quarter
            const currentQuarterData = {};

            for (let i = startMonth_1; i < startMonth_1 + 3; i++) {
                const monthKey = Object.keys(monthlyData)[i];
                currentQuarterData[monthKey] = monthlyData[monthKey];
            }

            return currentQuarterData;

        } catch (error) {
            console.log(error);
        }
    },
    getCurrentMonthData: async (lenderId) => {
        // Calculate the current and previous month

        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

        // Calculate the first and last day of the previous month
        const previousMonthDate = new Date(currentYear, currentMonth - 2, 1);
        const firstDayOfPreviousMonth = new Date(currentYear, currentMonth - 2, 1);
        const lastDayOfPreviousMonth = new Date(currentYear, currentMonth - 1, 0);

        console.log("Current Month Dates:", firstDayOfMonth, lastDayOfMonth);
        console.log("Previous Month Dates:", firstDayOfPreviousMonth, lastDayOfPreviousMonth);

        const resultCurrentMonth = await cases.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $unwind: "$lenders"
            },
            {
                $match: {
                    "lenders.lenderId": lenderId
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    approved_amount: { $sum: "$lenders.approved_amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    approved_amount: 1
                }
            }
        ]);

        const resultPreviousMonth = await cases.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: firstDayOfPreviousMonth,
                        $lte: lastDayOfPreviousMonth
                    }
                }
            },
            {
                $unwind: "$lenders"
            },
            {
                $match: {
                    "lenders.lenderId": lenderId
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    approved_amount: { $sum: "$lenders.approved_amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    approved_amount: 1
                }
            }
        ]);

        const monthlyData = {};

        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        // Create an object with the current and previous months
        monthlyData[months[currentMonth - 1]] = {
            gross_transaction: 0,
        };

        monthlyData[months[currentMonth - 2]] = {
            gross_transaction: 0,
        };

        resultCurrentMonth.forEach(item => {
            const monthName = getMonthName(item.month);
            if (monthName === months[currentMonth - 1]) {
                monthlyData[monthName] = { "gross_transaction": item.approved_amount };
            }
        });

        resultPreviousMonth.forEach(item => {
            const monthName = getMonthNameM_M(item.month);
            if (monthName === months[currentMonth - 2]) {
                monthlyData[monthName] = { "gross_transaction": item.approved_amount };
            }
        });

        console.log("Monthly Data:", monthlyData);

        return monthlyData;

        // Function to get the month name from a month number
    }
}

const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec"
];

function getMonthNameM_M(monthNumber) {
    const date = new Date(currentYear, monthNumber - 1, 1); // Subtracting 1 because months are 0-based
    return months[date.getMonth()];
}


function getMonthName(monthNumber) {
    const months = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    return months[monthNumber - 1]; // Adjust for 0-based index
}