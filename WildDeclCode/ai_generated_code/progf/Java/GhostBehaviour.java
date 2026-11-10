package game.behaviours;

import game.interfaces.ActionHistoryProvider;
import game.llm.LLMMonologueManager;
import game.actors.LLMNPC;

import java.util.List;

/**
 * A behaviour for a ghost NPC that generates cryptic riddles based on the player's actions.
 * This class extends LLMNPCDialogueBehaviour to provide a specific implementation for ghostly dialogue.
 * 
 * @author Hassaan Usmani
 */
public class GhostBehaviour extends LLMNPCDialogueBehaviour {

    /**
     * Constructor for GhostBehaviour.
     * Initializes the behaviour with a manager for LLM monologues, a history provider,
     * and the NPC that will use this behaviour.
     *
     * @param manager The manager for LLM monologues
     * @param historyProvider The provider for action history of the player
     * @param llmnpc The NPC that will use this behaviour
     */
    public GhostBehaviour(LLMMonologueManager manager, ActionHistoryProvider historyProvider, LLMNPC llmnpc) {

        super(manager, historyProvider, llmnpc);
    }

    /**
     * Method Supported via standard programming aids
     * Constructs the prompt for the LLM based on the ghost's dialogue context.
     * This method provides a specific prompt that includes the player's action history
     * and instructs the LLM to generate a cryptic riddle.
     *
     * @return A string prompt for the LLM
     */
    @Override
    public String constructPrompt() {

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are the Ghost of Whispers that has just encountered a player in an Elden Ring Style Game..\n");
        prompt.append("This player plays as a farmer in this land, and has a record of all the actions that they have performed up-to this point.\n");
        prompt.append("You speak only in cryptic riddles, weaving in echoes of the creatures the farmer has slain.\n");
        prompt.append("Many of these actions involve player movement, so ignore them.\n");
        prompt.append("Do not talk about the time of day when reading these poems.\n");
        prompt.append("The list of actions are all given below:\n");

        List<String> hist = historyProvider.getActionHistory();

        for (String s : hist) {

            prompt.append("  - ").append(s).append("\n");
        }
        prompt.append("Compose a single, haunting riddle-like dialogue referencing the whispers of the dead and these deeds.\n");
        prompt.append("This riddle should not be a poem, and it should be under 50 words.\n");
        prompt.append("Note that if the actions show that the player has not killed any or even hit anything, then do not make up dead beings.\n");
        prompt.append("Give your response in pure raw text, this response is being viewed on an IDE's terminal, that means no special formatting.");
        return prompt.toString();
    }
}
