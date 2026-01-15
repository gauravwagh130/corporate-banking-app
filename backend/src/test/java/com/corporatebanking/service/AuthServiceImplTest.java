package com.corporatebanking.service;

import com.corporatebanking.dto.LoginRequestDto;
import com.corporatebanking.dto.LoginResponseDto;
import com.corporatebanking.dto.RegisterRequestDto;
import com.corporatebanking.exception.AlreadyExistsException;
import com.corporatebanking.model.Role;
import com.corporatebanking.model.User;
import com.corporatebanking.repository.UserRepository;
import com.corporatebanking.security.AuthUtil;
import com.corporatebanking.security.CustomeUserDetails;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AuthUtil authUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthServiceImpl authServiceImpl;

    // ================= LOGIN =================

    @Test
    void login_shouldReturnJwtTokenAndRole_whenCredentialsAreValid() {

        LoginRequestDto request =
                new LoginRequestDto("admin@mail.com", "password");

        User user = new User();
        user.setEmail("admin@mail.com");
        user.setUsername("admin");
        user.setRole(Role.ADMIN);

        CustomeUserDetails userDetails = mock(CustomeUserDetails.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUser()).thenReturn(user);
        when(authUtil.generateAccessToken(
                user.getEmail(),
                user.getUsername(),
                user.getRole().name()
        )).thenReturn("jwt-token");

        LoginResponseDto response = authServiceImpl.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getJwtToken());
        assertEquals("ADMIN", response.getRole());

        verify(authenticationManager).authenticate(any());
        verify(authUtil).generateAccessToken(any(), any(), any());
    }

    // ================= REGISTER SUCCESS =================

    @Test
    void register_shouldCreateUser_whenEmailDoesNotExist() {

        RegisterRequestDto request = new RegisterRequestDto();
        request.setUsername("rm_user");
        request.setEmail("rm@mail.com");
        request.setPassword("password");
        request.setRole(Role.RM);

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);
        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encoded-pass");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User savedUser = authServiceImpl.register(request);

        assertNotNull(savedUser);
        assertEquals("rm_user", savedUser.getUsername());
        assertEquals("rm@mail.com", savedUser.getEmail());
        assertEquals("encoded-pass", savedUser.getPassword());
        assertEquals(Role.RM, savedUser.getRole());
        assertTrue(savedUser.isActive());

        verify(userRepository).save(any(User.class));
    }

    // ================= REGISTER FAILURE =================

    @Test
    void register_shouldThrowAlreadyExistsException_whenEmailExists() {

        RegisterRequestDto request = new RegisterRequestDto();
        request.setEmail("existing@mail.com");

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        assertThrows(
                AlreadyExistsException.class,
                () -> authServiceImpl.register(request)
        );

        verify(userRepository, never()).save(any());
    }
}
