package com.nomlybackend.nomlybackend.controller;

import com.nomlybackend.nomlybackend.model.emails.OTPDetails;
import com.nomlybackend.nomlybackend.model.emails.RegistrationRequest;
import com.nomlybackend.nomlybackend.model.emails.OtpVerificationRequest;
import com.nomlybackend.nomlybackend.model.emails.RegistrationResponse;
import com.nomlybackend.nomlybackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

// PLEASE DONT SPAM THE EMAIL WE ONLY HAVE 100 FREE PER DAY
// Aided using common development resources - edited by Erika
// External sources - sendgrid email tutorial and setup
@RestController
@RequestMapping("/email")
public class RegistrationController {

    @Autowired
    private EmailService emailService;
    private static final Map<String, OTPDetails> OTPMap = new ConcurrentHashMap<>();

    private static final int OTPTImer = 5;

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> sendOtp(@RequestBody RegistrationRequest request) {
        try
        {
            // Get the email of the user that was passed
            String PassedEmail = request.getEmail();
            if (PassedEmail == null || PassedEmail.isEmpty()) {
                return ResponseEntity.badRequest().body(new RegistrationResponse("Email required. Cannot be empty"));
            }

            // We need to generate the code then send it via email
            String OTPNumber = CreateOTPCode();
            // get the current datetime now which will be used to see if OTP has expired or not
            LocalDateTime DateTimeExpiry = LocalDateTime.now().plusMinutes(OTPTImer);

            OTPMap.put(PassedEmail, new OTPDetails(OTPNumber, DateTimeExpiry));
            // send email
            emailService.sendOtpEmail(PassedEmail, OTPNumber);

            // if the response of the email work then send this
            return ResponseEntity.ok(new RegistrationResponse("OTP has been sent to Email."));
        } catch (MailException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        // get the stuff
        String email = request.getEmail();
        String otp = request.getOtp();

        OTPDetails otpDetails = OTPMap.get(email);

        // Check if OTP exist
        if (otpDetails == null) {
            return ResponseEntity.ok(false);
        }

        // Check if otp has hit the expiration then output OTP expired
        if (LocalDateTime.now().isAfter(otpDetails.expiry)) {
            OTPMap.remove(email);
            return ResponseEntity.ok(false);
        }

        // if OTP give is not the same, output error
        if (!otpDetails.code.equals(otp)) {
            return ResponseEntity.ok(false);
        }

        // when OTP is valid ===========================
        OTPMap.remove(email);
        return ResponseEntity.ok(true);
    }

    private String CreateOTPCode() {
        Random r = new Random();
        String randomNumber = String.format("%04d", (Object) Integer.valueOf(r.nextInt(9999)));
        System.out.println(randomNumber);
        return randomNumber;
    }

    // Simple otpDetails to store OTP and its expiry time

}
