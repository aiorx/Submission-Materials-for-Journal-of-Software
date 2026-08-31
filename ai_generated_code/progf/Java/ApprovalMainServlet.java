package servlet;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import dao.ApplicationDAO;
import model.Application;

@WebServlet("/approverApplications")
public class ApprovalMainServlet extends HttpServlet {
	/**
	 * 承認者のIDに紐づく申請情報を取得し、申請一覧画面にフォワードする。
	 * 【Assisted with basic coding tools】
	 *
	 * @param request  HTTPリクエスト
	 * @param response HTTPレスポンス
	 * @throws ServletException サーブレット例外
	 * @throws IOException      入出力例外
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String approverId = (String) session.getAttribute("staffId");

		try {
			ApplicationDAO dao = new ApplicationDAO();

			String approver_depId = dao.findApproverDepartment(approverId);
			
            // SỬA LỖI: Đảm bảo list không bao giờ null ngay cả khi không tìm thấy phòng ban
			List<Application> applications = (approver_depId != null)
                ? dao.getApplicationsByDepartment(approver_depId)
                : Collections.emptyList();
			//            List<Application> applications = dao.getApplicationsByApprover(approverId);
			request.setAttribute("applications", applications);
		} catch (Exception e) {
			e.printStackTrace();
			request.setAttribute("applications", Collections.emptyList()); // SỬA LỖI: Luôn trả về list rỗng
		}

		request.getRequestDispatcher("/WEB-INF/views/approvalMain.jsp").forward(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException {

	    HttpSession session = request.getSession();
	    String approverId = (String) session.getAttribute("staffId");
	    String[] appIds = request.getParameterValues("appIds");  // チェックされた申請ID
	    String action = request.getParameter("action");

	    if (approverId == null || appIds == null || appIds.length == 0 || action == null) {
	        request.setAttribute("message", "申請が選択されていません。");
	        loadAndForward(request, response, approverId); // Gọi hàm helper để tải lại dữ liệu
	        return;
	    }

	    try {
	        ApplicationDAO dao = new ApplicationDAO();

	        switch (action) {
	            case "approval": // SỬA LỖI: Đổi tên từ "submit" thành "approval" để khớp với JSP
	                for (String idStr : appIds) {
	                    int appId = Integer.parseInt(idStr);
	                    dao.updateStatus(appId, approverId); // 例: ステータスを「承認済」に更新
	                }
	                session.setAttribute("message", "選択された申請を承認しました。");
	                break;

	            case "reject":
	                // 差戻し処理
                    for (String idStr : appIds) {
                        int appId = Integer.parseInt(idStr);
                        dao.rejectApplication(appId); // Gọi phương thức xử lý trả về
                    }
                    session.setAttribute("message", "選択された申請を差戻しました。");
	                break;

	            case "delete":
	                for (String idStr : appIds) {
	                    int appId = Integer.parseInt(idStr);
	                    dao.deleteApplication(appId);
	                }
	                session.setAttribute("message", "選択された申請を削除しました。");
	                break;

	            default:
	                request.setAttribute("message", "不明な操作が指定されました。");
	                loadAndForward(request, response, approverId); // SỬA LỖI: Tải lại dữ liệu
	                return;
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        request.setAttribute("message", "操作中にエラーが発生しました。");
	        loadAndForward(request, response, approverId); // SỬA LỖI: Tải lại dữ liệu
	        return;
	    }

	    // 正常終了 → 一覧ページへリダイレクト
	    response.sendRedirect("approverApplications");
	}

    /**
     * Hàm helper để tải lại danh sách đơn khi có lỗi và forward.
     * Tránh lặp code và ngăn lỗi NullPointerException.
     */
	private void loadAndForward(HttpServletRequest request, HttpServletResponse response, String approverId) throws ServletException, IOException {
	    try {
	        ApplicationDAO dao = new ApplicationDAO();
	        String approver_depId = dao.findApproverDepartment(approverId);
	        List<Application> applications = (approver_depId != null) 
	            ? dao.getApplicationsByDepartment(approver_depId) 
	            : Collections.emptyList();
	        request.setAttribute("applications", applications);
	    } catch (Exception e) {
	        e.printStackTrace();
	        request.setAttribute("applications", Collections.emptyList());
	    }
	    request.getRequestDispatcher("/WEB-INF/views/approvalMain.jsp").forward(request, response);
	}
}