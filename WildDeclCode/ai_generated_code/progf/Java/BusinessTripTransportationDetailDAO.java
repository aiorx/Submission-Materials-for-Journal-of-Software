package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import bean.Step3Detail;

/**
 * {@code BusinessTripTransportationDetailDAO} は、出張に伴う交通費明細
 * （business_trip_transportation_detail テーブル）を登録するDAOクラスです。
 * <p>
 * 出発地・到着地・交通手段・負担区分・金額などの詳細をDBに挿入する処理を提供します。
 * 【Aided using common development resources】
 */
public class BusinessTripTransportationDetailDAO {
	/**
     * {@link Step3Detail} オブジェクトの内容を基に、出張交通費明細をDBに登録します。
     * <p>
     * 登録後、生成された交通費明細ID（主キー）を返却します。
     * (Chèn chi tiết chi phí di chuyển vào DB và trả về ID được tạo)
     *
     * @param detail 登録対象となる交通費明細情報
     * @param tripApplicationId 紐づける出張申請ID（外部キー）
     * @param conn トランザクション中に使用されるDB接続
     * @return 自動採番された交通費明細ID
     * @throws SQLException SQL実行時にエラーが発生した場合
     * 【Aided using common development resources】
     */
    public int insert(Step3Detail detail, int tripApplicationId, Connection conn) throws SQLException {
        String sql = "INSERT INTO business_trip_transportation_detail (trip_application_id, trans_project, departure, arrival, transport, fare_amount, trans_trip_type, trans_burden, trans_expense_total, trans_memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, tripApplicationId);
            ps.setString(2, detail.getTransProject());
            ps.setString(3, detail.getDeparture());
            ps.setString(4, detail.getArrival());
            ps.setString(5, detail.getTransport());
            ps.setInt(6, detail.getFareAmount());
            ps.setString(7, detail.getTransTripType());
            ps.setString(8, detail.getTransBurden());
            ps.setInt(9, detail.getTransExpenseTotal());
            ps.setString(10, detail.getTransMemo());
            
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) return keys.getInt(1);
                else throw new SQLException("交通費明細IDの取得に失敗しました。");
            }
        }
    }
    public void deleteByTripApplicationId(int tripApplicationId, Connection conn) throws SQLException {
        String sql = "DELETE FROM business_trip_transportation_detail WHERE trip_application_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, tripApplicationId);
            ps.executeUpdate();
        }
    }
}