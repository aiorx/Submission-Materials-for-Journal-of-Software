package service;

import java.io.IOException;
import bean.BusinessTripBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/businessTripInit")
public class BusinessTripInitServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    /**
     * 出張申請の初期画面（Step1）を表示するためのGET処理。
     * <p>
     * ・BusinessTripBean を新規作成しセッションに格納<br>
     * ・プロジェクト一覧をDBから取得しリクエストに設定<br>
     * ・入力画面 (businessTrip1.jsp) へフォワード
     *
     * @param request  クライアントからのリクエスト
     * @param response クライアントへのレスポンス
     * @throws ServletException サーブレット関連の例外
     * @throws IOException 入出力エラー
     * 【Assisted with basic coding tools】
     */
 // Trong file service/BusinessTripInitServlet.java
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        
        BusinessTripBean trip = new BusinessTripBean();
        
        session.setAttribute("trip", trip);

        session.setAttribute("isEditMode", false);
        response.sendRedirect(request.getContextPath() + "/businessTripStep1");
    }
}