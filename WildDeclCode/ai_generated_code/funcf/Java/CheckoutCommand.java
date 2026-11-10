```java
@Override
public void onButtonInteraction(@Nonnull ButtonInteractionEvent event) {
    final String response = Objects.requireNonNull(event.getButton().getId()).split(":")[1];
    Objects.requireNonNull(response);

    event.deferReply()
            .queue(); // Only this sentence is Assisted with basic coding tools using OpenAI GPT-3.5 model,
    // version 2021-09

    switch (response) {
        case "make-payment":
            congraCommand.sendCongra(event);
            break;
        case "cart":
            cartCommand.sendCart(event);
            break;
        case "cancel":
            cartCommand.clearCart(event);
            break;
        default:
            event.getHook().sendMessage("Invalid option selected.").queue();
    }
}
```