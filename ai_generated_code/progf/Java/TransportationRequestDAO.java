//package dao;
//
//import static util.DBConnection.*;
//
//import java.sql.Connection;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.util.ArrayList;
//import java.util.List;
//
//import bean.TransportationRequest;
//
///**
// * {@code TransportationRequestDAO} は、交通機関利用申請（transportation_request テーブル）に関する
// * データの登録・取得・詳細取得を行うDAOクラスです。
// * <p>
// * IDの自動生成は tran_id_sequence テーブルを利用し、「TR000001」形式で発番されます。
// * 【Assisted with basic coding tools】
// */
//public class TransportationRequestDAO {
//	/**
//     * tran_id_sequence テーブルを利用して新たな交通申請IDを採番します。
//     * Sinh mã ID tự động từ bảng tran_id_sequence
//     *
//     * @param conn トランザクション内のDB接続
//     * @return 採番された交通申請ID（例: TR000001）
//     * @throws SQLException SQL実行時のエラー
//     * 【Assisted with basic coding tools】
//     */
//    // Thêm mới đơn xin phương tiện
//	public int insertRequest(TransportationRequest req) {
//	    String sql = "INSERT INTO transportation_request (project_code, date, destination, departure_station, arrival_station, category, transport_type, payer, amount, abstract_note, report) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//
//	    int count = 0;
//	    try (Connection conn = getConnection();
//	         PreparedStatement ps = conn.prepareStatement(sql)) {
//
//	        ps.setString(1, req.getProjectCode());
//	        ps.setString(2, req.getDate());
//	        ps.setString(3, req.getDestination());
//	        ps.setString(4, req.getDepartureStation());
//	        ps.setString(5, req.getArrivalStation());
//	        ps.setString(6, req.getCategory());
//	        ps.setString(7, req.getTransportType());
//	        ps.setString(8, req.getPayer());
//	        ps.setInt(9, req.getTotalAmount());
//	        ps.setString(10, req.getAbstractNote());
//	        ps.setString(11, req.getReport());
//
//	        count = ps.executeUpdate();
//
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	    }
//	    return count;
//	}
//
//    // Lấy toàn bộ danh sách đơn phương tiện
//    public List<TransportationRequest> getAllRequests() {
//        List<TransportationRequest> list = new ArrayList<>();
//        String sql = "SELECT * FROM transportation_request ORDER BY date DESC";
//
//        try (Connection conn = getConnection();
//             PreparedStatement ps = conn.prepareStatement(sql);
//             ResultSet rs = ps.executeQuery()) {
//
//            while (rs.next()) {
//                TransportationRequest req = new TransportationRequest();
//                req.setTransportationRequestId(rs.getString("transportation_request_id"));
//                req.setProjectCode(rs.getString("project_code"));
//                req.setDate(rs.getString("date"));
//                req.setDestination(rs.getString("destination"));
//                req.setDepartureStation(rs.getString("departure_station"));
//                req.setArrivalStation(rs.getString("arrival_station"));
//                req.setTotalAmount(rs.getInt("amount"));
//                req.setCategory(rs.getString("category"));
//                req.setTransportType(rs.getString("transport_type"));
//                req.setPayer(rs.getString("payer"));
//                req.setAbstractNote(rs.getString("abstract_note"));
//                req.setReport(rs.getString("report"));
//                list.add(req);
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return list;
//    }
//
//    // Lấy chi tiết theo mã ID
//    public TransportationRequest getRequestById(String staffId) {
//        String sql = "SELECT * FROM transportation_request WHERE staff_id = ?";
//        TransportationRequest req = null;
//
//        try (Connection conn = getConnection();
//             PreparedStatement ps = conn.prepareStatement(sql)) {
//            ps.setString(1, staffId);
//            try (ResultSet rs = ps.executeQuery()) {
//                if (rs.next()) {
//                    req = new TransportationRequest();
//                    req.setTransportationRequestId(rs.getString("transportation_request_id"));
//                    req.setProjectCode(rs.getString("project_code"));
//                    req.setDate(rs.getString("date"));
//                    req.setDestination(rs.getString("destination"));
//                    req.setDepartureStation(rs.getString("departure_station"));
//                    req.setArrivalStation(rs.getString("arrival_station"));
//                    req.setTotalAmount(rs.getInt("amount"));
//                    req.setCategory(rs.getString("category"));
//                    req.setTransportType(rs.getString("transport_type"));
//                    req.setAbstractNote(rs.getString("abstract_note"));
//                    req.setReport(rs.getString("report"));
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return req;
//    }
//}