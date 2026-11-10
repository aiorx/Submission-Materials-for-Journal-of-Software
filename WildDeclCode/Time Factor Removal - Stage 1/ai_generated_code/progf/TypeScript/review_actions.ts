'use server';
var revalidatePath = require('next/cache').revalidatePath;
var Budget = require('lib/data').Budget;
var DataModel = require('lib/data').DataModel;
var Database = require('lib/data').Database;
var Comment = require('lib/data').Comment;
var redirect = require('next/navigation').redirect;

// ReviewActionController
export async function TESTapproveBudgetAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  // Change budget status
  await dataModel.changeBudgetStatus(budget, 'approved');
}
export async function approveBudgetAction(budget: Budget): Promise<void> {
  await TESTapproveBudgetAction(new DataModel(Database), budget);

  revalidatePath('/dashboard');
  revalidatePath("/budget/" + (budget.id) + "");
  redirect('/dashboard');
}

export async function TESTdenyBudgetAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  // Change budget status to denied
  await dataModel.changeBudgetStatus(budget, 'denied');

  // Commit all the comments for each item
  await dataModel.pushAllBudgetComments(budget.id);
}
export async function denyBudgetAction(budget: Budget): Promise<void> {
  await TESTdenyBudgetAction(new DataModel(Database), budget);

  // Redirect to the dashboard
  revalidatePath('/dashboard');
  revalidatePath("/budget/" + (budget.id) + "");
  redirect('/dashboard');
}

export async function TESTclearCommentsAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  await dataModel.clearItemComments(budget.id);
  revalidatePath("/budget/" + (budget.id) + "");
}
export async function clearCommentsAction(budget: Budget): Promise<void> {
  await TESTclearCommentsAction(new DataModel(Database), budget);
}

export type ReviewActionController = {
  approveBudget: function (budget: Budget) { return Promise<void>; };
  denyBudget: function (budget: Budget) { return Promise<void>; };
  clearComments: function (budget: Budget) { return Promise<void>; };
};

// EventCommentThreadController
export async function TESTaddEventCommentAction(
  dataModel: DataModel,
  budget: Budget,
  comment: Comment
): Promise<void> {
  if (comment.comment === '') await dataModel.popBudgetComment(budget.id);
  else await dataModel.stageBudgetComment(budget.id, comment);
}
export async function addEventCommentAction(
  budget: Budget,
  comment: Comment
): Promise<void> {
  await TESTaddEventCommentAction(new DataModel(Database), budget, comment);
}

// [These two functions were generated with copilot]
export async function TESTdeleteEventCommentAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  await dataModel.popBudgetComment(budget.id);
}
export async function deleteEventCommentAction(budget: Budget): Promise<void> {
  await TESTdeleteEventCommentAction(new DataModel(Database), budget);
}

export async function TESTgetPreviousEventCommentsAction(
  dataModel: DataModel,
  budget: Budget
): Promise<Comment[]> {
  var comments: Comment[] = [];
  for (var commentID of budget.prev_commentIDs) {
    var comment = await dataModel.getComment(commentID);
    comments.push(comment);
  }
  return comments;
}
export async function getPreviousEventCommentsAction(
  budget: Budget
): Promise<Comment[]> {
  return TESTgetPreviousEventCommentsAction(new DataModel(Database), budget);
}

// [this type was Aided with basic GitHub coding tools]
export type EventCommentThreadController = {
  addEventComment: function (budget: Budget, comment: Comment) { return Promise<void>; };
  deleteEventComment: function (budget: Budget) { return Promise<void>; };
  getPreviousComments: function (budget: Budget) { return Promise<Comment[]>; };
  comment: Comment;
};
