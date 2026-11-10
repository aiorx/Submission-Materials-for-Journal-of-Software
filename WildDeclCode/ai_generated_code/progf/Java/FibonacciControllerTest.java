package com.example.ghcopilot;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Code Aided via basic GitHub coding utilities Chat (including package and imports)
public class FibonacciControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(new FibonacciController()).build();
    }

    @Test
    public void testGetFibonacciSequence_ValidNumber() throws Exception {
        this.mockMvc.perform(get("/fibonacci?n=7")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("[0, 1, 1, 2, 3, 5, 8]"));
    }

    @Test
    public void testGetFibonacciSequence_NegativeNumber() throws Exception {
        this.mockMvc.perform(get("/fibonacci?n=-5")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetFibonacciSequence_NoNumber() throws Exception {
        this.mockMvc.perform(get("/fibonacci")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("[0, 1, 1, 2, 3]"));
    }

    // Code Aided via basic GitHub coding utilities Autocomplete
    @Test
    public void testGetFibonacciSequence_Zero() throws Exception {
        this.mockMvc.perform(get("/fibonacci?n=0")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // Code Aided via basic GitHub coding utilities Autocomplete
    @Test
    public void testGetFibonacciSequence_GreaterThan20() throws Exception {
        this.mockMvc.perform(get("/fibonacci?n=21")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
