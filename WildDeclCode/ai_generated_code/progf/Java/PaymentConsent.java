package com.vcsoft.ob.payment.initiation.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Record representing a payment consent.
 * Contains all information about a created payment consent.
 *
 * @param consentId  The unique identifier for the consent
 * @param payerKey   The unique identifier of the payer
 * @param payeeKey   The unique identifier of the payee
 * @param amount     The payment amount
 * @param currency   The payment currency (only COP supported)
 * @param status     The current status of the consent
 * @param validUntil The consent validity deadline
 * @param createdAt  The creation timestamp of the consent
 *
 * Assisted using common GitHub development utilities
 */
public record PaymentConsent(
        String consentId,
        String payerKey,
        String payeeKey,
        BigDecimal amount,
        String currency,
        String status,
        LocalDateTime validUntil,
        LocalDateTime createdAt
) {
    /**
     * Builder pattern implementation for PaymentConsent
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

        public PaymentConsent build() {
            return new PaymentConsent(
                    consentId,
                    payerKey,
                    payeeKey,
                    amount,
                    currency,
                    status,
                    validUntil,
                    createdAt != null ? createdAt : LocalDateTime.now()
            );
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
