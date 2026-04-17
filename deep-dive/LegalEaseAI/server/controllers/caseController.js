import Case from "../models/Case.js";
import { mockCases } from "../config/mockDB.js";

export const getCases = async (req, res) => {
  try {
    // Return cases for the authenticated user
    let cases;
    if (global.useMockDB) {
      cases = mockCases.filter(c => c.user === req.auth.user._id.toString());
    } else {
      cases = await Case.find({ user: req.auth.user._id }).sort({ createdAt: -1 });
    }
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

export const createCase = async (req, res) => {
  try {
    const { caseId, name, type, attorney, status, priority, date } = req.body;
    
    if (global.useMockDB) {
      const newCase = {
        _id: Date.now().toString(),
        caseId,
        name,
        type,
        attorney,
        status,
        priority,
        date,
        user: req.auth.user._id.toString()
      };
      mockCases.push(newCase);
      if (global.saveMockData) global.saveMockData();
      res.status(201).json(newCase);
    } else {
      const newCase = new Case({
        caseId,
        name,
        type,
        attorney,
        status,
        priority,
        date,
        user: req.auth.user._id
      });
      await newCase.save();
      res.status(201).json(newCase);
    }
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to create case" });
  }
};

export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCase = await Case.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json(updatedCase);
  } catch (error) {
    res.status(400).json({ error: "Failed to update case" });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCase = await Case.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!deletedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete case" });
  }
};
