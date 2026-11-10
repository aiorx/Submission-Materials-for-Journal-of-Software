# Supported via standard GitHub programming aids
    def to_dict(self) -> dict:
        """Return a JSON format of the user."""

        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "avatar_url": self.avatar_url,
            "use_google": self.use_google,
            "use_github": self.use_github,
            "security_question": self.security_question,
            "security_answer": self.security_answer,
            "status": self.status,
            "create_at": format_datetime_to_readable_string(self.create_at),
            "update_at": format_datetime_to_readable_string(self.update_at),
        }