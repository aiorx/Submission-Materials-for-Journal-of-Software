package service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import bean.ReimbursementApplicationBean;
import bean.ReimbursementDetailBean;
import bean.UploadedFile;
import dao.ApplicationDAO;
import dao.ReceiptDAO;
import dao.ReimbursementDAO;
import util.DBConnection;

@WebServlet("/reimbursementSubmit")
public class ReimbursementSubmitServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String PERMANENT_UPLOAD_DIR = "/uploads"; 

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        String staffId = (String) session.getAttribute("staffId");

        if (session == null || session.getAttribute("reimbursement") == null || staffId == null) {
            response.sendRedirect(request.getContextPath() + "/home");
            return;
        }

        ReimbursementApplicationBean reimbursement = (ReimbursementApplicationBean) session.getAttribute("reimbursement");
        Connection conn = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            ApplicationDAO appDAO = new ApplicationDAO();
            ReimbursementDAO reimbursementDAO = new ReimbursementDAO();
            ReceiptDAO receiptDAO = new ReceiptDAO();

            reimbursement.calculateTotalAmount();
            
            int applicationId = appDAO.insertApplication("立替金", staffId, reimbursement.getTotalAmount(), conn);

            for (ReimbursementDetailBean detail : reimbursement.getDetails()) {
                
                int blockId = reimbursementDAO.insert(detail, applicationId, conn);

                List<UploadedFile> filesForBlock = detail.getTemporaryFiles();
                for (int i = 0; i < filesForBlock.size(); i++) {
                    UploadedFile tempFile = filesForBlock.get(i);
                    moveFileToFinalLocation(tempFile, request);
                    
                    receiptDAO.insert(applicationId, "reimbursement_request", blockId, i, tempFile, staffId, conn);
                }
            }
            
            conn.commit();
            session.removeAttribute("reimbursement"); 

            request.setAttribute("message", "申請が正常に送信されました。 (Mã đơn: " + applicationId + ")");
            request.getRequestDispatcher("/WEB-INF/views/submitSuccess.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            if (conn != null) { try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); } }
            request.setAttribute("errorMessage", "データベース保存エラー：" + e.getMessage());
            request.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(request, response);
        } finally {
            if (conn != null) { try { conn.close(); } catch (SQLException e) { e.printStackTrace(); } }
        }
    }

    /**
     * 一時的に保存されている添付ファイルを正式な保存先へ移動する。
     * 保存完了後、ファイルパスの更新も行う。
     * 【Supported via standard programming aids】
     *
     * @param tempFile 保存対象の一時ファイル情報
     * @param request  サーブレットリクエスト（アプリケーションルート取得に使用）
     * @throws IOException ファイル操作中に発生した入出力例外
     */
    // ★★★ SỬA LỖI CÚ PHÁP: DÙNG Files.exists và Files.createDirectories ★★★
    private void moveFileToFinalLocation(UploadedFile tempFile, HttpServletRequest request) throws IOException {
        String realPath = request.getServletContext().getRealPath("");
        Path source = Paths.get(realPath + tempFile.getTemporaryPath());
        
        if (Files.exists(source)) {
            Path destinationDir = Paths.get(realPath + PERMANENT_UPLOAD_DIR);
            if (!Files.exists(destinationDir)) {
                Files.createDirectories(destinationDir);
            }
            Path destination = destinationDir.resolve(tempFile.getUniqueStoredName());
            Files.move(source, destination, StandardCopyOption.REPLACE_EXISTING);
            // Cập nhật lại đường dẫn trong bean thành đường dẫn cuối cùng
//            tempFile.setStoredFilePath(PERMANENT_UPLOAD_DIR + "/" + tempFile.getUniqueStoredName());
            tempFile.setTemporaryPath(PERMANENT_UPLOAD_DIR + "/" + tempFile.getUniqueStoredName());
        }
    }
}