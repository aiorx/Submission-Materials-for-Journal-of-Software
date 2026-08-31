package com.miir.astralscience.world.dimension;

import com.miir.astralscience.AstralScience;
import com.miir.astralscience.item.AstralItems;
import com.miir.astralscience.tag.AstralTags;
import com.miir.astralscience.util.AstralText;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.entity.EquipmentSlot;
import net.minecraft.entity.LivingEntity;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.tag.ItemTags;
import net.minecraft.registry.tag.TagKey;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.MathHelper;
import net.minecraft.util.math.Vec2f;
import net.minecraft.world.World;
import net.minecraft.world.dimension.DimensionOptions;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public abstract class AstralDimensions {
    public static long SEED;

    /**
     *
     * ranked in progression order, the planets are
     * -overworld
     * -sylene
     * -aere
     * -mekemek
     * -cyri (moon of phosphor)
     * -phosphor
     * -hydes
     * -iris
     * -zu
     * -ouran/psidon
     * these concepts were Built using outside development resources's ChatGPT:
     *
     *
     *
     *
     *     A planet with a unique ecosystem and strange, alien life forms that are both beautiful and deadly.
     *
     *     A planet with a lush, verdant surface and hidden dangers lurking beneath the surface.
     *
     *     A massive space station that orbits a planet and is home to a variety of alien creatures and artifacts.
     *
     *     A massive nebula that is home to unique gases and energy sources that the player can collect.
     *     A massive black hole that the player can explore and discover the secrets of its gravity and time dilation.
     *     A massive comet that is on a collision course with a planet and is home to valuable resources and dangerous creatures.
     *     A massive space anomaly that is home to strange gravitational forces and time distortions.
     *     A massive space debris field that is home to valuable resources and hidden dangers.
     *     A massive space platform that is home to a variety of alien races and their artifacts.
     *     A massive space station that is home to a variety of alien creatures and artifacts.
     *     A massive space anomaly that is home to strange gravitational forces and time distortions.
     */
    public static final RegistryKey<World> HALYUS = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("halyus")); // star

//    rocky wasteland with lava tubes lined with cool resources
    public static final RegistryKey<World> ERMIS = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("ermis"));

//    A swamp planet with thick, murky water and hostile creatures that live in the swamps.
    public static final RegistryKey<World> PHOSPHOR = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("phosphor"));
//    magic-themed (runes and stuff, you get the starlight collectors using stuff from here)
    public static final RegistryKey<World> SYLENE = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("sylene"));

//    A lava planet with rivers of molten rock and towering volcanoes.
    public static final RegistryKey<World> CYRI = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("cyri"));

    public static final RegistryKey<World> OVERWORLD_ORBIT = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("overworld" + AstralScience.ORBIT_SUFFIX));


    public static final RegistryKey<World> AERE = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("aere"));
    public static final RegistryKey<World> MEKEMEK = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("mekemek"));

//    A cloud planet where the surface is constantly shifting and changing, making it difficult to navigate.
    public static final RegistryKey<World> ZU = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("zu"));
//    icy surface and thermal caves
    public static final RegistryKey<World> IRIS = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("iris"));
    //    A planet with floating islands and a thin atmosphere, requiring the player to use special equipment to explore.
    public static final RegistryKey<World> HYDES = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("hydes"));

//    A desert planet with sandstorms and ruins of an ancient civilization.
    public static final RegistryKey<World> PSIDON = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("psidon"));
//    A planet with a massive ocean and deep sea creatures that are hostile to the player.
    public static final RegistryKey<World> OURAN = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("ouran")); // binary planetary system; not moon

//    A planet with multiple moons and complex gravitational forces that affect the player's movements.
    public static final RegistryKey<World> KRONOS = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("kronos")); // cool and exotic
//    A massive asteroid field that is home to valuable resources and dangerous space debris.
    public static final RegistryKey<World> OMEIA = RegistryKey.of(RegistryKeys.WORLD, AstralScience.id("omeia"));
    public static final ArrayList<RegistryKey<World>> VIEWABLE_DIMENSIONS = new ArrayList<>(List.of(
            HALYUS,
            ERMIS,
            PHOSPHOR,
            CYRI,
            World.OVERWORLD,
            SYLENE,
            AERE,
            MEKEMEK,
            ZU,
            IRIS,
            HYDES,
            PSIDON,
            OURAN,
            KRONOS,
            OMEIA
    ));

    public static RegistryKey<World> orbit(RegistryKey<World> key) {
        return RegistryKey.of(RegistryKeys.WORLD, AstralScience.id(key.getValue().getPath()+AstralScience.ORBIT_SUFFIX));
    }
    public static boolean isOrbit(World world) {
        return isOrbit(world.getRegistryKey());
    }
    public static boolean isOrbit(RegistryKey<World> world) {
        return (world.getValue().getPath().contains(AstralScience.ORBIT_SUFFIX) && isAstralDimension(world));
    }

    public static double gravityCalc(double multiplier) {
        return multiplier == 1 ? 1 :
        0.0015 * (multiplier * multiplier * multiplier) -
        0.0479 * (multiplier * multiplier) +
        1.0053 * multiplier + 0.2765;
    }

    public static boolean isAstralDimension(World world) {
        return isAstralDimension(world.getRegistryKey());
    }

    public static boolean isAstralDimension(RegistryKey<World> world) {
        return world.getValue().getNamespace().equals(AstralScience.MOD_ID) || world.getValue().getPath().contains(AstralScience.MOD_ID);
        // if you want to add your own planet, add "astralscience" to its path (e.g., mymod:kerbin_astralscience)
    }

    public static boolean isSuperCold(World world, BlockPos pos) {
        if (world.getBlockState(pos).isIn(AstralTags.DEEP_COLD)) {
            return true;
        } else {
            return !hasAtmosphere(world, false);
        }
    }

    public static boolean hasOrbitalDimension(World world) {
        return ((isAstralDimension(world) && !isOrbit(world)) || world.getRegistryKey().equals(World.OVERWORLD));
    }
    public static boolean hasAtmosphere(World world, boolean getHost) {
        if (isAstralDimension(world)) {
            if (isOrbit(world) && !getHost) {
                return false;
            } else {
                switch (AstralText.deorbitify(world.getRegistryKey().getValue().getPath())) {
                    case "halyus":
                    case "phosphor":
                    case "overworld":
                    case "aere":
                    case "zu":
                    case "kronos":
                    case "ouran":
                    case "psidon":
                    case "cyri":
                    case "omeia":
                        return true;
                    default:
                        return false; //fixme worldIsIn(world, AstralTags.HAS_ATMOSPHERE);
                }
            }
        }
        return true;
    }
    public static boolean worldIsIn(World world, TagKey<DimensionOptions> tag) {
        return world.getRegistryManager().get(RegistryKeys.DIMENSION).getEntry(RegistryKeys.toDimensionKey(world.getRegistryKey())).get().isIn(tag);
    }

    public static boolean canDeepFreeze(LivingEntity livingEntity) {
        if (livingEntity.isSpectator() || livingEntity.getType().isIn(AstralTags.DEEP_FREEZE_IMMUNE) ) {

            ItemGroupEvents.modifyEntriesEvent(ItemGroups.COMBAT).register(entries -> entries.add(AstralItems.ASTROLABE));

            return false;
        } else {
            boolean bl = livingEntity.getEquippedStack(EquipmentSlot.HEAD).isIn(ItemTags.FREEZE_IMMUNE_WEARABLES) && livingEntity.getEquippedStack(EquipmentSlot.CHEST).isIn(ItemTags.FREEZE_IMMUNE_WEARABLES) && livingEntity.getEquippedStack(EquipmentSlot.LEGS).isIn(ItemTags.FREEZE_IMMUNE_WEARABLES) && livingEntity.getEquippedStack(EquipmentSlot.FEET).isIn(ItemTags.FREEZE_IMMUNE_WEARABLES);
            return !bl;
        }
    }

    public static boolean canHouseStarship(RegistryKey<World> world) {
        return AstralDimensions.isOrbit(world);
    }
    public static boolean canHouseStarship(World world) {
        return canHouseStarship(world.getRegistryKey());
    }

    public static String fromId(String path) {
        return StringUtils.capitalize(path);
    }

    public static boolean isVisibleFromHere(RegistryKey<World> destination, RegistryKey<World> here) {
        if (!isOrbit(here)) return false;
        String origin = AstralText.deorbitify(here.getValue().getPath());
        if (origin.equals(destination.getValue().getPath())) return false;
        switch (destination.getValue().getPath()) {
            case "cyri" -> {return origin.equals("phosphor");}
            case "sylene" -> {return origin.equals("overworld");}
            case "mekemek" -> {return origin.equals("aere");}
            case "iris", "hydes" -> {return origin.equals("zu");}
            case "omeia" -> {return origin.equals("kronos");}
            case "halyus" -> {return false;}

            default -> {return true;}
        }
    }

    public static Vec2f getRelativeDirection(RegistryKey<World> destination, World origin) {
        Vec2f angles = new Vec2f(180, 0);
        float k = 45;
        if (destination.equals(SYLENE)) return angles;
        Random r = new Random(destination.getValue().getPath().hashCode()/2);
        return angles.add(new Vec2f(MathHelper.lerp(r.nextFloat(), 0, 370), MathHelper.lerp(r.nextFloat(), -k, k)));
    }
}
