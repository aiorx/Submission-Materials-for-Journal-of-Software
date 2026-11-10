package com.vcsoft.ob.payment.initiation.adapter.out.persistence.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity class representing a Payment Consent in the database.
 *
 * Aided with basic GitHub coding tools
 */
@Table("payment_consent")
public class PaymentConsentEntity {
    
    @Id
    @Column("consent_id")
    private String consentId;
    
    @Column("payer_key")
    private String payerKey;
    
    @Column("payee_key")
    private String payeeKey;
    
    @Column("amount")
    private BigDecimal amount;
    
    @Column("currency")
    private String currency;
    
    @Column("status")
    private String status;
    
    @Column("valid_until")
    private LocalDateTime validUntil;
    
    @Column("created_at")
    private LocalDateTime createdAt;

    // Default constructor
    public PaymentConsentEntity() {
    }

    // Builder constructor
    private PaymentConsentEntity(Builder builder) {
        this.consentId = builder.consentId;
        this.payerKey = builder.payerKey;
        this.payeeKey = builder.payeeKey;
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.status = builder.status;
        this.validUntil = builder.validUntil;
        this.createdAt = builder.createdAt;
    }

    // Getters and setters
    public String getConsentId() {
        return consentId;
    }

    public void setConsentId(String consentId) {
        this.consentId = consentId;
    }

    public String getPayerKey() {
        return payerKey;
    }

    public void setPayerKey(String payerKey) {
        this.payerKey = payerKey;
    }

    public String getPayeeKey() {
        return payeeKey;
    }

    public void setPayeeKey(String payeeKey) {
        this.payeeKey = payeeKey;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Builder pattern implementation for PaymentConsentEntity
     */
    public static class Builder {
        private String consentId;
        private String payerKey;
        private String payeeKey;
        private BigDecimal amount;
        private String currency;
        private String status;
        private LocalDateTime validUntil;
        private LocalDateTime createdAt;

        public Builder consentId(String consentId) {
            this.consentId = consentId;
            return this;
        }

        public Builder payerKey(String payerKey) {
            this.payerKey = payerKey;
            return this;
        }

        public Builder payeeKey(String payeeKey) {
            this.payeeKey = payeeKey;
            return this;
        }

        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder validUntil(LocalDateTime validUntil) {
            this.validUntil = validUntil;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PaymentConsentEntity build() {
            if (createdAt == null) {
                this.createdAt = LocalDateTime.now();
            }
            return new PaymentConsentEntity(this);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
