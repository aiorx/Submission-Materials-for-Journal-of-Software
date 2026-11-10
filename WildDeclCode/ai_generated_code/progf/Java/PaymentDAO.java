package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import bean.PaymentBean;
import util.DBConnection;

/**
 * {@code PaymentDAO} は、申請に対する支払処理と支払状況の参照を行うDAOクラスです。
 * <p>
 * application_header テーブルの status 更新や、支払一覧の取得処理を提供します。
 * 【Supported via standard programming aids】
 */
public class PaymentDAO {
	
	 /**
     * 指定された申請IDのステータスを「支払済み」に更新します。
     * <p>
     * 対象は application_header テーブルのレコードです。
     *
     * @param applicationId 支払済みに更新する対象の申請ID
     * 【Supported via standard programming aids】
     */
    public void updateStatusToPaid(int applicationId) {
        String sql = "UPDATE application_header SET status = '支払済み' WHERE application_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, applicationId);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 削除フラグが立っていない申請レコードを全件取得し、社員情報とともに支払情報として返します。
     *
     * @return 支払情報のリスト（申請ID、社員名、種別、日付、金額、ステータスなどを含む）
     * 【Supported via standard programming aids】
     */
    public ArrayList<PaymentBean> findAll() {
        ArrayList<PaymentBean> list = new ArrayList<>();

        String sql = "SELECT a.application_id, a.staff_id, s.name AS staff_name, " +
                     "a.application_type, a.created_at, a.updated_at, a.amount, a.status " +
                     "FROM application_header a " +
                     "LEFT JOIN staff s ON a.staff_id = s.staff_id " +
                     "WHERE a.delete_flag IN (0, 0) AND a.status IN ('承認済み', '支払済み')" +
                     "ORDER BY a.created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                PaymentBean bean = new PaymentBean();
                bean.setApplicationId(rs.getInt("application_id"));
                bean.setStaffId(rs.getString("staff_id"));
                bean.setStaffName(rs.getString("staff_name"));
                bean.setApplicationType(rs.getString("application_type"));
                bean.setCreatedAt(rs.getTimestamp("created_at")); // ← Sửa tên hàm & cột ở đây
                bean.setUpdatedAt(rs.getTimestamp("updated_at"));
                bean.setAmount(rs.getInt("amount"));
                bean.setStatus(rs.getString("status"));
                list.add(bean);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
}