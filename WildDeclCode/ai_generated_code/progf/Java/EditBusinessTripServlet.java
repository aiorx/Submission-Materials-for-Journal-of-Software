//package servlet;
//
//import java.io.IOException;
//
//import jakarta.servlet.RequestDispatcher;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.annotation.WebServlet;
//import jakarta.servlet.http.HttpServlet;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import bean.BusinessTripBean;
//
/**
 * 出張費申請の編集画面にデータを表示するためのサーブレット。
 * 申請IDに対応する出張申請情報を取得し、編集用フォームに表示する。
 * 【Supported via standard programming aids】
 */
//@WebServlet("/editBusinessTrip")
//public class EditBusinessTripServlet extends HttpServlet {
/**
 * 申請IDに基づいて出張費申請データを取得し、リクエスト属性に設定して画面に転送する。
 * 編集モードを示すフラグも付与される。
 * 【Supported via standard programming aids】
 *
 * @param request  HTTPリクエスト
 * @param response HTTPレスポンス
 * @throws ServletException サーブレット例外
 * @throws IOException 入出力例外
 */
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        try {
//            int appId = Integer.parseInt(request.getParameter("id"));
//
//            BusinessTripDAO dao = new BusinessTripDAO();
//            BusinessTripBean trip = dao.loadBusinessTripByApplicationId(appId);
//
//            request.setAttribute("step1Data", trip.getStep1Data());
//            request.setAttribute("step2List", trip.getStep2List());
//            request.setAttribute("step3List", trip.getStep3List());
//            request.setAttribute("applicationId", appId);
//            request.setAttribute("editMode", true); // フラグ追加
//
//            RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/views/serviceJSP/businessTrip1.jsp");
//            rd.forward(request, response);
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.sendRedirect("applicationMain.jsp");
//        }
//    }
//}
