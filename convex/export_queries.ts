import { query } from "./_generated/server"

// Queries de solo lectura para exportar datos

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect()
  },
})

export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect()
  },
})

export const getAllEnrollments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("enrollments").collect()
  },
})

export const getAllWhitelists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("whitelists").collect()
  },
})

export const getAllQuizzes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quizzes").collect()
  },
})

export const getAllRewards = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rewards").collect()
  },
})

export const getAllMissions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("missions").collect()
  },
})

export const getAllBadges = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("badges").collect()
  },
})

export const getAllFaqs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqs").collect()
  },
})

export const getAllQuizSubmissions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quiz_submissions").collect()
  },
})

export const getAllRedemptions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("redemptions").collect()
  },
})

export const getAllNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notifications").collect()
  },
})

export const getAllMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect()
  },
})

export const getAllCourseGroups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("course_groups").collect()
  },
})