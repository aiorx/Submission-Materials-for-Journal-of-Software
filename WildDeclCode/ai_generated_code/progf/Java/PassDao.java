package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import util.DBConnection;

/**
 * {@code PassDao} は、staff テーブルにおけるパスワードの検証・更新を担当するDAOクラスです。
 * <p>
 * パスワードの平文比較および更新処理を行います。
 * 【Assisted with basic coding tools】
 */
public class PassDao {
    // パスワード確認（プレーンテキスト比較）
	/**
     * 指定された社員IDと入力パスワードが一致するかを検証します。
     * <p>
     * DBに保存されているパスワードと平文で直接比較します。
     *
     * @param staffId 社員ID
     * @param inputPassword 入力されたパスワード（平文）
     * @return 一致すれば true、不一致または例外時は false
     * 【Assisted with basic coding tools】
     */
    public boolean checkPassword(String staffId, String inputPassword) {
        boolean isValid = false;

        String sql = "SELECT password FROM staff WHERE staff_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, staffId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String dbPassword = rs.getString("password");
                isValid = dbPassword.equals(inputPassword);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return isValid;
    }

    
    // パスワード更新
    /**
     * 指定された社員IDのパスワードを新しい値に更新します。
     *
     * @param staffId パスワードを更新する対象の社員ID
     * @param newPassword 新しいパスワード（平文またはハッシュ済み）
     * @return 更新が成功した場合は true、失敗または対象なしは false
     * 【Assisted with basic coding tools】
     */
    public boolean updatePassword(String staffId, String newPassword) {
        String sql = "UPDATE staff SET password = ? WHERE staff_id = ?";
        boolean isUpdated = false;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, newPassword);
            stmt.setString(2, staffId);

            int rows = stmt.executeUpdate();
            isUpdated = (rows == 1); // 更新成功は1行のみのはず

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return isUpdated;
    }
}



    
    