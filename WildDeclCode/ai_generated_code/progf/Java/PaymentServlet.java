package servlet;

import java.io.IOException;
import java.util.ArrayList;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import bean.PaymentBean;
import dao.PaymentDAO;

/**
 * 支払処理および支払一覧表示を担当するサーブレット。
 * 支払対象データの取得・表示、および支払ステータスの更新を行う。
 * 【Supported via standard programming aids】
 */
@WebServlet("/payment")
public class PaymentServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * 支払対象の一覧データを取得し、`payment.jsp` へフォワードする。
     * 【Supported via standard programming aids】
     *
     * @param req HTTPリクエスト
     * @param resp HTTPレスポンス
     * @throws ServletException サーブレットエラー発生時
     * @throws IOException 入出力エラー発生時
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PaymentDAO dao = new PaymentDAO();
        ArrayList<PaymentBean> list = dao.findAll();

        req.setAttribute("paymentList", list);
        req.getRequestDispatcher("/payment.jsp").forward(req, resp);
    }

    /**
     * チェックされた申請IDに対して「支払済」ステータスを更新し、支払一覧画面へリダイレクトする。
     * 【Supported via standard programming aids】
     *
     * @param req HTTPリクエスト（支払対象のIDを含む）
     * @param resp HTTPレスポンス
     * @throws ServletException サーブレットエラー発生時
     * @throws IOException 入出力エラー発生時
     */
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        String[] appIds = req.getParameterValues("appIds");

        if (appIds != null) {
            PaymentDAO dao = new PaymentDAO();
            for (String id : appIds) {
                dao.updateStatusToPaid(Integer.parseInt(id));
            }
        }

        resp.sendRedirect(req.getContextPath() + "/payment");
    }
}
