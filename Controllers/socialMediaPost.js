const asynchandler = require("express-async-handler");
const fetch = require("node-fetch");
const response = require("../Middleware/responseMiddlewares");
const Job = require("../Model/JobModel");
const fbToken = process.env.facebookToken;
const fbPageId = process.env.facebookPageId;
const linkedinToken = process.env.linkedinToken;
const threadsToken = process.env.threadsToken;

const postOnLinkedin = asynchandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return response.notFoundError(res, "Job not found");
    }
    const url = "https://api.linkedin.com/v2/ugcPosts";
    const postData = {
      author: "urn:li:organization:101375722",
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: `
              🚀 *Exciting Job Opportunity at ${job.companyName}!* 🚀

              We are looking for a talented *${job.positionName
              }* to join our dynamic team.

              *🔍 Job Role:* ${job?.positionName}
              *💰 CTC:* ${job?.maxSalary / 100000} LPA-${job?.minSalary / 100000
              } LPA
              *🧠 Experience:* ${job?.minExp}-${job?.maxExp}
              *📍 Location:* ${job.location}

              If you're passionate about what you do and are ready to take on new challenges, apply today and be a part of our innovative journey!

              #hiring #jobopportunity #${job.positionName.toLowerCase()} #${job.location.toLowerCase()}
              id:${job._id}
            `,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${linkedinToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    if (response.ok) {
      const jsonResponse = await response.json();
      job.postedLinkedin = true;
      job.save();
      console.log("Post successful:", jsonResponse);
      return response.successResponse(
        res,
        jsonResponse,
        "Job post on LinkedIn successfully done"
      );
    } else {
      console.error("Post failed:", response.status, response.statusText);
      return res
        .status(response.status)
        .json({ message: "Failed to post", error: response.statusText });
    }
  } catch (error) {
    console.error("Error occurred while posting:", error);
    return response.internalServerError(res, "Internal server error");
  }
});

const postOnFacebook = asynchandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return response.notFoundError(res, "Job not found");
    }

    const url = `https://graph.facebook.com/${fbPageId}/feed`;
    const postData = {
      message: `
        🚀 *Exciting Job Opportunity at ${job.companyName}!* 🚀

        We are looking for a talented *${job.positionName}* to join our dynamic team.

        *🔍 Job Role:* ${job?.positionName}
        *💰 CTC:* ${job?.maxSalary / 100000} LPA-${job?.minSalary / 100000} LPA
        *🧠 Experience:* ${job?.minExp}-${job?.maxExp} years
        *📍 Location:* ${job.location}

        If you're passionate about what you do and are ready to take on new challenges, apply today and be a part of our innovative journey!

        #hiring #jobopportunity #${job.positionName.toLowerCase()} #${job.location.toLowerCase()}
        id:${job._id}
      `,
      access_token: fbToken,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      job.postedFB = true;
      job.save();
      return response.successResponse(
        res,
        jsonResponse,
        "Job post on Facebook successfully done"
      );
    } else {
      console.error("Post failed:", response.status, response.statusText);
      return res
        .status(response.status)
        .json({ message: "Failed to post", error: response.statusText });
    }
  } catch (error) {
    console.error("Error occurred while posting:", error);
    return response.internalServerError(res, "Internal server error");
  }
});

const postOnThreads = asynchandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return response.notFoundError(res, "Job not found");
    }

    const url = `https://api.threads.com/v1/posts`; // Replace with actual Threads API endpoint
    const postData = {
      text: `
        🚀 *Exciting Job Opportunity at ${job.companyName}!* 🚀

        We are looking for a talented *${job.positionName}* to join our dynamic team.

        *🔍 Job Role:* ${job?.positionName}
        *💰 CTC:* ${job?.maxSalary / 100000} LPA-${job?.minSalary / 100000} LPA
        *🧠 Experience:* ${job?.minExp}-${job?.maxExp} years
        *📍 Location:* ${job.location}

        If you're passionate about what you do and are ready to take on new challenges, apply today and be a part of our innovative journey!

        #hiring #jobopportunity #${job.positionName.toLowerCase()} #${job.location.toLowerCase()}
        id:${job._id}
      `,
      token: threadsToken,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${threadsToken}`,
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      job.postedThreads = true;
      job.save();
      return response.successResponse(
        res,
        jsonResponse,
        "Job post on Threads successfully done"
      );
    } else {
      console.error("Post failed:", response.status, response.statusText);
      return res
        .status(response.status)
        .json({ message: "Failed to post", error: response.statusText });
    }
  } catch (error) {
    console.error("Error occurred while posting:", error);
    return response.internalServerError(res, "Internal server error");
  }
});

module.exports = { postOnThreads, postOnFacebook, postOnLinkedin };
