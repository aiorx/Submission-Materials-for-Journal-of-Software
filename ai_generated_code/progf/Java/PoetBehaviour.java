package game.behaviours;

import game.interfaces.ActionHistoryProvider;
import game.llm.LLMMonologueManager;
import game.actors.LLMNPC;

import java.util.List;

/**
 * A behaviour for a wandering poet NPC that generates a four-line poem based on the player's actions.
 * This class extends LLMNPCDialogueBehaviour to utilize the LLMMonologueManager for generating responses.
 * 
 * @author Hassaan Usmani
 */
public class PoetBehaviour extends LLMNPCDialogueBehaviour {

    /**
     * Constructor for PoetBehaviour.
     * Initializes the behaviour with a manager for LLM monologues, a history provider,
     * and the NPC that will use this behaviour.
     *
     * @param manager The manager for LLM monologues
     * @param historyProvider The provider for action history of the player
     * @param llmnpc The NPC that will use this behaviour
     */
    public PoetBehaviour(LLMMonologueManager manager, ActionHistoryProvider historyProvider, LLMNPC llmnpc) {

        super(manager, historyProvider, llmnpc);
    }

    /**
     * Method Assisted with basic coding tools
     * Constructs the prompt for the LLM based on the player's action history.
     * This method provides a context for the poet to generate a four-line poem.
     *
     * @return A string containing the prompt for the LLM
     */
    @Override
    public String constructPrompt() {

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a wandering poet that has just encountered a player in an Elden Ring Style Game.\n");
        prompt.append("This player plays as a farmer in this land, and has a record of all the actions that they have performed up-to this point.\n");
        prompt.append("Many of these actions involve player movement, so ignore them.\n");
        prompt.append("Do not talk about the time of day when reading these poems.\n");
        prompt.append("The list of actions are all given below:\n");

        List<String> hist = historyProvider.getActionHistory();

        for (String s : hist) {

            prompt.append("  - ").append(s).append("\n");
        }
        prompt.append("Compose a four‐line poem referencing these actions.\n");
        prompt.append("Give your response in pure raw text, this response is being viewed on an IDE's terminal, that means no special formatting.");
        return prompt.toString();
    }
}
