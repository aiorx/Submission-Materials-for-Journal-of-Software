package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import bean.PositionBean;
import util.DBConnection;

/**
 * {@code PositionDAO} は、役職マスタ（position_master テーブル）に対する
 * 登録・更新・検索・削除などの操作を提供するDAOクラスです。
 * <p>
 * 論理削除やID自動生成（P0001形式）にも対応します。
 * 【Assisted with basic coding tools】
 */
public class PositionDAO {

    // 全件取得（論理削除除く 0:通常, 9:削除不可）
	/**
     * 削除フラグが 0 または 9 の役職を全件取得します。
     *
     * @return 取得した役職のリスト
     * 【Assisted with basic coding tools】
     */
    public ArrayList<PositionBean> findAll() {
        ArrayList<PositionBean> list = new ArrayList<>();
        String sql = "SELECT * FROM position_master WHERE delete_flag IN (0, 9) ORDER BY position_id";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                PositionBean bean = new PositionBean();
                bean.setPosition_id(rs.getString("position_id"));
                bean.setPosition_name(rs.getString("position_name"));
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
     * 指定された役職IDに対応するレコードを取得します。
     * <p>
     * 削除フラグが 0 または 9 のものが対象です。
     *
     * @param id 検索対象の役職ID
     * @return 該当する役職情報（見つからない場合は null）
     * 【Assisted with basic coding tools】
     */
    public PositionBean findById(String id) {
        PositionBean bean = null;
        String sql = "SELECT * FROM position_master WHERE position_id = ? AND delete_flag IN (0, 9)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                bean = new PositionBean();
                bean.setPosition_id(rs.getString("position_id"));
                bean.setPosition_name(rs.getString("position_name"));
                bean.setDelete_flag(rs.getInt("delete_flag"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return bean;
    }

    // 登録
    /**
     * 新しい役職情報を登録します。
     * <p>
     * delete_flag は 0（有効）で固定登録されます。
     *
     * @param bean 登録する役職情報
     * @return 登録に成功した場合 true、失敗した場合 false
     * 【Assisted with basic coding tools】
     */
    public boolean insert(PositionBean bean) {
        String sql = "INSERT INTO position_master (position_id, position_name, delete_flag) VALUES (?, ?, 0)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, bean.getPosition_id());
            ps.setString(2, bean.getPosition_name());
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 更新（delete_flag = 0 のみ対象）
    /**
     * 指定された役職情報を更新します（delete_flag = 0 のみ対象）。
     *
     * @param bean 更新対象の役職情報
     * @return 更新に成功した場合 true、失敗または対象なしの場合 false
     * 【Assisted with basic coding tools】
     */
    public boolean update(PositionBean bean) {
        String sql = "UPDATE position_master SET position_name = ? WHERE position_id = ? AND delete_flag = 0";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, bean.getPosition_name());
            ps.setString(2, bean.getPosition_id());
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 論理削除（delete_flag = 0 のみ対象、9は削除不可）
    /**
     * 指定された役職IDに対して論理削除を実行します。
     * <p>
     * 削除可能なのは delete_flag = 0 のデータのみです（9は削除不可）。
     *
     * @param id 削除対象の役職ID
     * @return 削除に成功した場合 true、失敗または対象外の場合 false
     * 【Assisted with basic coding tools】
     */
    public boolean delete(String id) {
        String sql = "UPDATE position_master SET delete_flag = 1 WHERE position_id = ? AND delete_flag = 0";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, id);
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 次の役職IDを取得（自動採番、4桁対応 P0001～）
    /**
     * 自動採番された次の役職ID（例：P0001, P0002...）を生成します。
     * <p>
     * 役職IDは "P" + 4桁のゼロ埋め形式で構成されます。
     *
     * @return 次に使用可能な役職ID
     * 【Assisted with basic coding tools】
     */
    public String getNextPositionId() {
        String nextId = "P0001";
        String sql = "SELECT MAX(position_id) AS max_id FROM position_master WHERE position_id LIKE 'P____'";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next() && rs.getString("max_id") != null) {
                String maxId = rs.getString("max_id").substring(1); // "P0012" → "0012"
                int num = Integer.parseInt(maxId) + 1;
                nextId = String.format("P%04d", num); // ★ 4桁ゼロ埋め
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return nextId;
    }
}
