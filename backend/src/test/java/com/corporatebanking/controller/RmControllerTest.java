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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = RmController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthFilter.class
        )
)
@Import(TestSecurityConfig.class)
class RmControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClientServiceImpl clientServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    // ================= CREATE CLIENT =================

    @Test
    @WithMockUser(username = "rm@mail.com", roles = "RM")
    void createClient_shouldCreateClient() throws Exception {

        ClientRequestDto request = new ClientRequestDto();
        request.setCompanyName("New Corp");
        request.setIndustry("Finance");

        Client client = new Client();
        client.setCompanyName("New Corp");

        when(clientServiceImpl.createClient(any(), anyString()))
                .thenReturn(client);

        mockMvc.perform(post("/api/rm/clients")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("New Corp"));
    }

    // ================= FORBIDDEN =================

    @Test
    @WithMockUser(roles = "ADMIN")
    void createClient_shouldReturn403_whenNotRm() throws Exception {

        ClientRequestDto request = new ClientRequestDto();
        request.setCompanyName("Corp");
        request.setIndustry("IT");

        mockMvc.perform(post("/api/rm/clients")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
