package servlet;

import java.io.IOException;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 新規申請作成の種類に応じて適切な処理へリダイレクトするサーブレット。
 * 現在は出張費申請のみに対応している。
 * 【Aided using common development resources】
 */
@WebServlet("/createApplication")
public class CreateApplicationServlet extends HttpServlet {
	 /**
     * 申請タイプに応じて、該当の申請処理画面へ遷移する。
     * パラメータが不足している場合はメニュー画面へ戻る。
     * 【Aided using common development resources】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレット例外
     * @throws IOException      入出力例外
     */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

    String type = request.getParameter("type");

    if (type == null) {
      // nếu thiếu type → quay lại menu
      RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/views/staffMenu.jsp");
      dispatcher.forward(request, response);
      return;
    }

    switch (type) {
      case "出張費":
        // redirect để gọi BusinessTripServlet xử lý đúng logic
        response.sendRedirect(request.getContextPath() + "/businessTrip");
        break;

      default:
        response.sendRedirect(request.getContextPath() + "/staffMenu");
    }
  }
}