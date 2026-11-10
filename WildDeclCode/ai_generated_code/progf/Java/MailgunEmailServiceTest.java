package br.com.tasknoteapp.server.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.tasknoteapp.server.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/** Test class Aided with basic GitHub coding tools. I had to tweak it, to make it work. */
@ExtendWith(MockitoExtension.class)
class MailgunEmailServiceTest {

  @Mock private RestTemplate restTemplate;
  @Mock private RestTemplateBuilder restTemplateBuilder;

  private MailgunEmailService mailgunEmailService;

  @BeforeEach
  void setUp() {
    String apiKey = "abx123";
    String domain = "domain.com";
    String sender = "no-reply@domain.com";
    String target = "development";

    when(restTemplateBuilder.defaultHeader(any(), any())).thenReturn(restTemplateBuilder);
    when(restTemplateBuilder.build()).thenReturn(restTemplate);

    mailgunEmailService =
        new MailgunEmailService(apiKey, domain, sender, target, restTemplateBuilder);
  }

  @Test
  void testSendResetPassword() {
    UserEntity user = new UserEntity();
    user.setEmail("test@example.com");
    user.setResetToken("reset-token");

    when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
        .thenReturn(ResponseEntity.ok("Success"));

    mailgunEmailService.sendResetPassword(user);

    verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
  }

  @Test
  void testSendPasswordResetConfirmation() {
    UserEntity user = new UserEntity();
    user.setEmail("test@example.com");

    when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
        .thenReturn(ResponseEntity.ok("Success"));

    mailgunEmailService.sendPasswordResetConfirmation(user);

    verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
  }

  @Test
  void testSendNewUser() {
    UserEntity user = new UserEntity();
    user.setEmail("test@example.com");
    user.setEmailUuid(java.util.UUID.randomUUID());

    when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
        .thenReturn(ResponseEntity.ok("Success"));

    mailgunEmailService.sendNewUser(user);

    verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
  }

  @Test
  void testSendEmailHandlesHttpClientErrorException() {
    UserEntity user = new UserEntity();
    user.setEmail("test@example.com");
    user.setResetToken("reset-token");

    when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
        .thenThrow(new HttpClientErrorException(HttpStatusCode.valueOf(400)));

    mailgunEmailService.sendResetPassword(user);

    verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
  }

  @Test
  void testSendEmailChanged() {
    UserEntity user = new UserEntity();
    user.setEmail("test@example.com");

    when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
        .thenReturn(ResponseEntity.ok("Success"));

    String oldEmail = "old@example.com";

    mailgunEmailService.sendEmailChangedNotification(user, oldEmail);

    verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
  }
}
