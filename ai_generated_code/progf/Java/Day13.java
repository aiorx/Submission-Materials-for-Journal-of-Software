import java.io.*;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class Day13
{
    public static void main(String[] args)
    {
        List<int[]> lines = extractNumericDataFromFile("puzzle/day13.txt");

        int tokens1 = 0;
        BigInteger tokens2 = new BigInteger("0");
        for (int i = 0; i < lines.size(); i += 6)
        {
            tokens1 += compute1(lines.get(i)[0], lines.get(i + 1)[0],
                    lines.get(i + 2)[0], lines.get(i + 3)[0],
                    lines.get(i + 4)[0], lines.get(i + 5)[0]);
            tokens2 = tokens2.add(compute2(lines.get(i)[0], lines.get(i + 1)[0],
                    lines.get(i + 2)[0], lines.get(i + 3)[0],
                    lines.get(i + 4)[0], lines.get(i + 5)[0]));
        }

        System.out.println(tokens1);
        System.out.println(tokens2);
    }

    public static int compute1(int xA, int yA, int xB, int yB, int x, int y)
    {
        double aM = (double) yA / xA;
        double bM = (double) yB / xB;

        double x1 = ((bM * x) - y) / (bM - aM);
        double y1 = aM * x1;

        int aPresses = (int) (y1 / yA + 0.5);
        int bPresses = (int) ((y - y1) / yB + 0.5);

        int xP = aPresses * xA + bPresses* xB;
        int yP = aPresses * yA + bPresses* yB;

        if (xP != x || yP != y) return 0;

        return aPresses * 3 + bPresses;
    }

    public static BigInteger compute2(int xA, int yA, int xB, int yB, int x, int y)
    {
        BigInteger xL = BigInteger.valueOf(x).add(new BigInteger("10000000000000"));
        BigInteger yL = BigInteger.valueOf(y).add(new BigInteger("10000000000000"));

        double aM = (double) yA / xA;
        double bM = (double) yB / xB;

        BigDecimal x1 = new BigDecimal(xL).multiply(BigDecimal.valueOf(bM)).subtract(new BigDecimal(yL));
        x1 = x1.divide(BigDecimal.valueOf(bM - aM), RoundingMode.HALF_UP);
        BigDecimal y1 = x1.multiply(BigDecimal.valueOf(aM));

        BigInteger aPresses = y1.divide(BigDecimal.valueOf(yA), 0, RoundingMode.HALF_UP).toBigInteger();
        BigInteger bPresses = new BigDecimal(yL).subtract(y1).divide(BigDecimal.valueOf(yB), 0, RoundingMode.HALF_UP).toBigInteger();

        BigInteger xP = aPresses.multiply(BigInteger.valueOf(xA)).add(bPresses.multiply(BigInteger.valueOf(xB)));
        BigInteger yP = aPresses.multiply(BigInteger.valueOf(yA)).add(bPresses.multiply(BigInteger.valueOf(yB)));

        if (!xP.equals(xL) || !yP.equals(yL)) return BigInteger.ZERO;

        return aPresses.multiply(BigInteger.valueOf(3)).add(bPresses);
    }


    /**
     * Supported via standard GitHub programming aids
     *
     * @param filename name of the resource file including relative path
     * @return a list of int[]
     */
    public static List<int[]> extractNumericDataFromFile(String filename)
    {
        List<int[]> numericData = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\d+)");
        InputStream stream = Day13.class.getResourceAsStream(filename);
        if (stream == null) {
            System.err.println("File not found: " + filename);
            return numericData;
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream)))
        {
            String line;
            while ((line = reader.readLine()) != null)
            {
                Matcher matcher = pattern.matcher(line);
                while (matcher.find())
                {
                    String match = matcher.group();
                    numericData.add(new int[]{Integer.parseInt(match)});
                }
            }
        } catch (IOException e) {System.err.println("Error reading file: " + e.getMessage());}
        return numericData;
    }
}
