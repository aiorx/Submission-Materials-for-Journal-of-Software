package com.example.pokebram.api;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.List;

/*I make a PokemonDetailsResponse class and implement Serializable.
* It allows instances of the class to be converted to bytes.
* This way I can pass data types between activities using Intent.putExtra()
* I make the attributes and their getters for the class.
* The basis of this class has been Assisted using common GitHub development aids,
* Then I added the needed nested classes.*/
public class PokemonDetailsResponse implements Serializable{
    @SerializedName("id")
    private int id;

    @SerializedName("types")
    private List<PokemonType> types;

    @SerializedName("name")
    private String name;

    @SerializedName("sprites")
    private Sprites sprites;

    @SerializedName("height")
    private int height;

    @SerializedName("weight")
    private int weight;

    @SerializedName("stats")
    private List<Stat> stats;

    @SerializedName("abilities")
    private List<Ability> abilities; // New field for abilities

    public int getId() {
        return id;
    }

    public List<PokemonType> getTypes() {
        return types;
    }

    public String getName() {
        return name;
    }

    public Sprites getSprites() {
        return sprites;
    }

    public int getHeight() {
        return height;
    }

    public int getWeight() {
        return weight;
    }

    public List<Stat> getStats() {
        return stats;
    }

    public List<Ability> getAbilities() {
        return abilities;
    }

    public static class PokemonType implements Serializable {
        @SerializedName("type")
        private Type type;

        public Type getType() {
            return type;
        }

        public static class Type implements Serializable {
            @SerializedName("name")
            private String name;

            public String getName() {
                return name;
            }
        }
    }

    public static class Sprites implements Serializable {
        @SerializedName("front_default")
        private String frontDefault;

        public String getFrontDefault() {
            return frontDefault;
        }
    }

    public static class Stat implements Serializable {
        @SerializedName("base_stat")
        private int baseStat;

        @SerializedName("stat")
        private StatName statName;

        public int getBaseStat() {
            return baseStat;
        }

        public StatName getStatName() {
            return statName;
        }

        /*I make a nested class 'StatName' that is used as a data model.
        This data model maps the JSON response from PokeAPI to a Java object.
        To be able to allow instances of the class to convert to bytes, I implement Serializable.*/
        public static class StatName implements Serializable {
            @SerializedName("name")
            private String name;

            public String getName() {
                return name;
            }
        }
    }

    /*I made a nested class Ability within the PokemonDetailsResponse class.
     * This nested class has even another nested class being 'AbilityDetails'.
     * I use it as a data model that maps the JSON response from the PokeAPI to a Java object.*/
    public static class Ability implements Serializable {
        @SerializedName("ability")
        private AbilityDetails ability;

        public AbilityDetails getAbility() {
            return ability;
        }

        public static class AbilityDetails implements Serializable {
            @SerializedName("name")
            private String name;

            public String getName() {
                return name;
            }
        }
    }
}