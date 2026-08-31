package com.vcsoft.ob.payment.initiation.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Record representing a payment initiation.
 * Contains all information about an initiated payment.
 *
 * @param paymentId   The unique identifier for the payment
 * @param consentId   The associated consent identifier
 * @param payerKey    The unique identifier of the payer
 * @param payeeKey    The unique identifier of the payee
 * @param amount      The payment amount
 * @param currency    The payment currency (only COP supported)
 * @param status      The current status of the payment
 * @param validUntil  The payment validity deadline
 * @param createdAt   The creation timestamp of the payment
 *
 * Supported via standard GitHub programming aids
 */
public record PaymentInitiation(
        String paymentId,
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
     * Builder pattern implementation for PaymentInitiation
     */
    public static class Builder {
        private String paymentId;
        private String consentId;
        private String payerKey;
        private String payeeKey;
        private BigDecimal amount;
        private String currency;
        private String status;
        private LocalDateTime validUntil;
        private LocalDateTime createdAt;

        public Builder paymentId(String paymentId) {
            this.paymentId = paymentId;
            return this;
        }

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

        public PaymentInitiation build() {
            return new PaymentInitiation(
                    paymentId,
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
