import UserModel from "../models/User.js";
import User from "../models/User.js";

import mongoose from "mongoose";

export const checkInfoComplete = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Make sure authMiddleware adds `req.user.id`

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if basic info is complete
    const basicFields = [
      user.age,
      user.gender,
      user.race,
      user.religion,
      user.education,
      user.urban,
      user.familysize,
      user.married,
      user.major,
    ];

    const needsBasicInfo = basicFields.some(
      (field) => field === undefined || field === null
    );

    // Check if personality is complete
    const personality = user.personality || {};
    const personalityKeys = Object.keys(personality);

    const hasAllTraits =
      personalityKeys.length === 10 &&
      Object.values(personality).every((val) => typeof val === "number");

    const needsPersonality = !hasAllTraits;

    // Send the response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      needsBasicInfo,
      needsPersonality,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updateData = {};
    const personalityUpdates = req.body.personality || {};
    const personalityMap = {
      item1: "Extraverted - enthusiastic",
      item2: "Critical - quarrelsome",
      item3: "Dependable - self-disciplined",
      item4: "Anxious - easily upset",
      item5: "Open to new experiences - complex",
      item6: "Reserved - quiet",
      item7: "Sympathetic - warm",
      item8: "Disorganized - careless",
      item9: "Calm - emotionally stable",
      item10: "Conventional - uncreative",
    };


    // 1️⃣ Flatten personality updates (if any)
    for (const key in personalityUpdates) {
      const mappedKey = personalityMap[key];
      if (mappedKey) {
        updateData[`personality.${mappedKey}`] = personalityUpdates[key];
      }
    }

    // 2️⃣ Add any other top-level fields (basic info)
    const topLevelFields = [
      "name",
      "age",
      "gender",
      "race",
      "religion",
      "education",
      "urban",
      "familysize",
      "married",
      "major",
    ];

    for (const field of topLevelFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // 3️⃣ Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserInfo = async (req, res) => {
  const {patientId} = req.params;
  try {
    console.log("Fetching patient info for patientId:", patientId);
    const PatientInfo = await UserModel.findOne({ patientId });
    console.log("Patient info found:", PatientInfo);

    if (!PatientInfo || PatientInfo.length === 0) {
      return res.status(404).json({ message: 'No PatientInfo found for this patient.' });
    }
    res.status(200).json({ PatientInfo });
  } catch (err) {
    console.error('Error fetching PatientInfo:', err);
    res.status(500).json({ message: 'Internal server error while fetching sleep PatientInfo.' });
  }
}

export const editUserProfile = async (req, res) => {
  const { patientId } = req.params; // patientId from route
  const updatedData = req.body;

  try {
    const user = await User.findOne({patientId:patientId});

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields (only what exists in req.body)
    Object.keys(updatedData).forEach((key) => {
      user[key] = updatedData[key];
    });

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      updatedUser: user,
    });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile.', error: err.message });
  }
};

export const retakePersonality = async (req, res) => {
  const { patientId } = req.params;
  const traitData = req.body;

  console.log('📨 Received traitData:', traitData);

  const personalityMap = {
    item1: "Extraverted - enthusiastic",
    item2: "Critical - quarrelsome",
    item3: "Dependable - self-disciplined",
    item4: "Anxious - easily upset",
    item5: "Open to new experiences - complex",
    item6: "Reserved - quiet",
    item7: "Sympathetic - warm",
    item8: "Disorganized - careless",
    item9: "Calm - emotionally stable",
    item10: "Conventional - uncreative",
  };

  try {
    const user = await User.findOne({ patientId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Map traitData to the correct personality format
    const mappedPersonality = {};
    for (const key in traitData) {
      if (personalityMap[key]) {
        mappedPersonality[personalityMap[key]] = traitData[key];
      }
    }

    console.log('🧠 Mapped personality:', mappedPersonality);

    // Store in user.personality
    user.personality = mappedPersonality;

    await user.save();

    res.status(200).json({
      message: 'Personality traits updated successfully.',
      updatedUser: user,
    });

  } catch (err) {
    console.error('❌ Error updating personality:', err);
    res.status(500).json({ message: 'Failed to update personality traits.', error: err.message });
  }
};
