const asynchandler = require("express-async-handler");
const response = require("../Middleware/responseMiddlewares");
const OnboardingDetailsModel = require("../Model/OnboardingDetailsModel");
const cloudinary = require("../Middleware/Cloudinary");
const fs = require("fs");
const path = require("path");

const getOnboarding = asynchandler(async (req, res) => {
  try {
    const { jobId, studentId, companyId } = req.params;
    if (!jobId || !studentId || !companyId) {
      return response.notFoundError(
        res,
        "jobId, studentId, and companyId are required"
      );
    }
    let onboardingDetails = await OnboardingDetailsModel.findOne({
      JobId: jobId,
      StudentId: studentId,
      CompanyId: companyId,
    })
      .populate("CompanyId")
      .populate("StudentId")
      .populate("JobId");
    if (!onboardingDetails) {
      onboardingDetails = new OnboardingDetailsModel({
        JobId: jobId,
        StudentId: studentId,
        CompanyId: companyId,
        currentStep: "Personal Information",
      });

      await onboardingDetails.save();
    }

    return response.successResponse(
      res,
      onboardingDetails,
      "Get Onboarding successfull"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});



const updateOnboarding = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;

    const onboardingDetails = await OnboardingDetailsModel.findById(id);
    if (!onboardingDetails) {
      return response.errorResponse(res, "Onboarding details not found", 404);
    }

    // List of non-file fields that can be updated from req.body
    const fieldKeys = [
      "fullName",
      "contactInformation",
      "residentialAddress",
      "jobTitle",
      "department",
      "startDate",
      "emailAccount",
      "softwareAccess",
      "teamIntroduction",
      "reportingStructure",
    ];

    // Update fields from req.body if present
    fieldKeys.forEach((key) => {
      if (req.body[key]) {
        onboardingDetails[key] = req.body[key];
      }
    });

    // Helper function to upload files and delete from the local folder
    const uploadFile = async (fileKey) => {
      if (req.files && req.files[fileKey] && req.files[fileKey][0]) {
        const filePath = req.files[fileKey][0].path;
        const uploadedFile = await cloudinary.uploader.upload(filePath, {
          folder: "GetHire",
        });

        // Delete the file from the local server after uploading to Cloudinary
        if (uploadedFile) {
          fs.unlink(filePath, (err) => {
            if (err) console.log(`Failed to delete file: ${filePath}`, err);
          });
          return uploadedFile.secure_url;
        }
      }
      return null;
    };

    // List of document keys that require file uploads
    const documentKeys = [
      "employmentContract",
      "nda",
      "taxForms",
      "panCard",
      "aadharCard",
      "salarySlip",
      "bankStatement",
      "additionalDocument",
      "additionalDocument2",
      "offerLetterTemplate",
      "employeeHandbook",
      "roleSpecificTraining",
      "orientationSchedule",
    ];

    // Update document fields with uploaded files if present
    for (const key of documentKeys) {
      const uploadedUrl = await uploadFile(key);
      if (uploadedUrl) {
        onboardingDetails[key] = uploadedUrl;
      }
    }

    await onboardingDetails.save();
    response.successResponse(res, onboardingDetails, "Onboarding Updated");
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

module.exports = { getOnboarding, updateOnboarding };
