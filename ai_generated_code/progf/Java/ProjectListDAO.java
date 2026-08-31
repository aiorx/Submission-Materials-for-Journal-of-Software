package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import util.DBConnection;

/**
 * {@code ProjectListDAO} は、プロジェクトの一覧情報を取得するためのDAOクラスです。
 * <p>
 * project_manage テーブルからプロジェクトコードと名称を取得し、
 * 内部クラス {@link Project} として返却します。
 * 【Supported via standard programming aids】
 */
public class ProjectListDAO {
	/**
     * プロジェクトマスタからすべてのプロジェクトコードと名称を取得します。
     *
     * @return プロジェクト情報（コード・名称）のリスト
     * 【Supported via standard programming aids】
     */
    public List<Project> getAllProjects() {
        List<Project> list = new ArrayList<>();
        String sql = "SELECT project_code, project_name FROM project_manage ORDER BY project_code";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Project p = new Project();
                p.setId(rs.getString("project_code"));
                p.setName(rs.getString("project_name"));
                list.add(p);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    /**
     * プロジェクトコードと名称を保持するシンプルな内部データクラスです。
     * 【Supported via standard programming aids】
     */
    public static class Project {
        private String id;
        private String name;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}