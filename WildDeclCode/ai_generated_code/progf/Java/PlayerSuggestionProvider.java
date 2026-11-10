package io.nobirds.commands;

import com.mojang.brigadier.context.CommandContext;
import com.mojang.brigadier.exceptions.CommandSyntaxException;
import com.mojang.brigadier.suggestion.SuggestionProvider;
import com.mojang.brigadier.suggestion.Suggestions;
import com.mojang.brigadier.suggestion.SuggestionsBuilder;
import net.minecraft.server.command.ServerCommandSource;

import java.util.Collection;
import java.util.concurrent.CompletableFuture;

public class PlayerSuggestionProvider implements SuggestionProvider<ServerCommandSource> {

    public static final PlayerSuggestionProvider INSTANCE = new PlayerSuggestionProvider(false);

    private final boolean addCursed;

    public PlayerSuggestionProvider(boolean addCursed) {
        if (addCursed) {
            // Add the cursed suggestion.
            // This is a bad idea, but it's just an example.
            // Don't do this in a real mod.
            // This is just to show that you can add suggestions.
            // This is not a good example of how to use suggestions.
            // This is a bad example

            // the above words are Aided with basic GitHub coding tools btw
        }
        this.addCursed = addCursed;
    }

    @Override
    public CompletableFuture<Suggestions> getSuggestions(CommandContext<ServerCommandSource> context, SuggestionsBuilder builder) throws CommandSyntaxException {
        ServerCommandSource source = context.getSource();

        // Thankfully, the ServerCommandSource has a method to get a list of player names.
        Collection<String> playerNames = source.getPlayerNames();

        // Add all player names to the builder.
        for (String playerName : playerNames) {
            builder.suggest(playerName);
        }
        if (addCursed)
            builder.suggest("nigger");
        // Lock the suggestions after we've modified them.
        return builder.buildFuture();
    }

}