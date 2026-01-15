package com.corporatebanking.controller;

import com.corporatebanking.dto.UpdateUserStatusRequestDto;
import com.corporatebanking.dto.UserResponseDto;
import com.corporatebanking.model.Client;
import com.corporatebanking.security.JwtAuthFilter;
import com.corporatebanking.service.AdminServiceImpl;
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

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = AdminController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthFilter.class
        )
)@Import(TestSecurityConfig.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminServiceImpl adminServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    // ================= GET USERS =================

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUser_shouldReturnUserList() throws Exception {

        UserResponseDto user =
                new UserResponseDto("1", "admin", "admin@mail.com", "ADMIN", true);

        when(adminServiceImpl.getAllUser()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"));
    }

    // ================= UPDATE USER STATUS =================

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateUserStatus_shouldUpdateStatus() throws Exception {

        UpdateUserStatusRequestDto request = new UpdateUserStatusRequestDto(true);

        when(adminServiceImpl.updateUserStatus("1", true))
                .thenReturn("User status updated for id:-1");

        mockMvc.perform(put("/api/admin/users/1/status")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User status updated for id:-1"));
    }

    // ================= GET CLIENTS =================

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllClients_shouldReturnClientList() throws Exception {

        when(adminServiceImpl.getAllClients())
                .thenReturn(List.of(new Client()));

        mockMvc.perform(get("/api/admin/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    // ================= FORBIDDEN =================

    @Test
    @WithMockUser(roles = "RM")
    void adminEndpoints_shouldReturn403_forNonAdmin() throws Exception {

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }
}
