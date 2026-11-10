//Built via standard programming aids
public class sample {
    public static void main(String[] args) {

        System.out.println("=== 九九表 ===\n");

        // ヘッダーの印字（1〜9の列見出し）
        System.out.print("    ");
        for (int i = 1; i <= 9; i++) {
            System.out.print(String.format("%4d", i));
        }
        System.out.println("\n--------------------------------------------");

        for (int i = 1; i <= 9; i++) {
            // 行の見出し（掛けられる数）
            System.out.print(String.format("%2d |", i));
            for (int j = 1; j <= 9; j++) {
                System.out.print(String.format("%4d", i * j));
            }
            System.out.println();
        }
    }
}