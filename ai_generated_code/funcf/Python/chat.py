```python
# TODO: This was Assisted using common GitHub development utilities, it isn't exactly what I want, but close enough to adapt later.
# @agent.tool
async def get_user_progress(ctx: RunContext[ChatDeps]) -> str:
    """Get a summary of the user's skill development progress."""
    user_id = ctx.deps.user_id
    session_id = ctx.deps.session_id
    study_logger = get_user_study_logger()

    # Log tool call
    if study_logger:
        study_logger.log_tool_call(user_id, session_id, "get_user_progress")

    try:
        progress = await get_user_skill_summary(ctx.deps)

        # Format the progress into a readable summary
        mastered_count = progress.mastered_skills
        total_count = progress.total_skills
        in_progress_count = progress.skills_in_progress

        summary = f"Progress Summary for this session:\n"
        summary += f"- Mastered skills: {mastered_count}/{total_count}\n"
        summary += f"- Skills in progress: {in_progress_count}\n"

        # Add details about top performing skills
        skill_details = progress.skill_details
        top_skills = sorted(
            [
                (skill, details)
                for skill, details in skill_details.items()
                if details.total_evaluations > 0
            ],
            key=lambda x: x[1].weighted_score,
            reverse=True,
        )[:3]

        if top_skills:
            summary += "\nTop performing skills:\n"
            for skill, details in top_skills:
                summary += f"- {skill}: {details.weighted_score:.2f} (mastered: {'yes' if details.is_mastered else 'no'})\n"

        return summary

    except Exception as e:
        log.error(f"Error in get_user_progress tool: {e}", exc_info=e)
        if study_logger:
            study_logger.log_error(
                user_id, session_id, f"Get user progress error: {str(e)}"
            )
        return f"Unable to retrieve progress: {str(e)}"
```