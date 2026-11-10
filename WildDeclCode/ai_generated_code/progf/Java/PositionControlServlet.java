package servlet;

import java.io.IOException;
import java.util.ArrayList;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import bean.PositionBean;
import dao.PositionDAO;

/**
 * 役職マスタの登録・更新・削除・一覧表示などの操作を行うサーブレット。
 * ユーザーの操作（create / update / delete など）に応じて対応する処理を実行し、画面遷移を制御する。
 * 【Aided using common development resources】
 */
@WebServlet("/positionControl")
public class PositionControlServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * doPost メソッドを呼び出して全てのリクエストを統一処理する。
     * 【Aided using common development resources】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレットエラー発生時
     * @throws IOException 入出力エラー発生時
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    /**
     * アクションパラメータに応じて、役職の確認、登録、更新、削除などの処理を実行する。
     * 処理完了後、一覧画面へのリダイレクトまたは該当画面へフォワードを行う。
     * 【Aided using common development resources】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレットエラー発生時
     * @throws IOException 入出力エラー発生時
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession();
        PositionDAO dao = new PositionDAO();

        String action = request.getParameter("action");
        String id = request.getParameter("position_id");
        String name = request.getParameter("position_name");

        try {
            switch (action) {
                case "confirm_create":
                    // 登録確認画面へ
                    PositionBean newBean = new PositionBean(id, name);
                    request.setAttribute("position", newBean);
                    request.setAttribute("action", "create");
                    request.getRequestDispatcher("position_confirm.jsp").forward(request, response);
                    return;

                case "confirm_update":
                    // 編集確認画面へ
                    PositionBean updateCheckBean = new PositionBean(id, name);
                    request.setAttribute("position", updateCheckBean);
                    request.setAttribute("action", "update");
                    request.getRequestDispatcher("position_confirm.jsp").forward(request, response);
                    return;

                case "create":
                    // DB登録処理
                    PositionBean insertBean = new PositionBean(id, name);
                    if (dao.insert(insertBean)) {
                        session.setAttribute("successMsg", "登録に成功しました。");
                    } else {
                        session.setAttribute("errorMsg", "登録に失敗しました。");
                    }
                    break;

                case "update":
                    PositionBean updateBean = new PositionBean(id, name);
                    if (dao.update(updateBean)) {
                        session.setAttribute("successMsg", "更新に成功しました。");
                    } else {
                        session.setAttribute("errorMsg", "更新に失敗しました。");
                    }
                    break;

                case "delete":
                    if (dao.delete(id)) {
                        session.setAttribute("successMsg", "削除に成功しました。");
                    } else {
                        session.setAttribute("errorMsg", "削除に失敗しました。");
                    }
                    break;

                case "edit":
                    PositionBean editTarget = dao.findById(id);
                    request.setAttribute("position", editTarget);
                    request.getRequestDispatcher("edit_position.jsp").forward(request, response);
                    return;

                case "add":
                    // 自動採番IDを取得して登録画面へ
                    String newId = dao.getNextPositionId();
                    PositionBean bean = new PositionBean();
                    bean.setPosition_id(newId);
                    request.setAttribute("position", bean);
                    request.getRequestDispatcher("add_position.jsp").forward(request, response);
                    return;

                default:
//                    session.setAttribute("errorMsg", "不正なアクションです。");
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("errorMsg", "エラーが発生しました。");
        }

        // 一覧を再取得してセッションに保存
        ArrayList<PositionBean> list = dao.findAll();
        session.setAttribute("position_list", list);

        // 一覧ページにリダイレクト（PRGパターン）
        response.sendRedirect("position.jsp");
    }
}