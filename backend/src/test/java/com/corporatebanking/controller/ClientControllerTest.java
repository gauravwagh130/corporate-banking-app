package com.corporatebanking.controller;

import com.corporatebanking.dto.ClientRequestDto;
import com.corporatebanking.model.Client;
import com.corporatebanking.security.JwtAuthFilter;
import com.corporatebanking.service.ClientServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = ClientController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthFilter.class
        )
)
@Import(TestSecurityConfig.class)
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClientServiceImpl clientServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    // ================= GET CLIENTS =================

    @Test
    @WithMockUser(username = "rm@mail.com", roles = "RM")
    void getClientsForRm_shouldReturnClientList() throws Exception {

        Client client = new Client();
        client.setCompanyName("ABC Ltd");

        when(clientServiceImpl.getClientsForRm(anyString(), any(), any()))
                .thenReturn(List.of(client));

        mockMvc.perform(get("/api/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].companyName").value("ABC Ltd"));
    }

    // ================= GET CLIENT BY ID =================

    @Test
    @WithMockUser(username = "rm@mail.com", roles = "RM")
    void getClientById_shouldReturnClient() throws Exception {

        Client client = new Client();
        client.setId("1");
        client.setCompanyName("XYZ Corp");

        when(clientServiceImpl.getClientById(eq("1"), anyString()))
                .thenReturn(client);

        mockMvc.perform(get("/api/clients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("XYZ Corp"));
    }

    // ================= UPDATE CLIENT =================

    @Test
    @WithMockUser(username = "rm@mail.com", roles = "RM")
    void updateClient_shouldUpdateAndReturnClient() throws Exception {

        ClientRequestDto request = new ClientRequestDto();
        request.setCompanyName("Updated Ltd");
        request.setIndustry("IT");

        Client updatedClient = new Client();
        updatedClient.setCompanyName("Updated Ltd");

        when(clientServiceImpl.updateClient(eq("1"), anyString(), any()))
                .thenReturn(updatedClient);

        mockMvc.perform(put("/api/clients/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Updated Ltd"));
    }
}
