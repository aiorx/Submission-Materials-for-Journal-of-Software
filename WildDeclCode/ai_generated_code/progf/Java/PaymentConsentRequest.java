package com.vcsoft.ob.payment.initiation.domain.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Record representing a payment consent request.
 * Contains all information needed to create a payment consent.
 *
 * @param payerKey    The unique identifier of the payer
 * @param payeeKey    The unique identifier of the payee
 * @param amount      The payment amount
 * @param currency    The payment currency (only COP supported)
 * @param validUntil  The consent validity deadline
 *
 * Supported via standard GitHub programming aids
 */
public record PaymentConsentRequest(
        @NotBlank(message = "Payer key must not be blank")
        String payerKey,
        
        @NotBlank(message = "Payee key must not be blank") 
        String payeeKey,
        
        @NotNull(message = "Amount must not be null")
        @DecimalMin(value = "0.01", inclusive = true, message = "Amount must be greater than 0")
        BigDecimal amount,
        
        @NotBlank(message = "Currency must not be blank")
        @Pattern(regexp = "COP", message = "Only COP currency is supported")
        String currency,
        
        @NotNull(message = "Valid until date must not be null")
        LocalDateTime validUntil
) {
}
