const asynchandler = require('express-async-handler');
const response = require('../Middleware/responseMiddlewares');
const cloudinary = require("../Middleware/Cloudinary");
const CompanyModel = require('../Model/CompanyModel');
const JobModel = require('../Model/JobModel');
const JobApplyModel = require('../Model/JobApplyModel');
const StudentModel = require('../Model/StudentModel');
const TestModel = require('../Model/TestModel');


//=================================[Get all company]=============================

const GetAllcompany = asynchandler(async (req, res) => {
    try {

        const Getallcompanies = await CompanyModel.find()

        return response.successResponse(res, Getallcompanies, "Get All Companies")

    } catch (error) {
        console.log(error)
        return response.internalServerError(res, "Internal Server error")
    }
})


//=======================================[Get a Comapany ]===================================


const GetAcompany = asynchandler(async (req, res) => {
    try {

        const { id } = req.params

        const Getacompany = await CompanyModel.findById(id)

        return response.successResponse(res, Getacompany, "Get All Companies")

    } catch (error) {
        console.log(error)
        return response.internalServerError(res, "Internal Server error")
    }
})


//======================================[Get All Jobs of a company]========================

const Getjobsofacompany = asynchandler(async (req, res) => {
    try {

        const { id } = req.params

        const Getjobsofacompamny = await JobModel.find({ Company: id })

        return response.successResponse(res, Getjobsofacompamny, "Get jobs of a compamny sucessfull")

    } catch (error) {
        console.log(error)
        return response.internalServerError(res, "Internal Server error")
    }
})


//=================================[Get all Jobs]==============================

const GetAllJobs = asynchandler(async (req, res) => {
    try {

        const Getalljobs = await JobModel.find({JobActive:true}).populate('Company')

        return response.successResponse(res, Getalljobs, "Get all Jobs Sucessfull")

    } catch (error) {
        console.log(error)
        return response.internalServerError(res, "Internal Server error")
    }
})




//=================================[Get all Jobs]==============================

const GetAJobs = asynchandler(async (req, res) => {
    try {
        const { id } = req.params;
        const Getajob = await JobModel.findById(id).populate('Company');

        if (!Getajob) {
            return response.notFoundError(res, "Job not found.");
        }

        const totalApplicationCount = await JobApplyModel.countDocuments({ JobId: id });

        const jobWithApplicationCount = {
            ...Getajob.toObject(),
            totalApplicationCount: totalApplicationCount
        };

        return response.successResponse(res, jobWithApplicationCount, "Get job with application count successful");
    } catch (error) {
        console.log(error);
        return response.internalServerError(res, "Internal server error");
    }
});


//===================================[ get All Students ]============================

const GetAllStudents = asynchandler(async (req, res) => {
    try {
        const GetallStudents = await StudentModel.find()

        return response.successResponse(res, GetallStudents, "Get All Student successfull")

    } catch (error) {
        console.log(error)
        return response.internalServerError(res, "Internal Server error")
    }
})



//===================================[ get A Students ]============================

const GetAStudents = asynchandler(async (req, res) => {
    try {

        const { id } = req.params

        const GetaStudents = await StudentModel.findById(id)

        return response.successResponse(res, GetaStudents, "Get A Student successfull")

    } catch (error) {
        console.log(error)
        return response.internalServerError(res, "Internal Server error")
    }
})




//===========================[Create Test]==============================

const Create_Test = asynchandler(async (req, res) => {
    try {
        const { jobId, questions } = req.body;

        const job = await JobModel.findById(jobId);

        if (!job) {
            return response.notFoundError(res, 'Job not found');
        }

        const test = new TestModel({
            job: job._id,
            questions: questions.map(q => ({
                questionText: q.questionText,
                options: q.options.map(option => ({ optionText: option.optionText })),
                correctAnswer: q.correctAnswer
            }))
        });

        await test.save();

        return response.successResponse(res, test, 'Test created successfully');
    } catch (error) {
        console.log(error);
        return response.internalServerError(res, "Internal Server error");
    }
});


module.exports = {
    GetAllcompany,
    GetAcompany,
    Getjobsofacompany,
    GetAllJobs,
    GetAJobs,
    GetAllStudents,
    GetAStudents,
    Create_Test
}
