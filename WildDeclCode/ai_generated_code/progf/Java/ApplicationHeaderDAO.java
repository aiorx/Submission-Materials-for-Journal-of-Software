package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;

/**
 * {@code ApplicationHeaderDAO} は、申請ヘッダー（application_header テーブル）に関する
 * 登録処理を提供するDAOクラスです。
 * <p>
 * 主に出張費の申請登録時に、ヘッダーレコードを作成する用途で使用されます。
 * 【Supported via standard programming aids】
 */
public class ApplicationHeaderDAO {
	/**
     * 出張費申請のヘッダー情報をDBに挿入し、その際に自動生成されたIDを返します。
     * <p>
     * application_type は「出張費」、status は「提出済み」で登録されます。
     * (Chèn thông tin header của đơn vào DB và trả về ID được tạo)
     *
     * @param totalAmount 合計金額（申請額）
     * @param staffId 申請者の社員ID
     * @param conn トランザクション中に使用されるDB接続オブジェクト
     * @return 挿入されたヘッダーレコードのID（主キー）
     * @throws SQLException SQL実行時のエラーが発生した場合
     * 【Supported via standard programming aids】
     */
    public int insert(int totalAmount, String staffId, Connection conn) throws SQLException {
        String sql = "INSERT INTO application_header (staff_id, application_type, amount, status, created_at) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, staffId);
            ps.setString(2, "出張費");
            ps.setInt(3, totalAmount);
            ps.setString(4, "提出済み");
            ps.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
            
            if (ps.executeUpdate() == 0) {
                throw new SQLException("ヘッダーの作成に失敗しました。");
            }

            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                } else {
                    throw new SQLException("ヘッダーIDの取得に失敗しました。");
                }
            }
        }
    }
}