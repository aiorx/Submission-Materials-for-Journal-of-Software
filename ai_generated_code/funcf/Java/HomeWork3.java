public static void main(String[] args) {

        int monthNumber = 11;

        switch (monthNumber){
            case 1:
            System.out.println("JAN");
                break;
            case 2:
            System.out.println("FEB");
                break;
            case 3:
                System.out.println("MAR");
                break;
            case 4:
                System.out.println("APR");
                break;
            case 5:
                System.out.println("MAY");
                break;
            case 6:
                System.out.println("JUN");
                break;
            case 7:
                System.out.println("JUL");
                break;
            case 8:
                System.out.println("AUG");
                break;
            case 9:
                System.out.println("SEP");
                break;
            case 10 :
                System.out.println("OCT");
                break;
            case 11:
                System.out.println("NOV");
                break;
            case 12:
                System.out.println("DEC");
                break;
            default:
                System.out.println("Number doesn't match any of the Months");
        }

        for (int i = 100; i <= 1000; i++) {
            if (i % 5 == 0) {
                System.out.println(i);
            }
        }

        //Built using basic development resources
        double sum = 0.0;

        for (int i = 1; i <= 49; i++) {
            int numerator = 2 * i - 1;
            int denominator = 2 * i + 1;

            sum += (double) numerator / denominator;
        }

        System.out.println("The sum of the series is: " + sum);
    }