package com.corporatebanking.service;

import com.corporatebanking.dto.UserResponseDto;
import com.corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.Role;
import com.corporatebanking.model.User;
import com.corporatebanking.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // ================= SUCCESS CASE =================

    @Test
    void getCurrentUser_shouldReturnUser_whenUserExists() {

        // Arrange: set authentication
        String email = "user@mail.com";
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(email, null);
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId("u1");
        user.setUsername("gaurav");
        user.setEmail(email);
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmail(email))
                .thenReturn(Optional.of(user));

        // Act
        UserResponseDto response = userService.getCurrentUser();

        // Assert
        assertEquals("u1", response.id());
        assertEquals("gaurav", response.username());
        assertEquals(email, response.email());
        assertEquals("ADMIN", response.role());
        assertTrue(response.active());
    }

    // ================= USER NOT FOUND =================

    @Test
    void getCurrentUser_shouldThrowException_whenUserNotFound() {

        // Arrange
        String email = "missing@mail.com";
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(email, null);
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(
                ResourceNotFoundException.class,
                () -> userService.getCurrentUser()
        );
    }
}
