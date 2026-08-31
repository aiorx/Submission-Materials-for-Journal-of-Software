package servlet;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * ログアウト処理を行うサーブレット。
 * セッションを破棄し、ログイン画面に遷移する。
 * 【Assisted with basic coding tools】
 */
@WebServlet("/logOutServlet")
public class LogOutServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
        // clear session
    	/**
         * セッションを破棄し、ログイン画面にフォワードする。
         * 【Assisted with basic coding tools】
         *
         * @param request HTTPリクエスト
         * @param response HTTPレスポンス
         * @throws ServletException サーブレットエラー
         * @throws IOException 入出力エラー
         */
        HttpSession session = request.getSession(false); 
        if (session != null) {
            session.invalidate(); 
        }

        // login gamen 
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
    }
}
