package com.vcsoft.ob.payment.initiation.adapter.out.persistence.repository;

import com.vcsoft.ob.payment.initiation.adapter.out.persistence.entity.PaymentConsentEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

/**
 * Repository for accessing payment consent data in the database.
 *
 * Aided with basic GitHub coding tools
 */
@Repository
public interface PaymentConsentRepository extends ReactiveCrudRepository<PaymentConsentEntity, String> {
    
    /**
     * Find a payment consent by its unique identifier.
     *
     * @param consentId the consent identifier
     * @return a Mono with the payment consent entity if found, or empty if not found
     */
    Mono<PaymentConsentEntity> findByConsentId(String consentId);
}
