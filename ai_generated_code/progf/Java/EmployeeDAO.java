package dao;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import bean.Employee;
import util.DBConnection;

/**
 * {@code EmployeeDAO} は、社員情報（staff テーブル）に関する
 * 登録・更新・検索・削除などの処理を行うDAOクラスです。
 * <p>
 * 部署・役職情報と結合した社員一覧取得や論理削除にも対応しています。
 * 【Assisted with basic coding tools】
 */
public class EmployeeDAO {

	public void initAdminAccount() {
		String sql = "SELECT COUNT(*) FROM staff WHERE staff_id = 'admin'";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			ResultSet rs = ps.executeQuery();

			if (rs.next() && rs.getInt(1) == 0) {
				System.out.println("管理者アカウントがまだありません。作成中です...");

				// Tạo đối tượng Employee cho admin
				Employee admin = new Employee();
				admin.setEmployeeId("admin");
				admin.setPassword(Employee.hashPassword("admin123"));
				admin.setFullName("Administrator");
				admin.setFurigana(null); 
				admin.setBirthDate(null);
				admin.setAddress(null);
				admin.setJoinDate(new java.sql.Date(System.currentTimeMillis()));
				admin.setDepartmentId("D0002"); 
				admin.setPositionId("P0002"); 

				if (insertEmployee(admin)) {
					System.out.println("adminアカウント登録できました！");
				} else {
					System.out.println("adminアカウント登録できませんでした！");
				}
			} else {
				System.out.println("adminアカウントがありました！");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String hashPassword(String password) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] hash = md.digest(password.getBytes());
			StringBuilder hexString = new StringBuilder();
			for (byte b : hash) {
				hexString.append(String.format("%02x", b));
			}
			return hexString.toString();
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}

	public boolean insertEmployee(Employee emp) {
		String sql = """
				INSERT INTO staff (staff_id, password, name, furigana, birth_date, address, hire_date, department_id, position_id)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
				""";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, emp.getEmployeeId());
			ps.setString(2, emp.getPassword());
			ps.setString(3, emp.getFullName());
			ps.setString(4, emp.getFurigana());
			ps.setDate(5, emp.getBirthDate());
			ps.setString(6, emp.getAddress());
			ps.setDate(7, emp.getJoinDate());
			ps.setString(8, emp.getDepartmentId());
			ps.setString(9, emp.getPositionId());

			ps.executeUpdate();
			return true;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	public List<Employee> getAllEmployees() {
		List<Employee> list = new ArrayList<>();
		String sql = """
				SELECT s.*, d.*, p.*
				FROM staff AS s
				JOIN department_master AS d ON s.department_id = d.department_id
				JOIN position_master AS p ON s.position_id = p.position_id
				WHERE s.delete_flag IN (0, 9)
				ORDER BY s.staff_id
				""";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {
				Employee e = new Employee();
				e.setEmployeeId(rs.getString("staff_id"));
				e.setPassword(rs.getString("password"));
				e.setFullName(rs.getString("name"));
				e.setFurigana(rs.getString("furigana"));
				e.setBirthDate(rs.getDate("birth_date"));
				e.setAddress(rs.getString("address"));
				e.setJoinDate(rs.getDate("hire_date"));
				e.setDepartmentName(rs.getString("department_name"));
				e.setPositionName(rs.getString("position_name"));
				list.add(e);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}
	public Employee findByIdAndPassword(String staffId, String rawPassword) {
		Employee staff = null;
		String sql = "SELECT * FROM staff WHERE staff_id = ? AND TRIM(password) = ? AND delete_flag IN (0, 9)";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement stmt = conn.prepareStatement(sql)) {

			stmt.setString(1, staffId);
			stmt.setString(2, rawPassword);

			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				staff = new Employee();
				staff.setEmployeeId(rs.getString("staff_id"));
				staff.setFullName(rs.getString("name"));
				staff.setPositionId(rs.getString("position_id"));
				staff.setDepartmentId(rs.getString("department_id"));
				staff.setPassword(rs.getString("password"));
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return staff;
	}

	public String findPasswordById(String staffId) throws Exception {
		String sql = "SELECT password FROM staff WHERE staff_id = ?";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, staffId);
			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				return rs.getString("password");
			}
		}
		return null;
	}

	public Employee findById(String staffId) {
		Employee emp = null;
		String sql = "SELECT * FROM staff WHERE staff_id = ? AND delete_flag IN (0, 9)";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, staffId);
			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				emp = new Employee();
				emp.setEmployeeId(rs.getString("staff_id"));
				emp.setFullName(rs.getString("name"));
				emp.setFurigana(rs.getString("furigana"));
				emp.setBirthDate(rs.getDate("birth_date"));
				emp.setAddress(rs.getString("address"));
				emp.setJoinDate(rs.getDate("hire_date"));
				emp.setPassword(rs.getString("password"));
				emp.setDepartmentId(rs.getString("department_id"));
				emp.setPositionId(rs.getString("position_id"));
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return emp;
	}

	public boolean updateEmployee(Employee emp) {
		String sql = """
				UPDATE staff
				SET password = ?, name = ?, furigana = ?, birth_date = ?, address = ?, hire_date = ?, department_id = ?, position_id = ?
				WHERE staff_id = ? AND delete_flag = 0
				""";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, emp.getPassword());
			ps.setString(2, emp.getFullName());
			ps.setString(3, emp.getFurigana());
			ps.setDate(4, emp.getBirthDate());
			ps.setString(5, emp.getAddress());
			ps.setDate(6, emp.getJoinDate());
			ps.setString(7, emp.getDepartmentId());
			ps.setString(8, emp.getPositionId());
			ps.setString(9, emp.getEmployeeId());

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean logicalDeleteEmployee(String staffId) {
		String sql = "UPDATE staff SET delete_flag = 1 WHERE staff_id = ?";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, staffId);
			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}
