package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import bean.DepartmentBean;
import util.DBConnection;

/**
 * {@code DepartmentDAO} は、部署マスタ（department_master テーブル）に対する
 * 登録・更新・取得・削除などの操作を提供するDAOクラスです。
 * <p>
 * delete_flag を考慮した論理削除にも対応しています。
 * 【Supported via standard programming aids】
 */
public class DepartmentDAO {

    // 全件取得（論理削除除く 0:通常, 9:削除不可）
	/**
     * 論理削除されていない部署（delete_flag が 0 または 9）の全件を取得します。
     *
     * @return 有効な部署情報のリスト
     * 【Supported via standard programming aids】
     */
    public ArrayList<DepartmentBean> findAll() {
        ArrayList<DepartmentBean> list = new ArrayList<>();
        String sql = "SELECT * FROM department_master WHERE delete_flag IN (0, 9) ORDER BY department_id";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                DepartmentBean bean = new DepartmentBean();
                bean.setDepartment_id(rs.getString("department_id"));
                bean.setDepartment_name(rs.getString("department_name"));
                bean.setDelete_flag(rs.getInt("delete_flag"));
                list.add(bean);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // ID検索（論理削除されてないもの限定）
    /**
     * 指定された部署IDに対応する部署情報を取得します。
     * <p>
     * 論理削除されていない（delete_flag が 0 または 9）もののみ対象。
     *
     * @param id 検索対象の部署ID
     * @return 対象の部署情報（見つからない場合は null）
     * 【Supported via standard programming aids】
     */
    public DepartmentBean findById(String id) {
        DepartmentBean bean = null;
        String sql = "SELECT * FROM department_master WHERE department_id = ? AND delete_flag IN (0, 9)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                bean = new DepartmentBean();
                bean.setDepartment_id(rs.getString("department_id"));
                bean.setDepartment_name(rs.getString("department_name"));
                bean.setDelete_flag(rs.getInt("delete_flag"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return bean;
    }

    // 登録
    /**
     * 新しい部署情報を登録します。登録時の delete_flag は 0（有効）として固定されます。
     *
     * @param bean 登録対象の部署情報
     * @return 成功した場合は true、失敗した場合は false
     * 【Supported via standard programming aids】
     */
    public boolean insert(DepartmentBean bean) {
        String sql = "INSERT INTO department_master (department_id, department_name, delete_flag) VALUES (?, ?, 0)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, bean.getDepartment_id());
            ps.setString(2, bean.getDepartment_name());
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 更新（delete_flag = 0 のみ対象）
    /**
     * 指定された部署情報を更新します。delete_flag が 0 のレコードのみが対象です。
     *
     * @param bean 更新対象の部署情報
     * @return 成功した場合は true、失敗または対象なしの場合は false
     * 【Supported via standard programming aids】
     */
    public boolean update(DepartmentBean bean) {
        String sql = "UPDATE department_master SET department_name = ? WHERE department_id = ? AND delete_flag = 0";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, bean.getDepartment_name());
            ps.setString(2, bean.getDepartment_id());
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 論理削除（delete_flag = 0 のみ対象、9は削除不可）
    /**
     * 指定された部署IDに対して論理削除を実行します。
     * <p>
     * delete_flag = 0 のみ削除可能。delete_flag = 9 の場合は対象外。
     *
     * @param id 削除対象の部署ID
     * @return 削除成功時は true、失敗または対象なしは false
     * 【Supported via standard programming aids】
     */
    public boolean delete(String id) {
        String sql = "UPDATE department_master SET delete_flag = 1 WHERE department_id = ? AND delete_flag = 0";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, id);
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 次の部署IDを取得（D0001～形式）
    /**
     * 新規部署登録時に使用するための、次の部署ID（D0001 形式）を自動生成します。
     *
     * @return 次に利用可能な部署ID（例：D0005）
     * 【Supported via standard programming aids】
     */
    public String getNextDepartmentId() {
        String nextId = "D0001";
        String sql = "SELECT MAX(CAST(SUBSTRING(department_id, 2) AS UNSIGNED)) AS max_num FROM department_master";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                int num = rs.getInt("max_num") + 1;
                nextId = String.format("D%04d", num);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return nextId;
    }
}