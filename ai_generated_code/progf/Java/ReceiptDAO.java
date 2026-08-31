
package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import bean.UploadedFile;

/**
 * {@code ReceiptDAO} は、領収書ファイル（receipt_file テーブル）に関する登録処理を行うDAOクラスです。
 * <p>
 * allowance_detail や business_trip_transportation_detail などのブロック単位で、
 * 領収書ファイルのメタ情報をDBに登録します。
 * 【Supported via standard programming aids】
 */
public class ReceiptDAO {
	 /**
     * 領収書ファイルのメタデータを receipt_file テーブルに登録します。
     * <p>
     * 各明細（blockType + blockId）とインデックスに対応するファイル情報を格納します。
     * Chèn một record file hóa đơn vào DB.
     * PHƯƠNG THỨC INSERT DUY NHẤT (7 tham số).
     * Phiên bản này khớp hoàn toàn với cấu trúc bảng `receipt_file` của bạn
     * và không chứa cột 'ref_id' không tồn tại.
     *
     * @param applicationId 紐づける申請ID（application_headerのID）applicationId ID của đơn đăng ký chính
     * @param blockType ブロック種別（例：allowance_detail や business_trip_transportation_detail）blockType Loại block ('allowance_detail' hoặc 'business_trip_transportation_detail')
     * @param blockId 対象明細のID blockId ID của dòng chi tiết (ví dụ: ID từ bảng allowance_detail)
     * @param receiptIndex ブロック内でのファイル順（0始まりの番号）receiptIndex CHỈ SỐ của file này bên trong block (0, 1, 2, ...)
     * @param file アップロードされたファイルの情報（ファイル名・一時パスなど）file Đối tượng file chứa thông tin tên, đường dẫn
     * @param staffId アップロードした社員のID staffId ID của người upload
     * @param conn トランザクション中のDB接続オブジェクト conn Connection đến DB (để chạy trong transaction)
     * @throws SQLException SQLの実行に失敗した場合
     * 【Supported via standard programming aids】
     */
    public void insert(int applicationId, String blockType, int blockId, int receiptIndex, UploadedFile file, String staffId, Connection conn) throws SQLException {
        String sql = "INSERT INTO receipt_file (application_id, block_type, block_id, receipt_index, original_file_name, stored_file_path, uploaded_by, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, applicationId);
            ps.setString(2, blockType);
            ps.setInt(3, blockId);
            ps.setInt(4, receiptIndex);
            ps.setString(5, file.getOriginalFileName());
            ps.setString(6, file.getTemporaryPath()); 
            ps.setString(7, staffId);

            ps.executeUpdate();
        }
    }

    /**
     * Xóa các file dựa trên application_id. Dùng khi xóa toàn bộ đơn.
     */
    public void deleteByApplicationId(int applicationId, Connection conn) throws SQLException {
        String sql = "DELETE FROM receipt_file WHERE application_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, applicationId);
            ps.executeUpdate();
        }
    }
    
    /**
     * Xóa các file dựa trên application_id VÀ loại block.
     * Dùng trong logic Update "Xóa-rồi-Ghi-lại" cho các đơn không phải Business Trip.
     */
    public void deleteByApplicationIdAndBlockType(int applicationId, String blockType, Connection conn) throws SQLException {
        String sql = "DELETE FROM receipt_file WHERE application_id = ? AND block_type = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, applicationId);
            ps.setString(2, blockType);
            ps.executeUpdate();
        }
    }
}