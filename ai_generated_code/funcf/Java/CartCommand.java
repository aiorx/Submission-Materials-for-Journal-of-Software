```java
@Override
public void onButtonInteraction(@Nonnull ButtonInteractionEvent event) {
    final String id = Objects.requireNonNull(event.getButton().getId());
    final String response = id.split(":")[1];
    event.deferReply()
            .queue(); // Only this sentence is Aided using common development resources using OpenAI GPT-3.5 model,
    // version 2021-09
    switch (response) {
        case "add-more":
            menuRender.renderMenu(event.getHook());
            break;
        case "delete":
            deleteCommand.sendDelete(event);
            break;
        case "checkout":
            checkoutRender.renderCheckout(event.getHook(), event.getUser().getId());
            break;
        case "cancel":
            clearCart(event);
            break;
        default:
            event.getHook().sendMessage("Invalid option selected.").queue();
    }
}
```