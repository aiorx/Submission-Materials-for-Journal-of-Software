package game.behaviours;

import game.interfaces.ActionHistoryProvider;
import game.llm.LLMMonologueManager;
import game.actors.LLMNPC;

import java.util.List;

/**
 * A behaviour for a prophetic Seer NPC that generates a cryptic prophecy based on the player's actions.
 * This class extends LLMNPCDialogueBehaviour to utilize the LLMMonologueManager for generating responses.
 * 
 * @author Hassaan Usmani
 */
public class SeerBehaviour extends LLMNPCDialogueBehaviour {

    /**
     * Constructor for SeerBehaviour.
     * Initializes the behaviour with a manager for LLM monologues, a history provider,
     * and the NPC that will use this behaviour.
     *
     * @param manager The manager for LLM monologues
     * @param historyProvider The provider for action history of the player
     * @param llmnpc The NPC that will use this behaviour
     */
    public SeerBehaviour(LLMMonologueManager manager, ActionHistoryProvider historyProvider, LLMNPC llmnpc) {

        super(manager, historyProvider, llmnpc);
    }

    /**
     * Method Assisted with basic coding tools
     * Constructs the prompt for the LLM based on the player's action history.
     * This method provides a context for the Seer to generate a cryptic prophecy.
     *
     * @return A string containing the prompt for the LLM
     */
    @Override
    public String constructPrompt() {

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are the prophetic Seer that has just encountered a player in an Elden Ring Style Game..\n");
        prompt.append("This player plays as a farmer in this land, and has a record of all the actions that they have performed up-to this point.\n");
        prompt.append("Using only the farmer’s past deeds, foretell the peril or fortune they will soon face.\n");
        prompt.append("Many of these actions involve player movement, so ignore them.\n");
        prompt.append("Do not talk about the time of day when reading these poems.\n");
        prompt.append("The list of actions are all given below:\n");

        List<String> hist = historyProvider.getActionHistory();

        for (String s : hist) {

            prompt.append("  - ").append(s).append("\n");
        }
        prompt.append("Offer a cryptic prophecy about what comes next for the farmer.\n");
        prompt.append("This prophecy should not be a poem, and it should be under 50 words. And do not make things up if there is a lack of information.\n");
        prompt.append("Give your response in pure raw text, this response is being viewed on an IDE's terminal, that means no special formatting.");
        return prompt.toString();
    }
}
