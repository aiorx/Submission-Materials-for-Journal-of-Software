package com.elite.springboot.orderservice.service;

import com.elite.springboot.orderservice.entity.Order;
import com.elite.springboot.orderservice.external.client.ProductService;
import com.elite.springboot.orderservice.model.OrderResponse;
import com.elite.springboot.orderservice.model.PaymentResponse;
import com.elite.springboot.orderservice.model.ProductResponse;
import com.elite.springboot.orderservice.repository.IOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

//this code is Assisted with basic coding tools
class GeneratedOrderServiceTest {

    @Mock
    private ProductService productService;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private IOrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @DisplayName("Test1: positive case: to get order details") //this name will come in report generated for test cases
    @Test
    void testGetOrderDetails() {
        // Arrange
        long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setAmount(100);
        order.setOrderDate(Instant.now());
        order.setOrderStatus("CREATED");
        order.setProductId(123L);

        ProductResponse productResponse = new ProductResponse();
        productResponse.setProductId(123L);
        productResponse.setProductName("SampleProduct");

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setAmount(100);
        paymentResponse.setStatus("SUCCESS");
        paymentResponse.setPaymentDate(Instant.now());
        paymentResponse.setPaymentId(123);

        // Mock external service responses
        when(orderRepository.findById(anyLong())).thenReturn(Optional.of(order));
        when(productService.getProduct(anyLong())).thenReturn(ResponseEntity.ok(productResponse));
        when(restTemplate.getForObject(anyString(), eq(PaymentResponse.class))).thenReturn(paymentResponse);

        // Act [actual]
        OrderResponse result = orderService.getOrderDetails(orderId);

        // Verify method calls
        verify(orderRepository, times(1)).findById(anyLong());
        verify(productService, times(1)).getProduct(anyLong());
        verify(restTemplate, times(1)).getForObject(anyString(), eq(PaymentResponse.class));


        // Assert
        assertEquals(orderId, result.getOrderId());
        assertEquals(order.getAmount(), result.getAmount());
        assertEquals(order.getOrderDate(), result.getOrderDate());
        assertEquals(order.getOrderStatus(), result.getOrderStatus());

        assertEquals(productResponse.getProductId(), result.getProductDetails().getProductId());
        assertEquals(productResponse.getProductName(), result.getProductDetails().getProductName());

        assertEquals(paymentResponse.getAmount(), result.getPaymentDetails().getAmount());
        assertEquals(paymentResponse.getStatus(), result.getPaymentDetails().getStatus());
        assertEquals(paymentResponse.getPaymentDate(), result.getPaymentDetails().getPaymentDate());
        assertEquals(paymentResponse.getPaymentId(), result.getPaymentDetails().getPaymentId());
    }
}
