var query = require('./_generated/server').query;
var v = require('convex/values').v;

// Admin dashboard statistics: total applicants, recruiters, jobs, applications, categories, comments
const getAdminStats = query({
  args: {},
  returns: v.object({
    applicants: v.number(),
    recruiters: v.number(),
    jobs: v.number(),
    applications: v.number(),
    categories: v.number(),
    comments: v.number(),
  }),
  handler: async function (ctx, args) {
    const applicants = await ctx.db.query("applicants").collect();
    const recruiters = await ctx.db.query("recruiters").collect();
    const jobs = await ctx.db.query("jobs").collect();
    const applications = await ctx.db.query("applications").collect();
    const categories = await ctx.db.query("categories").collect();
    const comments = await ctx.db.query("comments").collect();

    return {
      applicants: applicants.length,
      recruiters: recruiters.length,
      jobs: jobs.length,
      applications: applications.length,
      categories: categories.length,
      comments: comments.length,
    };
  },
});
// Assisted using common GitHub development utilities
