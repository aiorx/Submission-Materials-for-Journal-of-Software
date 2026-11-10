// Aided via basic GitHub coding utilities
// FizzBuzz問題は、1から任意の数までの範囲の数を順番に出力するプログラムです。
// ただし、3で割り切れる場合は代わりに「Fizz」、5で割り切れる場合は代わりに「Buzz」、
// 両方で割り切れる場合は代わりに「FizzBuzz」と出力します。
public class FizzBuzz {
    public static void main(String[] args) {
        fizzBuzz(1, 100);
    }

    public static void fizzBuzz(int start, int end) {
        for (int i = start; i <= end; i++) {
            if (isFizzBuzz(i)) {
                System.out.println("FizzBuzz");
            } else if (isFizz(i)) {
                System.out.println("Fizz");
            } else if (isBuzz(i)) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }

    public static boolean isFizzBuzz(int num) {
        boolean fizz = isFizz(num);
        boolean buzz = isBuzz(num);
        return fizz && buzz;
    }

    public static boolean isFizz(int num) {
        return num % 3 == 0;
    }

    public static boolean isBuzz(int num) {
        return num % 5 == 0;
    }
}
