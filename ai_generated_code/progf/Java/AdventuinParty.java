package pgdp.adventuin;
import pgdp.color.RgbColor;
import pgdp.color.RgbColor8Bit;


import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.Comparator;

public final class AdventuinParty {
    public static void main(String[] args) {

    }
    // TODO
    public static void printLocalizedChristmasGreetings(List<Adventuin> participants){
        participants.stream()
                .sorted(Comparator.comparing(Adventuin:: getHeight))
                .forEach(party ->
                        System.out.println(party.getLanguage().getLocalizedChristmasGreeting(party.getName())));
    }

    public static Map<HatType, List<Adventuin>> groupByHatType(List<Adventuin> participants) {
        return participants.stream()
                .collect(Collectors.groupingBy(Adventuin::getHatType));
    }

    public static Map<HatType, List<Adventuin>> getAdventuinsWithLongestNamesByHatType(List<Adventuin> participants) {
        return participants.stream()
                .collect(Collectors.groupingBy(party ->
                        getHatTypeByLength(party.getName().length())));

    }

    private static HatType getHatTypeByLength(int length) {
        if (length == HatType.SANTA_CLAUS.toString().length()) {
            return HatType.SANTA_CLAUS;
        } else if (length == HatType.REINDEER.toString().length()) {
            return HatType.REINDEER;
        } else if (length == HatType.FISHY_HAT.toString().length()) {
            return HatType.FISHY_HAT;
        } else {
            return HatType.NO_HAT;
        }
    }

    public static Map<Integer, Double> getAverageColorBrightnessByHeight(List<Adventuin> participants){
        Map<Integer, List<Adventuin>> temp = participants.stream()
                .collect(Collectors.groupingBy(party -> roundToNearestTen(party.getHeight())));
        Map<Integer, Double> result = new HashMap<>();
        temp.forEach((num, party) -> result.put(num, func.apply(party)));
        return result;
    }

    private static final Function<List<Adventuin>, Double> func = (list) -> {
        return list.stream().mapToDouble(party -> colourCorrection(party.getColor())).sum();
    };

    private static Double colourCorrection(RgbColor color){
        RgbColor8Bit temp = color.toRgbColor8Bit();
        return (temp.getRed()*0.2126 + 0.7152*temp.getGreen()+0.0722*temp.getBlue())/255;
    }

    private static int roundToNearestTen(int length) {
        return (int) (Math.round(length / 10.0) * 10);
    }

    //Everything beyond this point was Composed with basic coding tools im not that smart
    public static Map<HatType, Double> getDiffOfAvgHeightDiffsToPredecessorByHatType(List<Adventuin> adventuins) {
        Map<HatType, Double> result = new HashMap<>();

        Map<HatType, List<Adventuin>> groupedByHatType = groupByHatType(adventuins);

        for (Map.Entry<HatType, List<Adventuin>> entry : groupedByHatType.entrySet()) {
            HatType hatType = entry.getKey();
            List<Adventuin> hatTypeAdventuins = entry.getValue();

            Map<Integer, List<Integer>> differencesBySign = calculateDifferencesBySign(hatTypeAdventuins);

            // Calculate average differences for each sign category
            double avgNegative = calculateAverage(differencesBySign.getOrDefault(-1, new ArrayList<>()));
            double avgZero = calculateAverage(differencesBySign.getOrDefault(0, new ArrayList<>()));
            double avgPositive = calculateAverage(differencesBySign.getOrDefault(1, new ArrayList<>()));

            // Calculate the absolute difference between averages
            double absDiff = Math.abs(avgNegative - avgPositive);
            result.put(hatType, absDiff);
        }

        return result;
    }

    private static Map<Integer, List<Integer>> calculateDifferencesBySign(List<Adventuin> adventuins) {
        Map<Integer, List<Integer>> differencesBySign = new HashMap<>();
        for (int i = 0; i < adventuins.size(); i++) {
            Adventuin current = adventuins.get(i);
            Adventuin predecessor = adventuins.get((i + adventuins.size() - 1) % adventuins.size());

            int difference = current.getHeight() - predecessor.getHeight();
            int sign = Integer.compare(difference, 0);

            differencesBySign.computeIfAbsent(sign, k -> new ArrayList<>()).add(Math.abs(difference));
        }
        return differencesBySign;
    }


    private static double calculateAverage(List<Integer> numbers) {
        return numbers.stream().mapToInt(Integer::intValue).average().orElse(0.0);
    }

}
