package com.corporatebanking.service;

import com.corporatebanking.dto.UserResponseDto;
import com.corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.Client;
import com.corporatebanking.model.Role;
import com.corporatebanking.model.User;
import com.corporatebanking.repository.ClientRepository;
import com.corporatebanking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private AdminServiceImpl adminServiceImpl;

    // ================= updateUserStatus SUCCESS =================

    @Test
    void updateUserStatus_shouldUpdateUser_whenUserExists() {

        User user = new User();
        user.setId("1");
        user.setActive(false);

        when(userRepository.findById("1"))
                .thenReturn(Optional.of(user));

        String response = adminServiceImpl.updateUserStatus("1", true);

        assertEquals("User status updated for id:-1", response);
        assertTrue(user.isActive());

        verify(userRepository).save(user);
    }

    // ================= updateUserStatus FAILURE =================

    @Test
    void updateUserStatus_shouldThrowException_whenUserNotFound() {

        when(userRepository.findById("99"))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> adminServiceImpl.updateUserStatus("99", true)
        );

        verify(userRepository, never()).save(any());
    }

    // ================= getAllUser =================

    @Test
    void getAllUser_shouldReturnMappedUserResponseDtoList() {

        User user = new User();
        user.setId("1");
        user.setUsername("admin");
        user.setEmail("admin@mail.com");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findAll())
                .thenReturn(List.of(user));

        List<UserResponseDto> result = adminServiceImpl.getAllUser();

        assertEquals(1, result.size());
        assertEquals("admin", result.get(0).username());
        assertEquals("ADMIN", result.get(0).role());
        assertTrue(result.get(0).active());
    }

    // ================= getAllClients =================

    @Test
    void getAllClients_shouldReturnClientList() {

        Client client = new Client();

        when(clientRepository.findAll())
                .thenReturn(List.of(client));

        List<Client> result = adminServiceImpl.getAllClients();

        assertEquals(1, result.size());
        verify(clientRepository).findAll();
    }
}
