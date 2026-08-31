package servlet;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import bean.Employee;
import dao.EmployeeDAO;

/**
 * 社員一覧の表示を行うサーブレット。
 * 社員情報をデータベースから取得し、一覧画面（employeeList.jsp）に表示する。
 * 登録や削除後の成功メッセージ表示にも対応している。
 * 【Assisted with basic coding tools】
 */
@WebServlet("/employeeList")
public class EmployeeListServlet extends HttpServlet {
	/**
     * POSTメソッドへ処理を委譲する。
     * 【Assisted with basic coding tools】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレット処理例外
     * @throws IOException 入出力例外
     */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException {
	    doPost(request, response);
	}
	
	/**
     * 社員一覧をデータベースから取得し、画面に表示する。
     * セッションに保存された成功メッセージ（登録・削除後）を表示する機能も持つ。
     * 【Assisted with basic coding tools】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレット処理例外
     * @throws IOException 入出力例外
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	HttpSession session = request.getSession();
    	session.removeAttribute("errorMsg"); // 念のため。employeeList.jspにエラー処理がある

        EmployeeDAO dao = new EmployeeDAO();
        List<Employee> employeeList = dao.getAllEmployees();

        String success = (String) session.getAttribute("success");
        session.removeAttribute("success");

        request.setAttribute("success", success);
        request.setAttribute("employeeList", employeeList);
        request.getRequestDispatcher("/WEB-INF/views/employeeList.jsp").forward(request, response);
    }
}
