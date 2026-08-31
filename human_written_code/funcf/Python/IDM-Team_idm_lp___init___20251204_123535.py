```python
commands_bp = (
    add_to_friends_on_chat_enter.user,
    aliases.user,
    aliases_manager.user,
    auto_exit_from_chat.user,

    #
    # Если захотите убрать коммент:
    # https://vk.com/wall-174105461_15842772
    #
    # auto_infection.user,
    # bio_wars.user,


    delete_messages.user,
    delete_messages_vks.user,
    delete_notify.user,
    disable_notifications.user,
    duty_signal.user,
    get_database.user,
    run_eval.user,
    ping.user,
    info.user,
    nometa.user,
    prefixes.user,
    regex_deleter.user,
    repeat.user,
    role_play_commands.user,
    self_signal.user,
    set_secret_code.user,

    timers.user,

    *members_manager.users_bp,
)
```