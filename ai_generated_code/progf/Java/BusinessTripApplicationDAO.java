package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import bean.BusinessTripBean;
import bean.Step1Data;
import bean.Step2Detail;
import bean.Step3Detail;
import bean.UploadedFile; // Đảm bảo bạn có bean này và nó có setter/getter
import util.DBConnection;

/**
 * {@code BusinessTripApplicationDAO} は、出張申請（business_trip_application テーブル）に関する
 * 登録処理を提供するDAOクラスです。
 * <p>
 * 申請ヘッダーに紐づく出張の開始日・終了日・プロジェクト・報告などの基本情報を保存する役割を持ちます。
 * 【Aided using common development resources】
 */
public class BusinessTripApplicationDAO {
	/**
     * {@link Step1Data} の内容をもとに出張申請データをデータベースへ登録し、
     * 自動採番された出張申請ID（主キー）を返します。
     * <p>
     * 日付の整形処理（"/" → "-"）や、申請ヘッダーとの紐づけも含まれます。
     * (Chèn thông tin cơ bản của chuyến đi vào DB và trả về ID được tạo)
     *
     * @param step1Data 出張申請画面の入力情報を保持するデータオブジェクト
     * @param applicationId 紐づける申請ヘッダーのID（application_headerテーブルの主キー）
     * @param conn トランザクション内で利用するデータベース接続
     * @return 登録された出張申請ID
     * @throws SQLException SQL実行時にエラーが発生した場合
     * 【Aided using common development resources】
     */

    // --- insert() method is omitted for brevity ---
    public int insert(Step1Data step1Data, int applicationId, Connection conn) throws SQLException {
        // ... code insert của bạn giữ nguyên, không thay đổi
        String sql = "INSERT INTO business_trip_application (application_id, start_date, end_date, project_code, report, total_days) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, applicationId);
            ps.setDate(2, java.sql.Date.valueOf(step1Data.getStartDate().replace('/', '-')));
            ps.setDate(3, java.sql.Date.valueOf(step1Data.getEndDate().replace('/', '-')));
            ps.setString(4, step1Data.getProjectCode());
            ps.setString(5, step1Data.getTripReport());
            ps.setInt(6, step1Data.getTotalDays());

            if (ps.executeUpdate() == 0) {
                throw new SQLException("出張申請の作成に失敗しました。");
            }

            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                } else {
                    throw new SQLException("出張申請IDの取得に失敗しました。");
                }
            }
        }
    }


    public BusinessTripBean loadBusinessTripByApplicationId(int applicationId) throws SQLException {
        BusinessTripBean bean = new BusinessTripBean();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        int tripApplicationId = -1;

        try {
            conn = DBConnection.getConnection(); 

            // === Tải Step 1 ===
            String step1Sql = "SELECT * FROM business_trip_application WHERE application_id = ?";
            ps = conn.prepareStatement(step1Sql);
            ps.setInt(1, applicationId);
            rs = ps.executeQuery();
            if (rs.next()) {
                tripApplicationId = rs.getInt("trip_application_id");
                Step1Data step1Data = new Step1Data();
                step1Data.setApplicationId(applicationId);
                step1Data.setStartDate(rs.getDate("start_date").toString());
                step1Data.setEndDate(rs.getDate("end_date").toString());
                step1Data.setProjectCode(rs.getString("project_code"));
                step1Data.setTripReport(rs.getString("report"));
                step1Data.setTotalDays(rs.getInt("total_days"));
                bean.setStep1Data(step1Data);
            } else {
                return null;
            }
            rs.close();
            ps.close();

            // === Tải Step 2 và File ===
            String step2Sql = "SELECT * FROM allowance_detail WHERE trip_application_id = ?";
            ps = conn.prepareStatement(step2Sql);
            ps.setInt(1, tripApplicationId);
            rs = ps.executeQuery();

            List<Step2Detail> step2Details = new ArrayList<>();
            while (rs.next()) {
                Step2Detail detail = new Step2Detail();
                int allowanceDetailId = rs.getInt("detail_id");
                //... (set các thuộc tính khác cho detail)
                detail.setRegionType(rs.getString("region_type"));
                detail.setTripType(rs.getString("trip_type"));
                detail.setHotel(rs.getString("hotel"));
                detail.setBurden(rs.getString("burden"));
                detail.setHotelFee(rs.getInt("hotel_fee"));
                detail.setDailyAllowance(rs.getInt("daily_allowance"));
                detail.setDays(rs.getInt("days"));
                detail.setExpenseTotal(rs.getInt("expense_total"));
                detail.setMemo(rs.getString("memo"));
                String adjustmentOptionsStr = rs.getString("adjustment_options");
                if (adjustmentOptionsStr != null && !adjustmentOptionsStr.isEmpty()) {
                    // Chuyển chuỗi (ví dụ: "half_day,bonus") thành List và set vào đối tượng detail
                    detail.setAdjustmentOptions(Arrays.asList(adjustmentOptionsStr.split(",")));
                } else {
                    // Nếu không có dữ liệu, set một danh sách rỗng để tránh lỗi NullPointerException
                    detail.setAdjustmentOptions(new ArrayList<>());
                }
                String fileSql = "SELECT original_file_name, stored_file_path FROM receipt_file WHERE block_id = ? AND block_type = 'allowance_detail'";
                try (PreparedStatement psFile = conn.prepareStatement(fileSql)) {
                    psFile.setInt(1, allowanceDetailId);
                    try (ResultSet rsFile = psFile.executeQuery()) {
                        List<UploadedFile> files = new ArrayList<>();
                        while (rsFile.next()) {
                            UploadedFile file = new UploadedFile();
                            file.setOriginalFileName(rsFile.getString("original_file_name"));
                            String storedPath = rsFile.getString("stored_file_path");
                            file.setTemporaryPath(storedPath);
                            
                            // === SỬA LỖI Ở ĐÂY: Gán giá trị cho uniqueStoredName ===
                            if (storedPath != null && storedPath.contains("/")) {
                                file.setUniqueStoredName(storedPath.substring(storedPath.lastIndexOf('/') + 1));
                            }
                            
                            files.add(file);
                        }
                        detail.setTemporaryFiles(files);
                    }
                }
                step2Details.add(detail);
            }
            bean.setStep2Details(step2Details);
            rs.close();
            ps.close();

            // === Tải Step 3 và File ===
            String step3Sql = "SELECT * FROM business_trip_transportation_detail WHERE trip_application_id = ?";
            ps = conn.prepareStatement(step3Sql);
            ps.setInt(1, tripApplicationId);
            rs = ps.executeQuery();
            
            List<Step3Detail> step3Details = new ArrayList<>();
            while (rs.next()) {
                 Step3Detail detail = new Step3Detail();
                 int transportDetailId = rs.getInt("detail_id");
                 //... (set các thuộc tính khác cho detail)
                 detail.setTransProject(rs.getString("trans_project"));
                 detail.setDeparture(rs.getString("departure"));
                 detail.setArrival(rs.getString("arrival"));
                 detail.setTransport(rs.getString("transport"));
                 detail.setFareAmount(rs.getInt("fare_amount"));
                 detail.setTransTripType(rs.getString("trans_trip_type"));
                 detail.setTransBurden(rs.getString("trans_burden"));
                 detail.setTransExpenseTotal(rs.getInt("trans_expense_total"));
                 detail.setTransMemo(rs.getString("trans_memo"));

                 String fileSql = "SELECT original_file_name, stored_file_path FROM receipt_file WHERE block_id = ? AND block_type = 'business_trip_transportation_detail'";
                 try (PreparedStatement psFile = conn.prepareStatement(fileSql)) {
                    psFile.setInt(1, transportDetailId);
                    try (ResultSet rsFile = psFile.executeQuery()) {
                        List<UploadedFile> files = new ArrayList<>();
                        while (rsFile.next()) {
                            UploadedFile file = new UploadedFile();
                            file.setOriginalFileName(rsFile.getString("original_file_name"));
                            String storedPath = rsFile.getString("stored_file_path");
                            file.setTemporaryPath(storedPath);

                            // === SỬA LỖI Ở ĐÂY: Gán giá trị cho uniqueStoredName ===
                            if (storedPath != null && storedPath.contains("/")) {
                                file.setUniqueStoredName(storedPath.substring(storedPath.lastIndexOf('/') + 1));
                            }
                            
                            files.add(file);
                        }
                        detail.setTemporaryFiles(files);
                    }
                }
                step3Details.add(detail);
            }
            bean.setStep3Details(step3Details);
            
            bean.calculateTotalAmount();
            return bean;

        } finally {
            if (rs != null) try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            if (ps != null) try { ps.close(); } catch (SQLException e) { e.printStackTrace(); }
            if (conn != null) try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
    public void update(Step1Data step1Data, Connection conn) throws SQLException {
        String sql = "UPDATE business_trip_application SET start_date = ?, end_date = ?, project_code = ?, report = ?, total_days = ? WHERE application_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDate(1, java.sql.Date.valueOf(step1Data.getStartDate().replace('/', '-')));
            ps.setDate(2, java.sql.Date.valueOf(step1Data.getEndDate().replace('/', '-')));
            ps.setString(3, step1Data.getProjectCode());
            ps.setString(4, step1Data.getTripReport());
            ps.setInt(5, step1Data.getTotalDays());
            ps.setInt(6, step1Data.getApplicationId()); 
            ps.executeUpdate();
        }
    }
    public int getTripApplicationIdByApplicationId(int applicationId, Connection conn) throws SQLException {
        String sql = "SELECT trip_application_id FROM business_trip_application WHERE application_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, applicationId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("trip_application_id");
                }
                throw new SQLException("Không tìm thấy trip_application_id cho application_id: " + applicationId);
            }
        }
    }
}