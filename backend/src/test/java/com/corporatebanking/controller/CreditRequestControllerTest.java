package com.corporatebanking.controller;

import com.corporatebanking.dto.CreditRequestRequestDto;
import com.corporatebanking.dto.CreditRequestResponseDto;
import com.corporatebanking.dto.CreditRequestUpdateDto;
import com.corporatebanking.model.CreditRequestStatus;
import com.corporatebanking.security.JwtAuthFilter;
import com.corporatebanking.service.CreditRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = CreditRequestController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthFilter.class
        )
)
@Import(TestSecurityConfig.class)
public class CreditRequestControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CreditRequestService creditRequestService;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    @WithMockUser(roles = "RM")
    void createCreditRequest_shouldReturn201_whenRmCreatesCreditRequest() throws Exception {
        CreditRequestRequestDto request = new CreditRequestRequestDto("clientId", 50000000L, 12, "Business expansion");
        CreditRequestResponseDto response = new CreditRequestResponseDto(
                "creditRequestId", "clientId", "rm1", 50000000L, 12, "Business expansion", CreditRequestStatus.PENDING, "", Instant.now()
        );
        when(creditRequestService.createCreditRequest(anyString(), any())).thenReturn(response);
        mockMvc.perform(post("/api/credit-requests")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "RM")
    void getCreditRequests_shouldReturnList() throws Exception {

        when(creditRequestService.getCreditRequests(anyString()))
                .thenReturn(List.of(new CreditRequestResponseDto()));

        mockMvc.perform(get("/api/credit-requests"))
                .andExpect(status().isOk());
    }

    // ================= GET CREDIT REQUEST BY ID =================

    @Test
    @WithMockUser(roles = "ADMIN")
    void getCreditRequestById_shouldReturnRequest() throws Exception {

        when(creditRequestService.getCreditRequestById(anyString(), anyString()))
                .thenReturn(new CreditRequestResponseDto());

        mockMvc.perform(get("/api/credit-requests/cr1"))
                .andExpect(status().isOk());
    }

    // ================= UPDATE CREDIT REQUEST (ANALYST) =================

    @Test
    @WithMockUser(roles = "ANALYST")
    void updateCreditRequestStatus_shouldReturnOk_whenAnalyst() throws Exception {

        CreditRequestUpdateDto updateDto =
                new CreditRequestUpdateDto(CreditRequestStatus.APPROVED, "Approved");

        when(creditRequestService.updateCreditRequestStatus(anyString(), anyString(), any()))
                .thenReturn(new CreditRequestResponseDto());

        mockMvc.perform(put("/api/credit-requests/cr1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk());
    }

    // ================= FORBIDDEN ACCESS =================

    @Test
    @WithMockUser(roles = "RM")
    void updateCreditRequest_shouldReturn403_whenNotAnalyst() throws Exception {

        CreditRequestUpdateDto updateDto =
                new CreditRequestUpdateDto(CreditRequestStatus.APPROVED, "Approved");

        mockMvc.perform(put("/api/credit-requests/cr1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isForbidden());
    }

}
