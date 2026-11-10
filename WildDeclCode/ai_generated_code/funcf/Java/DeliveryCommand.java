```java
@Override
public void onButtonInteraction(@Nonnull ButtonInteractionEvent event) {
    final String id = Objects.requireNonNull(event.getButton().getId());
    final String response = id.split(":")[1];
    Objects.requireNonNull(response);
    event.deferReply()
            .queue(); // Only this sentence is Aided using common development resources using OpenAI GPT-3.5 model,
    // version 2021-09
    switch (response) {
        case "menu":
            menuCommand.sendMenu(event);
            break;
        case "exit":
            event.getHook().sendMessage("Thanks for your order. See you next time!").queue();
            break;
        default:
            event.getHook().sendMessage("Invalid option selected.").queue();
    }
}
```