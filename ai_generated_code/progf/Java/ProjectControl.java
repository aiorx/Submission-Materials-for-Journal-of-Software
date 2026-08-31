package servlet;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import bean.ProjectList;
import dao.ProjectDAO;

/**
 * プロジェクト管理機能を制御するサーブレット。
 * プロジェクトの登録・編集・削除・確認処理など、多岐にわたる操作を処理する。
 * 処理の種類はリクエストパラメータ「action」により分岐する。
 * 【Assisted with basic coding tools】
 */
@WebServlet("/projectControl")
public class ProjectControl extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
     * GETリクエストを受け取った場合は、POSTに処理を委譲する。
     * 【Assisted with basic coding tools】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレット処理中の例外
     * @throws IOException 入出力エラー発生時
     */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	/**
     * プロジェクトに関する各種操作を処理する。
     * リクエストの action パラメータに応じて、以下の処理を行う：
     * <ul>
     *   <li>add - 登録画面への遷移</li>
     *   <li>edit - プロジェクト編集画面への遷移とデータ取得</li>
     *   <li>delete - 論理削除</li>
     *   <li>confirmInsert, confirmUpdate - 入力確認画面への遷移</li>
     *   <li>register - 新規プロジェクトの登録</li>
     *   <li>updateFinal - プロジェクト情報の更新</li>
     * </ul>
     * 【Assisted with basic coding tools】
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @throws ServletException サーブレット処理中の例外
     * @throws IOException 入出力エラー発生時
     */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String action = request.getParameter("action");

		HttpSession session = request.getSession();

		String[] Project_code = request.getParameterValues("Project_code");
		switch (action) {
		case "add": {
			// 登録画面遷移のみ
			break;
		}
		case "edit": {
			ProjectDAO dao = new ProjectDAO();
			ProjectList p = dao.findByProjectCode(Project_code);
			String[] memberIds = dao.getStaffIdsByProject(p.getProject_code());
			String joinedIds = String.join(",", memberIds);
			p.setProject_members(joinedIds);

			Map<String, String> allStaff = dao.getStaffNamesByIds(memberIds);

			request.setAttribute("allStaff", allStaff);
			request.setAttribute("project_edit", p);

			request.getRequestDispatcher("/WEB-INF/views/projectRegister.jsp").forward(request, response);
			return;
		}

		case "delete": {
			try {
				// ✅ 論理削除メソッドを呼び出す
				new ProjectDAO().logicalDeleteProjects(Project_code);
				session.setAttribute("successMsg", "削除が完了しました！");
			} catch (Exception e) {
				e.printStackTrace();
				session.setAttribute("errorMsg", "削除処理に失敗しました。");
			}
			response.sendRedirect("project_management_view");
			return;
		}

		case "confirmInsert":
		case "confirmUpdate": {
			ProjectList p = new ProjectList();
			p.setProject_code(request.getParameter("Project_code"));
			p.setProject_name(request.getParameter("Project_name"));
			p.setProject_owner(request.getParameter("Project_owner"));
			p.setStart_date(request.getParameter("Start_date"));
			p.setEnd_date(request.getParameter("End_date"));

			String budgetStr = request.getParameter("Project_budget");
			p.setProject_budget((budgetStr == null || budgetStr.isEmpty()) ? null : Integer.parseInt(budgetStr));

			String memberStr = request.getParameter("memberIds");
			p.setProject_members(memberStr != null ? memberStr : "");

			request.setAttribute("projectConfirm", p);
			request.setAttribute("confirmMode", action.equals("confirmInsert") ? "register" : "updateFinal");

			if (memberStr != null && !memberStr.isEmpty()) {
				String[] memberIds = memberStr.split("\\s*,\\s*");
				ProjectDAO dao = new ProjectDAO();
				Map<String, String> memberMap = dao.getStaffNamesByIds(memberIds);
				request.setAttribute("memberMap", memberMap);
			}

			if (p.getStart_date() != null && p.getEnd_date() != null &&
			    !p.getStart_date().isBlank() && !p.getEnd_date().isBlank() &&
			    p.getStart_date().compareTo(p.getEnd_date()) > 0) {
				request.setAttribute("errMsg", "開始日は終了日より前の日付を入力してください。");
				request.setAttribute("project_edit", p);
				request.getRequestDispatcher("/WEB-INF/views/projectRegister.jsp").forward(request, response);
				return;
			}

			request.getRequestDispatcher("/WEB-INF/views/confirm/projectConfirm.jsp").forward(request, response);
			return;
		}

		case "register": {
			try {
				ProjectList p = new ProjectList();
				p.setProject_code(request.getParameter("Project_code"));
				p.setProject_name(request.getParameter("Project_name"));
				p.setProject_owner(request.getParameter("Project_owner"));
				p.setStart_date(request.getParameter("Start_date"));
				p.setEnd_date(request.getParameter("End_date"));

				String budgetStr = request.getParameter("Project_budget");
				p.setProject_budget((budgetStr == null || budgetStr.isEmpty()) ? null : Integer.parseInt(budgetStr));

				String memberStr = request.getParameter("memberIds");
				p.setProject_members(memberStr != null ? memberStr : "");

				ProjectDAO dao = new ProjectDAO();

				if (memberStr != null && !memberStr.isEmpty()) {
					String[] memberIds = memberStr.split("\\s*,\\s*");
					if (!dao.areStaffIdsValid(memberIds)) {
						request.setAttribute("errorMsg", "メンバーに存在しない社員IDが含まれています。");
						request.setAttribute("project_edit", p);
						request.setAttribute("screenMode", "insert");
						request.getRequestDispatcher("/WEB-INF/views/projectRegister.jsp").forward(request, response);
						return;
					}
				}

				dao.insertProject(p);
				session.setAttribute("successMsg", "登録が完了しました！");
				response.sendRedirect("project_management_view");
				return;

			} catch (Exception e) {
				e.printStackTrace();
				session.setAttribute("errorMsg", "登録処理に失敗しました。");
				response.sendRedirect("project_management_view");
				return;
			}
		}

		case "updateFinal": {
			try {
				ProjectList p = new ProjectList();
				p.setProject_code(request.getParameter("Project_code"));
				p.setProject_name(request.getParameter("Project_name"));
				p.setProject_owner(request.getParameter("Project_owner"));
				p.setStart_date(request.getParameter("Start_date"));
				p.setEnd_date(request.getParameter("End_date"));

				String budgetStr = request.getParameter("Project_budget");
				p.setProject_budget((budgetStr == null || budgetStr.isEmpty()) ? null : Integer.parseInt(budgetStr));

				String memberStr = request.getParameter("memberIds");
				p.setProject_members(memberStr != null ? memberStr : "");

				ProjectDAO dao = new ProjectDAO();

				if (memberStr != null && !memberStr.isEmpty()) {
					String[] memberIds = memberStr.split("\\s*,\\s*");
					if (!dao.areStaffIdsValid(memberIds)) {
						request.setAttribute("errorMsg", "メンバーに存在しない社員IDが含まれています。");
						request.setAttribute("project_edit", p);
						request.setAttribute("screenMode", "edit");
						request.getRequestDispatcher("/WEB-INF/views/projectRegister.jsp").forward(request, response);
						return;
					}
				}

				dao.updateProject(p);
				session.setAttribute("successMsg", "更新が完了しました！");
				response.sendRedirect("project_management_view");
				return;

			} catch (Exception e) {
				e.printStackTrace();
				session.setAttribute("errorMsg", "更新処理に失敗しました。");
				response.sendRedirect("project_management_view");
				return;
			}
		}

		default:
			throw new IllegalArgumentException("ProjectControlでcaseの遷移に失敗しました");
		}

		request.getRequestDispatcher("/WEB-INF/views/projectRegister.jsp").forward(request, response);
	}
}
