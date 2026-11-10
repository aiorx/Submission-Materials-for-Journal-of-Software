package servlet;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import bean.Project;
import dao.ProjectDAO;

/**
 * プロジェクト一覧を取得して表示するサーブレット。
 * 出張申請画面などから利用され、プロジェクト情報を取得してJSPに渡す。
 * 【Assisted with basic coding tools】
 */
@WebServlet("/projectList")
public class ProjectListServlet extends HttpServlet {
	/**
     * プロジェクト一覧を取得し、リクエスト属性に設定してJSPへフォワードする。
     * 主に出張申請入力画面などで利用される。
     * 【Assisted with basic coding tools】
     *
     * @param req  HTTPリクエスト
     * @param resp HTTPレスポンス
     * @throws ServletException サーブレット処理中の例外
     * @throws IOException 入出力エラーが発生した場合
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            ProjectDAO dao = new ProjectDAO();
            List<Project> projectList = dao.getAllProjects();
            req.setAttribute("projectList", projectList);
            req.getRequestDispatcher("/WEB-INF/views/serviceJSP/businessTrip1.jsp").forward(req, resp);
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}