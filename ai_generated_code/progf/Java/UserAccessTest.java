package bank.ui;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import bank.core.Account;
import bank.core.User;
import bank.persistence.UserPersistence;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * Test class for {@link UserAccess}.
 */
class UserAccessTest {

  private UserAccess userAccess;

  @Mock
  private HttpClient mockHttpClient;

  @Mock
  private HttpResponse<String> mockHttpResponse;
  private ObjectMapper objectMapper;

  private User user;
  private Account account;
  private String endpoint;

  /**
   * Set up mock objects and test objects.
   */
  @BeforeEach
  void setUp() throws URISyntaxException, IOException, InterruptedException {
    MockitoAnnotations.openMocks(this);
    userAccess = new UserAccess();
    userAccess.setHttpClient(mockHttpClient);
    objectMapper = UserPersistence.createObjectMapper();
    user = new User("01010000000", "test", "Password123");
    account = new Account(100.0, "Test", "Checking Account", 10000000000L);
    endpoint = "http://localhost:8080/bank/users/" + user.getSsn();
    userAccess.setUser(user);
    when(mockHttpResponse.statusCode()).thenReturn(200);
    when(mockHttpResponse.body()).thenReturn(objectMapper.writeValueAsString(user));
    when(mockHttpClient.send(any(HttpRequest.class), ArgumentMatchers.<HttpResponse.BodyHandler<String>>any()))
        .thenReturn(mockHttpResponse);
  }

  /**
   * Test setUser and getUser.
   */
  @Test
  @DisplayName("Test setUser and getUser")
  void testSetAndGetUser() {
    assertEquals(user, userAccess.getUser());
  }

  /**
   * Test checkLogin when invalid.
   */
  @Test
  @DisplayName("Test checkLogin")
  void testCheckLogin() {
    assertThrows(IllegalStateException.class, () -> {
      userAccess.setUser(null);
      userAccess.checkLogin();
    });
  }

  /**
   * Test createUserRequest.
   */
  @Test
  @DisplayName("Test createUserRequest")
  void testCreateUserRequest() throws Exception {
    when(mockHttpResponse.statusCode()).thenReturn(201);
    userAccess.createUserRequest(user);
    assertNotNull(userAccess.getUser());
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint)),
    // Below line is Aided using common development resources to mock any bodyHandler
    Mockito.<HttpResponse.BodyHandler<String>>any()); 
  }

  /**
   * Test deleteUserRequest.
   */
  @Test
  @DisplayName("Test deleteUserRequest")
  void testDeleteUserRequest() throws Exception {
    userAccess.deleteUserRequest();
    assertNull(userAccess.getUser());
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint)),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test getUserRequest.
   */
  @Test
  @DisplayName("Test getUserRequest")
  void testGetUser() throws Exception {
    userAccess.getUserRequest(user.getSsn(), user.getPassword());
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint)),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test transferRequest.
   */
  @Test
  @DisplayName("Test transferRequest")
  void testTransfer() throws Exception {
    userAccess.setUser(user);
    userAccess.transferRequest(account.getAccountNumber(), 20000000000L, 100.0);
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint + "/accounts/"+ Long.toString(account.getAccountNumber()) + "/transfer")),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test paymentRequest.
   */
  @Test
  @DisplayName("Test paymentRequest")
  void testPayment() throws Exception {
    userAccess.setUser(user);
    userAccess.paymentRequest(10000000000L, 20000000000L, 100.0);
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint + "/accounts/"+ Long.toString(account.getAccountNumber()) + "/payment")),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test withdrawRequest.
   */
  @Test
  @DisplayName("Test withdrawRequest")
  void testWithdraw() throws Exception {
    userAccess.setUser(user);
    userAccess.withdrawRequest(10000000000L, 100.0);
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint + "/accounts/"+ Long.toString(account.getAccountNumber()) + "/withdraw")),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test depositRequest.
   */
  @Test
  @DisplayName("Test depositRequest")
  void testDeposit() throws Exception {
    userAccess.setUser(user);
    userAccess.depositRequest(10000000000L, 100.0);
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint + "/accounts/"+ Long.toString(account.getAccountNumber()) + "/deposit")),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test addAccountRequest.
   */
  @Test
  @DisplayName("Test addAccountRequest")
  void testAddAccount() throws Exception {
    when(mockHttpResponse.statusCode()).thenReturn(201);
    userAccess.setUser(user);
    userAccess.createAccountRequest(account);
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint + "/accounts/"+ Long.toString(account.getAccountNumber()))),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }

  /**
   * Test removeAccountRequest.
   */
  @Test
  @DisplayName("Test removeAccountRequest")
  void testRemoveAccount() throws Exception {
    userAccess.setUser(user);
    when(mockHttpResponse.statusCode()).thenReturn(200);
    userAccess.deleteAccountRequest(account.getAccountNumber());
    verify(mockHttpClient).send(argThat(request -> 
    request.uri().toString().startsWith(endpoint + "/accounts/"+ Long.toString(account.getAccountNumber()))),
    Mockito.<HttpResponse.BodyHandler<String>>any());
  }



}
