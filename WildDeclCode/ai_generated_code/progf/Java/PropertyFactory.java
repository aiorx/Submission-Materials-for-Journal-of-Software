package model.buildings;

import model.Settings;
import model.buildings.properties.*;
import model.characters.Peasant;
import model.characters.Person;
import model.characters.npc.Merchant;
import model.characters.npc.Noble;
import model.characters.npc.Vanguard;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class PropertyFactory {

    private static final String[] PREFIXES = {
            "Sun", "Moon", "Star", "Shadow", "Storm", "Frost", "Fire", "Thunder", "Iron", "Crystal",
            "Mystic", "Golden", "Silver", "Emerald", "Dragon", "Phoenix", "Dark", "Light", "Holy", "Inferno",
            "Terra", "Aqua", "Wind", "Earth", "Blaze", "Spirit", "Sky", "Dusk", "Dawn", "Ghost"
    };
    private static final String[] INFIXES = {
            "wolf", "lion", "hawk", "eagle", "bear", "fox", "tiger", "snake", "raven", "panther"
    };
    private static final String[] SUFFIXES = {
            "blade", "heart", "spire", "clan", "forge", "fall", "guard", "shade", "watch", "bane",
            "song", "wing", "wood", "peak", "vale", "crest", "hall", "shroud", "fury", "veil",
            "ridge", "field", "stone", "grove", "mount", "stream", "plain", "shore", "lake", "hollow"
    };
    private static final Set<String> generatedNames = new HashSet<>();
    private static final Random random = Settings.getRandom();

    // Comment: Designed via basic programming aids
    public static String generateUniqueName() {
        while (true) {
            String name = PREFIXES[random.nextInt(PREFIXES.length)] +
                    INFIXES[random.nextInt(INFIXES.length)] +
                    SUFFIXES[random.nextInt(SUFFIXES.length)];
            if (!generatedNames.contains(name)) {
                generatedNames.add(name);
                return name;
            }
        }
    }

    public static Property createProperty(String name, String area, Person owner) {

        name = generateUniqueName();
        Random random = Settings.getRandom();
        double randomValue = random.nextDouble();

        return switch (area) {
            case "Nation" -> createNationProperty(name, randomValue, owner);
            case "Province" -> createProvinceProperty(name, randomValue, owner);
            case "City" -> createCityProperty(name, randomValue, owner);
            case "Quarter" -> createQuarterProperty(name, randomValue, owner);
            default -> new Shack("empty", owner.getPerson());
        };
    }

    private static Property createNationProperty(String name, double randomValue, Person owner) {
        name = generateUniqueName();
        return (randomValue < 0.75) ? new Fortress(name, owner.getPerson()) : new Citadel(name, owner.getPerson());
    }

    private static Property createProvinceProperty(String name, double randomValue, Person owner) {
        name = generateUniqueName();
        if (randomValue < 0.4) {
            return new Citadel(name, owner.getPerson());
        } else if (randomValue < 0.8) {
            return new Castle(name, owner.getPerson());
        } else {
            return new Manor(name, owner.getPerson());
        }
    }

    private static Property createCityProperty(String name, double randomValue, Person owner) {
        name = generateUniqueName();
        if (randomValue < 0.2) {
            return new Castle(name, owner.getPerson());
        } else if (randomValue < 0.5) {
            return new Manor(name, owner.getPerson());
        } else if (randomValue < 0.9) {
            return new Mansion(name, owner.getPerson());
        } else {
            return new Villa(name, owner.getPerson());
        }
    }

    private static Property createQuarterProperty(String name, double randomValue, Person owner) {
        name = generateUniqueName();
        if (randomValue < 0.05) {
            return new Mansion(name, owner.getPerson());
        } else if (randomValue < 0.3) {
            return new Villa(name, owner.getPerson());
        } else {
            return new Cottage(name, owner.getPerson());
        }
    }

    public static Property createSupportProperty(Person support){


        Random random = Settings.getRandom();
        double randomValue = random.nextDouble();

        if (support.getCharacter() instanceof Noble){
            return new Manor("Noble's " + generateUniqueName(), support.getPerson());
        } else if (support.getCharacter() instanceof Vanguard) {
            if (randomValue < 0.15) {
                return new Fortress("Vanguard's " + generateUniqueName(), support.getPerson());
            } else if (randomValue < 0.5){
                return new Citadel("Vanguard's " +generateUniqueName(), support.getPerson());
            } else {
                return new Castle("Vanguard's " + generateUniqueName(), support.getPerson());
            }
        } else
            if (randomValue < 0.15) {
                return new Citadel("Mercenary's " + generateUniqueName(), support.getPerson());
            } else if (randomValue < 0.5){
                return new Castle("Mercenary's " + generateUniqueName(), support.getPerson());
            } else {
                return new Manor("Mercenary's " + generateUniqueName(), support.getPerson());
            }
        }

    public static Property createPeasantProperty(Person person) {

        String name = person.getName();
        name = name.split(" ")[1];
        name = Settings.removeUiNameAddition(name) +" "+ generateUniqueName();

        if (person.getCharacter() instanceof Merchant) {
            Random random = Settings.getRandom();
            double randomValue = random.nextDouble();
            if (randomValue < 0.05) {
                Mansion mansion = new Mansion(name, person.getPerson());
                mansion.setOwner(person.getPerson());
                return mansion;
            } else if (randomValue < 0.25) {
                Villa villa = new Villa(name, person.getPerson());
                villa.setOwner(person.getPerson());
                return villa;
            } else if (randomValue < 0.6) {
                Cottage cottage = new Cottage(name, person.getPerson());
                cottage.setOwner(person.getPerson());
                return cottage;
            } else {
                Shack shack = new Shack(name, person.getPerson());
                shack.setOwner(person.getPerson());
                return shack;
            }
        } else if (person.getCharacter() instanceof Peasant) {
            Shack shack = new Shack(name, person.getPerson());
            shack.setOwner(person.getPerson());
            return shack;

        }
        return null;
    }


}
