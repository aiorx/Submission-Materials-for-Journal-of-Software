package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import bean.Project;
import bean.ProjectAmountDTOBean;
import bean.ProjectList;
import util.DBConnection;

/**
 * {@code ProjectDAO} は、プロジェクト情報に関連する CRUD 操作および
 * プロジェクトメンバー管理、予算情報の取得・更新などを行う DAO クラスです。
 * <p>
 * project_manage / project_member / project_budget テーブルを横断的に扱います。
 * 【Aided using common development resources】
 */
public class ProjectDAO {
	/**
	 * 指定された社員IDに割り当てられているプロジェクトの一覧を取得します。
	 *
	 * @param staffId 対象の社員ID
	 * @return 担当プロジェクトのリスト
	 * 【Aided using common development resources】
	 */
	public List<Project> getProjectsByStaff(String staffId) throws Exception {
		List<Project> list = new ArrayList<Project>();
		Connection conn = util.DBConnection.getConnection();
		String sql = "\n" +
"SELECT pm.project_code, p.project_name\n" +
"FROM project_member pm\n" +
"JOIN project_manage p ON pm.project_code = p.project_code\n" +
"WHERE pm.staff_id = ?\n" +
"ORDER BY pm.project_code\n";
		try (PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, staffId);
			try (ResultSet rs = stmt.executeQuery()) {
				while (rs.next()) {
					list.add(new Project(rs.getString("project_code"), rs.getString("project_name")));
				}
			}
		} finally {
			conn.close();
		}
		return list;
	}

	/**
	* 論理削除されていない全プロジェクトを取得します。
	*
	* @return 全プロジェクトのリスト
	* 【Aided using common development resources】
	*/
	public List<Project> getAllProjects() throws Exception {
		List<Project> list = new ArrayList<Project>();
		Connection conn = DBConnection.getConnection();
		String sql = "SELECT project_code, project_name FROM project_manage WHERE delete_flag = 0 ORDER BY project_code";
		try (PreparedStatement stmt = conn.prepareStatement(sql);
				ResultSet rs = stmt.executeQuery()) {
			while (rs.next()) {
				list.add(new Project(rs.getString("project_code"), rs.getString("project_name")));
			}
		}
		conn.close();
		return list;
	}

	public List<ProjectList> getAllProject_management() throws Exception {
		List<ProjectList> list = new ArrayList<ProjectList>();
		Connection conn = DBConnection.getConnection();

		String sql = "\n" +
"SELECT\n" +
"    pi.project_code,\n" +
"    pi.project_name,\n" +
"    pi.project_owner,\n" +
"    GROUP_CONCAT(p.name ORDER BY p.name SEPARATOR ', ') AS member_names,\n" +
"    pi.start_date,\n" +
"    pi.end_date,\n" +
"    pb.project_budget,\n" +
"    pb.project_actual\n" +
"FROM\n" +
"    project_manage pi\n" +
"LEFT JOIN\n" +
"    project_member pm ON pi.project_code = pm.project_code\n" +
"LEFT JOIN\n" +
"    staff p ON pm.staff_id = p.staff_id\n" +
"LEFT JOIN\n" +
"    project_budget pb ON pi.project_code = pb.project_code\n" +
"WHERE\n" +
"    pi.delete_flag = 0\n" +
"GROUP BY\n" +
"    pi.project_code, pi.project_name, pi.project_owner, pi.start_date, pi.end_date, pb.project_budget, pb.project_actual\n" +
"ORDER BY\n" +
"    pi.project_code\n";

		try (PreparedStatement stmt = conn.prepareStatement(sql);
				ResultSet rs = stmt.executeQuery()) {
			while (rs.next()) {
				ProjectList psl = new ProjectList();
				psl.setProject_code(rs.getString("project_code"));
				psl.setProject_name(Optional.ofNullable(rs.getString("project_name")).orElse("登録なし"));
				psl.setProject_owner(Optional.ofNullable(rs.getString("project_owner")).orElse("登録なし"));
				psl.setProject_members(Optional.ofNullable(rs.getString("member_names")).orElse("登録なし"));
				psl.setStart_date(Optional.ofNullable(rs.getString("start_date")).orElse("登録なし"));
				psl.setEnd_date(Optional.ofNullable(rs.getString("end_date")).orElse("登録なし"));
				psl.setProject_budget(rs.getObject("project_budget") != null ? rs.getInt("project_budget") : 0);
				psl.setProject_actual(rs.getObject("project_actual") != null ? rs.getInt("project_actual") : null);
				list.add(psl);
			}
		}
		conn.close();
		return list;
	}

	public void insertProject(ProjectList p) throws Exception {
		Connection conn = DBConnection.getConnection();
		try {
			conn.setAutoCommit(false);

			String sql_p_i = "\n" +
"INSERT INTO project_manage (project_code, project_name, project_owner, start_date, end_date, delete_flag)\n" +
"VALUES (?, ?, ?, ?, ?, 0)\n";
			try (PreparedStatement stmt = conn.prepareStatement(sql_p_i)) {
				stmt.setString(1, p.getProject_code());
				stmt.setString(2, p.getProject_name());
				stmt.setString(3, p.getProject_owner());
				stmt.setObject(4, p.getStart_date().isBlank() ? null : p.getStart_date(), Types.DATE);
				stmt.setObject(5, p.getEnd_date().isBlank() ? null : p.getEnd_date(), Types.DATE);
				stmt.executeUpdate();
			}

			String sql_p_b = "\n" +
"INSERT INTO project_budget (project_code, project_budget)\n" +
"VALUES (?, ?)\n";
			try (PreparedStatement stmt = conn.prepareStatement(sql_p_b)) {
				stmt.setString(1, p.getProject_code());
				if (p.getProject_budget() != null) {
					stmt.setInt(2, p.getProject_budget());
				} else {
					stmt.setNull(2, Types.INTEGER);
				}
				stmt.executeUpdate();
			}

			String memberStr = p.getProject_members();
			if (memberStr != null && !memberStr.isEmpty()) {
				String[] empIds = memberStr.split("\\s*,\\s*");
				String sql_p_m = "INSERT INTO project_member (staff_id, project_code) VALUES (?, ?)";
				try (PreparedStatement stmt = conn.prepareStatement(sql_p_m)) {
					for (String empId : empIds) {
						stmt.setString(1, empId);
						stmt.setString(2, p.getProject_code());
						stmt.addBatch();
					}
					stmt.executeBatch();
				}
			}
			conn.commit();
		} catch (Exception e) {
			conn.rollback();
			throw e;
		} finally {
			conn.close();
		}
	}

	public void updateProject(ProjectList p) throws Exception {
		Connection conn = DBConnection.getConnection();
		try {
			conn.setAutoCommit(false);

			String sql_p_i = "\n" +
"UPDATE project_manage\n" +
"SET project_name = ?, project_owner = ?, start_date = ?, end_date = ?\n" +
"WHERE project_code = ?\n";
			try (PreparedStatement stmt = conn.prepareStatement(sql_p_i)) {
				stmt.setString(1, p.getProject_name());
				stmt.setString(2, p.getProject_owner());
				stmt.setObject(3, p.getStart_date().isBlank() ? null : p.getStart_date(), Types.DATE);
				stmt.setObject(4, p.getEnd_date().isBlank() ? null : p.getEnd_date(), Types.DATE);
				stmt.setString(5, p.getProject_code());
				stmt.executeUpdate();
			}

			String sql_p_b = "UPDATE project_budget SET project_budget = ? WHERE project_code = ?";
			try (PreparedStatement stmt = conn.prepareStatement(sql_p_b)) {
				if (p.getProject_budget() != null) {
					stmt.setInt(1, p.getProject_budget());
				} else {
					stmt.setNull(1, Types.INTEGER);
				}
				stmt.setString(2, p.getProject_code());
				stmt.executeUpdate();
			}

			String sql_delete_pm = "DELETE FROM project_member WHERE project_code = ?";
			try (PreparedStatement stmt = conn.prepareStatement(sql_delete_pm)) {
				stmt.setString(1, p.getProject_code());
				stmt.executeUpdate();
			}

			String memberStr = p.getProject_members();
			if (memberStr != null && !memberStr.isEmpty()) {
				String[] empIds = memberStr.split("\\s*,\\s*");
				String sql_p_m = "INSERT INTO project_member (staff_id, project_code) VALUES (?, ?)";
				try (PreparedStatement stmt = conn.prepareStatement(sql_p_m)) {
					for (String empId : empIds) {
						stmt.setString(1, empId);
						stmt.setString(2, p.getProject_code());
						stmt.addBatch();
					}
					stmt.executeBatch();
				}
			}

			conn.commit();
		} catch (Exception e) {
			conn.rollback();
			throw e;
		} finally {
			conn.close();
		}
	}

	// ✅ 論理削除に変更済
	/**
	 * 指定されたプロジェクトコード群に対して、論理削除を実行します。
	 *
	 * @param projectCodes 削除対象のプロジェクトコード配列
	 * @throws Exception 削除対象が見つからない場合やDBエラー時
	 * 【Aided using common development resources】
	 */
	public void logicalDeleteProjects(String[] projectCodes) throws Exception {
		Connection conn = DBConnection.getConnection();
		try {
			conn.setAutoCommit(false);
			String placeholders = String.join(",", Collections.nCopies(projectCodes.length, "?"));
			String sql = "UPDATE project_manage SET delete_flag = 1 WHERE project_code IN (" + placeholders + ")";
			try (PreparedStatement stmt = conn.prepareStatement(sql)) {
				for (int i = 0; i < projectCodes.length; i++) {
					stmt.setString(i + 1, projectCodes[i]);
				}
				int updated = stmt.executeUpdate();
				if (updated == 0) {
					throw new Exception("削除対象が存在しません");
				}
			}
			conn.commit();
		} catch (Exception e) {
			conn.rollback();
			throw e;
		} finally {
			conn.close();
		}
	}

	/**
	 * 指定されたプロジェクトコードから、詳細なプロジェクト情報を1件取得します。
	 *
	 * @param project_code プロジェクトコード配列（1件のみ利用）
	 * @return 対応するプロジェクト詳細情報（ProjectList形式）
	 * 【Aided using common development resources】
	 */
	public ProjectList findByProjectCode(String[] project_code) {
		ProjectList psl = null;
		String sql = "\n" +
"SELECT pi.project_code, pi.project_name, pi.project_owner,\n" +
"       pi.start_date, pi.end_date,\n" +
"       pb.project_budget, pb.project_actual\n" +
"FROM project_manage pi\n" +
"LEFT JOIN project_budget pb ON pi.project_code = pb.project_code\n" +
"WHERE pi.project_code = ?\n";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, project_code[0]);
			try (ResultSet rs = stmt.executeQuery()) {
				if (rs.next()) {
					psl = new ProjectList();
					psl.setProject_code(rs.getString("project_code"));
					psl.setProject_name(rs.getString("project_name"));
					psl.setProject_owner(rs.getString("project_owner"));
					psl.setStart_date(rs.getString("start_date"));
					psl.setEnd_date(rs.getString("end_date"));
					psl.setProject_budget(rs.getObject("project_budget") != null ? rs.getInt("project_budget") : 0);
					psl.setProject_actual(rs.getObject("project_actual") != null ? rs.getInt("project_actual") : 0);
					psl.setProject_members(String.join(",", getStaffIdsByProject(project_code[0])));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return psl;
	}

	/**
	 * 指定されたプロジェクトに所属する社員ID一覧を取得します。
	 *
	 * @param projectCode プロジェクトコード
	 * @return そのプロジェクトに所属する社員ID配列
	 * 【Aided using common development resources】
	 */
	public String[] getStaffIdsByProject(String projectCode) {
		List<String> ids = new ArrayList<String>();
		String sql = "SELECT staff_id FROM project_member WHERE project_code = ?";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setString(1, projectCode);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					ids.add(rs.getString("staff_id"));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ids.toArray(new String[0]);
	}

	/**
	 * 指定された社員ID群に対応する社員名のマップを取得します。
	 *
	 * @param ids 社員ID配列
	 * @return 社員IDをキー、社員名を値とする順序付きマップ
	 * 【Aided using common development resources】
	 */
	public Map<String, String> getStaffNamesByIds(String[] ids) {
		Map<String, String> result = new LinkedHashMap<String, String>();
		if (ids == null || ids.length == 0)
			return result;

		String placeholders = String.join(",", Collections.nCopies(ids.length, "?"));
		String sql = "SELECT staff_id, name FROM staff WHERE staff_id IN (" + placeholders + ")";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			for (int i = 0; i < ids.length; i++) {
				ps.setString(i + 1, ids[i].trim());
			}
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					result.put(rs.getString("staff_id"), rs.getString("name"));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 指定された社員ID配列が全て存在するかを検証します。
	 *
	 * @param staffIds 検証対象の社員ID群
	 * @return すべて有効なら true、一部でも無効なら false
	 * 【Aided using common development resources】
	 */
	public boolean areStaffIdsValid(String[] staffIds) {
		if (staffIds == null || staffIds.length == 0)
			return true;

		String placeholders = String.join(",", Collections.nCopies(staffIds.length, "?"));
		String sql = "SELECT COUNT(*) FROM staff WHERE staff_id IN (" + placeholders + ")";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {
			for (int i = 0; i < staffIds.length; i++) {
				ps.setString(i + 1, staffIds[i]);
			}
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				return rs.getInt(1) == staffIds.length;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public ProjectAmountDTOBean getTotalAmountByProjectCode(String projectCode) {
		ProjectAmountDTOBean result = new ProjectAmountDTOBean();

		String sql = "\n" +
"SELECT\n" +
"    IFNULL(SUM(tr.amount), 0) AS total_transportation_amount,\n" +
"    IFNULL(SUM(rr.amount), 0) AS total_reimbursement_amount,\n" +
"    IFNULL(SUM(ad.expense_total), 0) AS total_allowance_amount,\n" +
"    IFNULL(SUM(bttd.trans_expense_total), 0) AS total_transportation_detail_amount,\n" +
"    (IFNULL(SUM(tr.amount), 0)\n" +
"     + IFNULL(SUM(rr.amount), 0)\n" +
"     + IFNULL(SUM(ad.expense_total), 0)\n" +
"     + IFNULL(SUM(bttd.trans_expense_total), 0)) AS total_project_amount\n" +
"FROM application_header ah\n" +
"LEFT JOIN transportation_request tr\n" +
"    ON ah.application_id = tr.application_id\n" +
"    AND tr.project_code = ?\n" +
"LEFT JOIN reimbursement_request rr\n" +
"    ON ah.application_id = rr.application_id\n" +
"    AND rr.project_code = ?\n" +
"LEFT JOIN business_trip_application bta\n" +
"    ON ah.application_id = bta.application_id\n" +
"    AND bta.project_code = ?\n" +
"LEFT JOIN allowance_detail ad\n" +
"    ON bta.trip_application_id = ad.trip_application_id\n" +
"LEFT JOIN business_trip_transportation_detail bttd\n" +
"    ON bta.trip_application_id = bttd.trip_application_id\n" +
"WHERE ah.status = '提出済み'\n" +
"  AND (\n" +
"        tr.project_code = ?\n" +
"     OR rr.project_code = ?\n" +
"     OR bta.project_code = ?\n" +
"  )\n";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			// Set tham số project_code cho tất cả dấu hỏi
			for (int i = 1; i <= 6; i++) {
				ps.setString(i, projectCode);
			}

			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				result.setTotalTransportationAmount(rs.getInt("total_transportation_amount"));
				result.setTotalReimbursementAmount(rs.getInt("total_reimbursement_amount"));
				result.setTotalAllowanceAmount(rs.getInt("total_allowance_amount"));
				result.setTotalTransportationDetailAmount(rs.getInt("total_transportation_detail_amount"));
				result.setTotalProjectAmount(rs.getInt("total_project_amount"));
			}

			rs.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}
	
	public Map<String, Integer> countApplicationByStatusByStaff(String staffId) {
	    Map<String, Integer> result = new HashMap<String, Integer>();
	    String sql = "\n" +
"SELECT status, COUNT(*) AS total\n" +
"FROM application_header\n" +
"WHERE staff_id = ?\n" +
"GROUP BY status\n";

	    try (Connection conn = DBConnection.getConnection();
	         PreparedStatement ps = conn.prepareStatement(sql)) {

	        ps.setString(1, staffId);

	        try (ResultSet rs = ps.executeQuery()) {
	            while (rs.next()) {
	                String status = rs.getString("status");
	                int total = rs.getInt("total");
	                result.put(status, total);
	            }
	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return result;
	}



}
