package IO;
import java.io.*;

// Drafted using standard development resources 4.0
public class CopySettings {
    public static void restore() {
        // 파일 경로 지정
        String appDataPath = System.getProperty("user.home") + "/Library/Application Support/Tetris";
        File appDataDir = new File(appDataPath);
        if (!appDataDir.exists()) {
            appDataDir.mkdirs();  // 디렉토리가 없다면 생성
        }
        String sourceFilePath = appDataPath + "/defaultSettings.ini";
        String destinationFilePath = appDataPath + "/settings.ini";

        // 파일 복사를 위한 스트림 선언
        try (BufferedReader reader = new BufferedReader(new FileReader(sourceFilePath));
             BufferedWriter writer = new BufferedWriter(new FileWriter(destinationFilePath))) {

            String currentLine;

            // 파일 내용을 한 줄씩 읽으면서 대상 파일에 쓴다.
            while ((currentLine = reader.readLine()) != null) {
                writer.write(currentLine);
                writer.newLine(); // 줄바꿈 추가
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
