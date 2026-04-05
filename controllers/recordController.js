import FinancialRecord from "../models/FinancialRecord.js";
import validator from "validator";



// Create financial Record


export const createRecord = async (req, res) => {

  try {

    const {
      amount,
      type,
      category,
      date,
      notes
    } = req.body;

    // Validation

    if (!amount || !type || !category || !date) {

      return res.status(400).json({
        message: "All required fields must be filled"
      });

    }

    if (!["income", "expense"].includes(type)) {

      return res.status(400).json({
        message: "Type must be income or expense"
      });

    }

    if (!validator.isNumeric(amount.toString())) {

      return res.status(400).json({
        message: "Amount must be numeric"
      });

    }

    const record =
      await FinancialRecord.create({

        amount,
        type,
        category,
        date,
        notes,
        createdBy: req.user._id

      });

    res.status(201).json(record);

  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// Get financial Records (Filter + Pagination)


export const getRecords = async (req, res) => {

  try {

    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 5
    } = req.query;

    let filter = {};

    if (type)
      filter.type = type;

    if (category)
      filter.category = category;

    if (startDate && endDate) {

      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };

    }

    const skip =
      (page - 1) * limit;

    const records =
      await FinancialRecord.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ date: -1 });

    const total =
      await FinancialRecord.countDocuments(filter);

    res.json({

      totalRecords: total,
      currentPage: Number(page),
      records

    });

  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// Update fianacial Record


export const updateRecord = async (req, res) => {

  try {

    const record =
      await FinancialRecord.findById(req.params.id);

    if (!record) {

      return res.status(404).json({
        message: "Record not found"
      });

    }

    //  Authorization check

if (record.createdBy.toString() !== req.user._id.toString()) {

  return res.status(403).json({
    message: "Not authorized"
  });

}

    const updatedRecord =
      await FinancialRecord.findByIdAndUpdate(

        req.params.id,
        req.body,
        { returnDocument: "after" }

      );

    res.json(updatedRecord);

  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// Delete the record

export const deleteRecord = async (req, res) => {

  try {

    const record =
      await FinancialRecord.findById(req.params.id);

    if (!record) {

      return res.status(404).json({
        message: "Record not found"
      });

    }

    //  Authorization check

if (record.createdBy.toString() !== req.user._id.toString()) {

  return res.status(403).json({
    message: "Not authorized"
  });

}

    await FinancialRecord.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Record deleted successfully"
    });

  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};