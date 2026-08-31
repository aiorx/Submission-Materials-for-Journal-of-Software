package servlet;
import java.io.IOException;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import dao.ProjectDAO;

/**
 * ログインユーザーの役職と部署に基づき、適切なメニュー画面（JSP）へ遷移させるルーティングサーブレット。
 * 通常社員、部長（営業部）、管理部のいずれかに応じて画面を切り替える。
 * 【Assisted with basic coding tools】
 */
@WebServlet("/menu")
public class MenuRouterServlet extends HttpServlet {
	/**
     * ユーザーの役職と部署情報をセッションから取得し、適切なメニュー画面へフォワードする。
     * デフォルトは staffMenu.jsp。条件により buchouMain.jsp または managerMain.jsp に振り分けられる。
     * 【Assisted with basic coding tools】
     *
     * @param req クライアントからのHTTPリクエスト
     * @param res クライアントへのHTTPレスポンス
     * @throws ServletException サーブレットエラー発生時
     * @throws IOException 入出力エラー発生時
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        HttpSession session = req.getSession();
        String staffId = (String) session.getAttribute("staffId");
        String position = (String) session.getAttribute("position");
        String department = (String) session.getAttribute("department");

        String jspPath = "/WEB-INF/views/staffMenu.jsp"; // default
        try {
            ProjectDAO dao = new ProjectDAO();
            Map<String, Integer> statusCount = dao.countApplicationByStatusByStaff(staffId);

            req.setAttribute("countMiteishutsu", statusCount.getOrDefault("未提出", 0));
            req.setAttribute("countTeishutsu", statusCount.getOrDefault("提出済み", 0));
            req.setAttribute("countSashimodoshi", statusCount.getOrDefault("差戻し", 0));

            // Các xử lý khác...
            req.getRequestDispatcher("/WEB-INF/views/projectList.jsp").forward(req, res);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if ("部長".equals(position) && "営業部".equals(department)) {
            jspPath = "/WEB-INF/views/buchouMain.jsp";
        } else if ("管理部".equals(department)) {
            jspPath = "/WEB-INF/views/managerMain.jsp";
        }

        req.getRequestDispatcher(jspPath).forward(req, res);
    }
}