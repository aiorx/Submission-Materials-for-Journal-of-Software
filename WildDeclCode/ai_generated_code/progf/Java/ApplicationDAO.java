package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import model.Application;
import util.DBConnection;

/**
 * 申請情報（application_header テーブル）に関するデータアクセス処理を提供するDAOクラスです。
 * 出張や経費などの申請の登録・更新・取得・承認者管理などを行います。
 *【Assisted with basic coding tools】
 */

public class ApplicationDAO extends DBConnection{
	// Chèn một application header mới như một phần của transaction lớn.
	/**
	 * application_header テーブルに新しい申請データを登録します。
	 * 初期状態（status='未提出'）で、現在時刻を登録日として扱います。
	 *
	 * @param type 申請種別
	 * @param staffId 申請を行う社員のID
	 * @param amount 申請金額
	 * @param conn 外部から渡されるデータベース接続（トランザクション中）
	 * @return 登録された申請のID（自動採番された主キー）
	 * @throws SQLException SQL実行時に発生したエラー
	 * 【Assisted with basic coding tools】
	 */
	public int insertApplication(String type, String staffId, int amount, Connection conn) throws SQLException {
		String sql = "INSERT INTO application_header (application_type, staff_id, status, amount, created_at) " +
				"VALUES (?, ?, '未提出', ?, NOW())";
		try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
			ps.setString(1, type);
			ps.setString(2, staffId);
			ps.setInt(3, amount);
			ps.executeUpdate();
			try (ResultSet rs = ps.getGeneratedKeys()) {
				if (rs.next())
					return rs.getInt(1);
			}
		}
		throw new SQLException("application_header の登録に失敗しました。");
	}

	/**
	 * Gán người duyệt đơn như một phần của transaction lớn.
	 * 指定された申請に対し、承認者IDを設定します。
	 *
	 * @param applicationId 対象の申請ID
	 * @param approverId 承認者の社員ID
	 * @param conn 外部から渡されるDB接続（トランザクション中）
	 * @throws SQLException SQL実行時に発生したエラー
	 * 【Assisted with basic coding tools】
	 */
	public void setApprover(int applicationId, String approverId, Connection conn) throws SQLException {
		String sql = "UPDATE application_header SET approver_id = ? WHERE application_id = ?";
		try (PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setString(1, approverId);
			ps.setInt(2, applicationId);
			ps.executeUpdate();
		}
	}

	/**
	 * Nộp đơn (đổi status) như một phần của transaction lớn.
	 * 指定された申請が未提出（status='未提出') の場合に「提出済み」へ更新します。
	 * 同時に承認者IDを設定します。
	 *
	 * @param applicationId 対象の申請ID
	 * @param staffId 申請者の社員ID
	 * @param approverId 設定する承認者の社員ID
	 * @param conn データベース接続（トランザクション中）
	 * @throws SQLException SQL実行時のエラー
	 * 【Assisted with basic coding tools】
	 */

	public void submitApplicationIfNotYet(int applicationId, String staffId, String approverId)
			throws SQLException {
		String sql = "UPDATE application_header SET status = '提出済み', approver_id = ? " +
				"WHERE application_id = ? AND staff_id = ? AND status IN ('未提出', '差戻し')";
			
		try (PreparedStatement ps = getConnection().prepareStatement(sql)) {
			ps.setString(1, approverId);
			ps.setInt(2, applicationId);
			ps.setString(3, staffId);
			ps.executeUpdate();
		}
	}

	// =========================================================================
	// == CÁC HÀM CŨ CỦA BẠN (Đa phần là chỉ đọc, tự quản lý Connection)
	// =========================================================================

	/**
	 * すべての申請情報を取得し、申請IDの降順で返却します。
	 *
	 * @return 申請情報のリスト
	 * @throws Exception SQLまたは接続エラー時
	 * 【Assisted with basic coding tools】
	 */

	public List<Application> getAllApplications() throws Exception {
		List<Application> list = new ArrayList<>();
		String sql = "SELECT application_id, application_type, created_at, amount, status FROM application_header ORDER BY application_id DESC";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {
			while (rs.next()) {
				Application a = new Application();
				a.setApplicationId(rs.getInt("application_id"));
				a.setApplicationType(rs.getString("application_type"));
				a.setCreatedAt(rs.getTimestamp("created_at"));
				a.setAmount(rs.getInt("amount"));
				a.setStatus(rs.getString("status"));
				a.setCreatedAt(rs.getTimestamp("created_at"));
				list.add(a);
			}
		}
		return list;
	}

	/**
	 * 指定された社員IDが作成した申請情報を、申請IDの降順で取得します。
	 *
	 * @param staffId 対象の社員ID
	 * @return 該当社員の申請一覧
	 * @throws Exception SQL実行時エラー
	 * 【Assisted with basic coding tools】
	 */
	public List<Application> getApplicationsByStaffId(String staffId) throws Exception {
		List<Application> list = new ArrayList<>();
		String sql = "SELECT application_id, application_type, created_at, amount, status FROM application_header WHERE staff_id = ? AND delete_flag IN (0,9) ORDER BY application_id DESC";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setString(1, staffId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					Application a = new Application();
					a.setApplicationId(rs.getInt("application_id"));
					a.setApplicationType(rs.getString("application_type"));
					a.setCreatedAt(rs.getTimestamp("created_at"));
					a.setAmount(rs.getInt("amount"));
					a.setStatus(rs.getString("status"));
					a.setCreatedAt(rs.getTimestamp("created_at"));
					list.add(a);
				}
			}
		}
		return list;
	}

	/**
	 * 指定された社員と同じ部署で「部長」の役職を持つ社員IDを取得します。
	 *
	 * @param staffId 部署判定の元となる社員ID
	 * @return 該当する部長の社員ID（なければ null）
	 * @throws Exception SQL実行時エラー
	 * 【Assisted with basic coding tools】
	 */
	public String findManagerId(String staffId) throws Exception {
		String sql = """
				    SELECT s2.staff_id
				    FROM staff s1
				    JOIN staff s2 ON s1.department_id = s2.department_id
				    JOIN position_master p2 ON s2.position_id = p2.position_id
				    WHERE s1.staff_id = ?
				      AND p2.position_name = '部長'
				      AND s2.delete_flag = 0 AND p2.delete_flag = 0
				    LIMIT 1
				""";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setString(1, staffId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getString("staff_id");
				}
			}
		}
		return null;
	}

	/**
	 * 指定された申請IDに紐づく申請ステータス（status列）を取得します。
	 *
	 * @param appId 対象の申請ID
	 * @return ステータス（例：未提出、提出済みなど）
	 * @throws Exception SQL実行時エラー
	 * 【Assisted with basic coding tools】
	 */
	public String getApplicationStatus(int appId) throws Exception {
		String sql = "SELECT status FROM application_header WHERE application_id = ?";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setInt(1, appId);
			try (ResultSet rs = stmt.executeQuery()) {
				if (rs.next())
					return rs.getString("status");
			}
		}
		return null;
	}

	/**
	 * 申請IDから申請種別（application_type）を取得します。
	 *
	 * @param applicationId 対象の申請ID
	 * @return 申請種別（文字列）
	 * @throws Exception SQL実行時エラー
	 * 【Assisted with basic coding tools】
	 */

	public String getApplicationTypeById(int applicationId) throws Exception {
		String sql = "SELECT application_type FROM application_header WHERE application_id = ?";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setInt(1, applicationId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next())
					return rs.getString("application_type");
			}
		}
		return null;
	}

	/**
	 * 指定された申請IDに対応する申請金額を更新します。
	 *
	 * @param applicationId 対象の申請ID
	 * @param newAmount 新しい申請金額
	 * @throws Exception SQL実行時エラー
	 * 【Assisted with basic coding tools】
	 */
	public void updateApplicationAmount(int applicationId, int newAmount) throws Exception {
		String sql = "UPDATE application_header SET amount = ? WHERE application_id = ?";
		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setInt(1, newAmount);
			ps.setInt(2, applicationId);
			ps.executeUpdate();
		}
	}

	/**
	 * 指定された承認者IDに割り当てられた申請情報を取得します。
	 *
	 * @param approverId 承認者の社員ID
	 * @return 対象申請のリスト（申請者情報を含む）
	 * @throws Exception SQL実行時エラー
	 * 【Assisted with basic coding tools】
	 */

	public List<Application> getApplicationsByApprover(String approverId) throws Exception {
		List<Application> list = new ArrayList<>();
		String sql = """
				SELECT
				    ah.application_id, ah.application_type, ah.created_at,
				    ah.amount, ah.status, s.staff_id, s.name
				FROM application_header ah
				JOIN staff s ON ah.staff_id = s.staff_id
				WHERE ah.approver_id = ? AND ah.delete_flag = 0
				ORDER BY ah.created_at DESC
				""";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setString(1, approverId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					Application a = new Application();
					a.setApplicationId(rs.getInt("application_id"));
					a.setApplicationType(rs.getString("application_type"));
					a.setCreatedAt(rs.getTimestamp("created_at"));
					a.setAmount(rs.getInt("amount"));
					a.setStatus(rs.getString("status"));
					a.setCreatedAt(rs.getTimestamp("created_at"));
					a.setStaffId(rs.getString("staff_id"));
					a.setStaffName(rs.getString("name"));
					list.add(a);
				}
			}
		}
		return list;
	}
	
	// 承認者のIDを基にその承認者の部署を特定する（精算承認表示用）
	public String findApproverDepartment(String approverId) throws SQLException {
		String sql = "SELECT department_id FROM staff WHERE staff_id = ? AND delete_flag IN (0, 9)";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setString(1, approverId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getString("department_id");
				}
			}
		}
		return null;
	}

	/**
	 * 指定された部署IDに属する社員が提出した精算申請情報を取得します。
	 * ステータスが「未提出」でない申請のみ対象とします。
	 *
	 * @param departmentId 対象の部署ID（例：D0001）
	 * @return 該当申請のリスト（申請者情報を含む）
	 * @throws Exception SQL実行時エラー
	 */
	public List<Application> getApplicationsByDepartment(String departmentId) throws Exception {
	    List<Application> list = new ArrayList<>();
	    String sql = """
	        SELECT 
	            ah.application_id, ah.application_type, ah.created_at,
	            ah.amount, ah.status, s.staff_id, s.name
	        FROM application_header ah
	        JOIN staff s ON ah.staff_id = s.staff_id
	        WHERE s.department_id = ?
	          AND ah.status != '未提出'
	          AND ah.delete_flag IN (0, 9)
	          AND s.delete_flag IN (0, 9)
	        ORDER BY ah.created_at DESC
	    """;
	    try (Connection conn = DBConnection.getConnection();
	         PreparedStatement ps = conn.prepareStatement(sql)) {
	        ps.setString(1, departmentId);
	        try (ResultSet rs = ps.executeQuery()) {
	            while (rs.next()) {
	                Application a = new Application();
	                a.setApplicationId(rs.getInt("application_id"));
	                a.setApplicationType(rs.getString("application_type"));
	                a.setCreatedAt(rs.getTimestamp("created_at"));
	                a.setAmount(rs.getInt("amount"));
	                a.setStatus(rs.getString("status"));
	                a.setStaffId(rs.getString("staff_id"));
	                a.setStaffName(rs.getString("name"));
	                list.add(a);
	            }
	        }
	    }
	    return list;
	}

	/*
	 * 選択された精算申請の申請ステータスを、「承認済み」に変更する
	 */
	public void updateStatus(int applicationId, String approverId) throws Exception {
	    String sql = "UPDATE application_header SET status = '承認済み', approver_id = ?, updated_at = NOW() WHERE application_id = ?";
	    try (Connection conn = DBConnection.getConnection();
	         PreparedStatement stmt = conn.prepareStatement(sql)) {
	        // SỬA LẠI THAM SỐ VÀ THỨ TỰ
	        stmt.setString(1, approverId); 
	        stmt.setInt(2, applicationId);
	        // KẾT THÚC
	        stmt.executeUpdate();
	    }
	}

    public void updateApplication(int applicationId, int totalAmount, Connection conn) throws SQLException {
        String sql = "UPDATE application_header SET amount = ?, updated_at = NOW() WHERE application_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, totalAmount);
            ps.setInt(2, applicationId);
            ps.executeUpdate();
        }
    }
    
    /*
     * 申請ID論理削除
     */
    public void deleteApplication(int applicationId) throws Exception {
        String sql = "UPDATE application_header SET delete_flag = 1, updated_at = CURRENT_TIMESTAMP WHERE application_id = ?";

        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {

            stmt.setInt(1, applicationId);
            stmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    
    public void rejectApplication(int applicationId) throws Exception {
        String sql = "UPDATE application_header SET status = '差戻し', updated_at = NOW() WHERE application_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setInt(1, applicationId);
            stmt.executeUpdate();
        }
    }

//    public List<Application> getApplicationsByStaffIdAndStatus(String staffId, String status) throws Exception {
//        List<Application> list = new ArrayList<>();
//        String sql = "SELECT application_id, application_type, created_at, amount, status " +
//                     "FROM application_header " +
//                     "WHERE staff_id = ? AND status = ? " +
//                     "ORDER BY application_id DESC";
//
//        try (Connection conn = DBConnection.getConnection();
//             PreparedStatement ps = conn.prepareStatement(sql)) {
//            ps.setString(1, staffId);
//            ps.setString(2, status);
//
//            try (ResultSet rs = ps.executeQuery()) {
//                while (rs.next()) {
//                    Application a = new Application();
//                    a.setApplicationId(rs.getInt("application_id"));
//                    a.setApplicationType(rs.getString("application_type"));
//                    a.setCreatedAt(rs.getTimestamp("created_at"));
//                    a.setAmount(rs.getInt("amount"));
//                    a.setStatus(rs.getString("status"));
//                    list.add(a);
//                }
//            }
//        }
//        return list;
//    }
}