package model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * {@code Application} は、申請情報（application_header テーブル）を表すモデルクラスです。
 * <p>
 * 申請ID、種別、申請日、金額、ステータス、社員ID・社員名などの情報を保持します。
 * <br>
 * 一部フィールド（staffId / staffName）は JOIN 結果用の拡張項目です。
 * 【Assisted with basic coding tools】
 */
public class Application implements Serializable {
    private static final long serialVersionUID = 1L;

    private int applicationId;
    private String applicationType;
    private Timestamp createdAt; //appicationdateのコラムが削除したため
    private int amount;
    private String status;
    private String staffId;
    private String staffName;
    


    
    // --- Getters and Setters ---
    public int getApplicationId() { return applicationId; }
    public void setApplicationId(int applicationId) { this.applicationId = applicationId; }
    
    public String getApplicationType() { return applicationType; }
    public void setApplicationType(String applicationType) { this.applicationType = applicationType; }
    
    
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // ★★★ THÊM CÁC GETTER/SETTER NÀY VÀO ★★★
    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}