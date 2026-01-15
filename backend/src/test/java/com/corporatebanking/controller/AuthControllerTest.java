package com.corporatebanking.controller;

import com.corporatebanking.dto.LoginRequestDto;
import com.corporatebanking.dto.LoginResponseDto;
import com.corporatebanking.dto.RegisterRequestDto;
import com.corporatebanking.model.Role;
import com.corporatebanking.model.User;
import com.corporatebanking.security.JwtAuthFilter;
import com.corporatebanking.service.AuthServiceImpl;
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

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = AuthController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthFilter.class
        )
)
@Import(TestSecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthServiceImpl authServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    // ================= LOGIN =================

    @Test
    void login_shouldReturnJwtAndRole() throws Exception {

        LoginRequestDto request =
                new LoginRequestDto("admin@mail.com", "password");

        when(authServiceImpl.login(any()))
                .thenReturn(new LoginResponseDto("jwt-token", "ADMIN"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwtToken").value("jwt-token"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    // ================= REGISTER =================

    @Test
    @WithMockUser(roles = "ADMIN")
    void register_shouldCreateUser() throws Exception {

        RegisterRequestDto request = new RegisterRequestDto();
        request.setUsername("user");
        request.setEmail("user@mail.com");
        request.setPassword("pass");
        request.setRole(Role.RM);

        User user = new User();
        user.setUsername("user");
        user.setEmail("user@mail.com");
        user.setRole(Role.RM);

        when(authServiceImpl.register(any())).thenReturn(user);

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user"));
    }

    // ================= UNAUTHORIZED =================

    @Test
    @WithMockUser(roles = "RM") // NOT ADMIN
    void register_shouldReturn403_whenUserIsNotAdmin() throws Exception {

        RegisterRequestDto request = new RegisterRequestDto();
        request.setUsername("user");
        request.setEmail("user@mail.com");
        request.setPassword("pass");
        request.setRole(Role.RM);

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

}
