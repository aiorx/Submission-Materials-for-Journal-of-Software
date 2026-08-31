package br.com.lcalves.designpatterns.application.services.impl;

import br.com.lcalves.designpatterns.application.services.RegistrationNumberGeneratorService;
import br.com.lcalves.designpatterns.domain.model.Client;
import br.com.lcalves.designpatterns.domain.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Code Aided using common development resources to add more complexity to create a new client
 * Service to generate a registration for the client
 */
@Service
public class RegistrationNumberGeneratorServiceImpl implements RegistrationNumberGeneratorService {


    private final ClientRepository clientRepository;

    @Value("${design-patterns.registration-number-default}")
    private String firstRegistration = "1000";

    public RegistrationNumberGeneratorServiceImpl(final ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public String generate() {

        String lastRegistry = getRegistry();

        String registration;
        Long lastRegistrationNumber = getRegistyNumber(lastRegistry);

        do {

            String newRegistration = String.valueOf(lastRegistrationNumber + LocalDateTime.now().getMonth().getValue());
            char checkDigit = calculateCheckDigit(newRegistration);

            registration = toFormatNumber(newRegistration, checkDigit);

        } while (clientRepository.existsByRegistration(registration));

        return registration;
    }

    private String getRegistry() {

        Optional<Client> clientOpt = clientRepository.findTopByOrderByIdDesc();

        if (clientOpt.isPresent()) {
            return clientOpt.get().getRegistration();
        }

        return firstRegistration;
    }

    private Long getRegistyNumber(String lastRegistry) {
        return Long.valueOf(lastRegistry.substring(0, lastRegistry.indexOf('-')));
    }

    private static char calculateCheckDigit(String customerNumber) {

        int valueSum = 0;
        for (char c : customerNumber.toCharArray()) {
            valueSum += Character.getNumericValue(c);
        }
        valueSum = valueSum * 2;
        return (char) ('0' + (valueSum % 10));
    }

    private String toFormatNumber(String customerNumber, char checkDigit) {
        return customerNumber + "-" + checkDigit;
    }

}
