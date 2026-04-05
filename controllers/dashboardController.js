import FinancialRecord from "../models/FinancialRecord.js";



// Get Dashboard Summary

const Record=FinancialRecord
export const getDashboardSummary = async (req, res) => {

  try {

    
    // Total Income
    

    const totalIncomeResult =
      await Record.aggregate([

        { $match: { type: "income" } },

        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }

      ]);

    const totalIncome =
      totalIncomeResult.length > 0
        ? totalIncomeResult[0].total
        : 0;



    
    // Total Expense
    

    const totalExpenseResult =
      await Record.aggregate([

        { $match: { type: "expense" } },

        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }

      ]);

    const totalExpense =
      totalExpenseResult.length > 0
        ? totalExpenseResult[0].total
        : 0;



    
    // Net Balance
    
    const netBalance =
      totalIncome - totalExpense;



    
    // Category Wise Totals
    

    const categoryTotals =
      await Record.aggregate([

        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        }

      ]);



    
    // Weekly Trends
    

    const weeklyTrends =
      await Record.aggregate([

        {
          $group: {
            _id: {
              week: { $week: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },

        {
          $sort: {
            "_id.week": 1
          }
        }

      ]);



    
    // Monthly Trends
    

    const monthlyTrends =
      await Record.aggregate([

        {
          $group: {
            _id: {
              month: { $month: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },

        {
          $sort: {
            "_id.month": 1
          }
        }

      ]);



    
    // Yearly Trends
    

    const yearlyTrends =
      await Record.aggregate([

        {
          $group: {
            _id: {
              year: { $year: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },

        {
          $sort: {
            "_id.year": 1
          }
        }

      ]);



    
    // Send Response
    

    res.json({

      totalIncome,
      totalExpense,
      netBalance,

      categoryTotals,

      weeklyTrends,
      monthlyTrends,
      yearlyTrends

    });

  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Get Recent Records


export const getRecentRecords = async (req, res) => {

  try {

    // Get latest 5 records
    const recentRecords =
      await Record.find()
        .sort({ date: -1 })   // newest first
        .limit(5);            // only 5 records

    res.json(recentRecords);

  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};