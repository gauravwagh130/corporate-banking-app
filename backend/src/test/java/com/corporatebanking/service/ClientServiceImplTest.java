package com.corporatebanking.service;

import com.corporatebanking.dto.ClientRequestDto;
import com.corporatebanking.exception.AccessDeniedException;
import com.corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.Client;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceImplTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClientServiceImpl clientServiceImpl;

    // ================= CREATE CLIENT =================

    @Test
    void createClient_shouldCreateClient_whenRmExists() {

        ClientRequestDto request = new ClientRequestDto();
        request.setCompanyName("ABC Ltd");
        request.setIndustry("IT");
        request.setAnnualTurnover(1000000.0);
        request.setDocumentsSubmitted(true);

        User rm = new User();
        rm.setId("rm123");

        when(userRepository.findByEmail("rm@mail.com"))
                .thenReturn(Optional.of(rm));
        when(clientRepository.save(any(Client.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Client client =
                clientServiceImpl.createClient(request, "rm@mail.com");

        assertEquals("ABC Ltd", client.getCompanyName());
        assertEquals("IT", client.getIndustry());
        assertEquals("rm123", client.getRmId());

        verify(clientRepository).save(any(Client.class));
    }

    // ================= GET CLIENTS (NO FILTER) =================

    @Test
    void getClientsForRm_shouldReturnAllClients_whenNoFilter() {

        User rm = new User();
        rm.setId("rm1");

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(clientRepository.findByRmId("rm1"))
                .thenReturn(List.of(new Client()));

        List<Client> clients =
                clientServiceImpl.getClientsForRm("rm@mail.com", null, null);

        assertEquals(1, clients.size());
    }

    // ================= GET CLIENTS (NAME FILTER) =================

    @Test
    void getClientsForRm_shouldFilterByName() {

        User rm = new User();
        rm.setId("rm1");

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(clientRepository.findByRmIdAndCompanyNameContainingIgnoreCase(
                eq("rm1"), eq("abc")))
                .thenReturn(List.of(new Client()));

        List<Client> clients =
                clientServiceImpl.getClientsForRm("rm@mail.com", "abc", null);

        assertEquals(1, clients.size());
    }

    // ================= GET CLIENT BY ID =================

    @Test
    void getClientById_shouldReturnClient_whenAuthorized() {

        User rm = new User();
        rm.setId("rm1");

        Client client = new Client();
        client.setId("c1");
        client.setRmId("rm1");

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(clientRepository.findById("c1"))
                .thenReturn(Optional.of(client));

        Client result =
                clientServiceImpl.getClientById("c1", "rm@mail.com");

        assertEquals("c1", result.getId());
    }

    // ================= GET CLIENT BY ID (ACCESS DENIED) =================

    @Test
    void getClientById_shouldThrowAccessDenied_whenRmMismatch() {

        User rm = new User();
        rm.setId("rm1");

        Client client = new Client();
        client.setRmId("rm2");

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(clientRepository.findById("c1"))
                .thenReturn(Optional.of(client));

        assertThrows(
                AccessDeniedException.class,
                () -> clientServiceImpl.getClientById("c1", "rm@mail.com")
        );
    }

    // ================= UPDATE CLIENT =================

    @Test
    void updateClient_shouldUpdateClient_whenAuthorized() {

        User rm = new User();
        rm.setId("rm1");

        Client client = new Client();
        client.setRmId("rm1");

        ClientRequestDto request = new ClientRequestDto();
        request.setCompanyName("Updated Corp");
        request.setIndustry("Finance");
        request.setAnnualTurnover(2000000.0);

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(clientRepository.findById("c1"))
                .thenReturn(Optional.of(client));
        when(clientRepository.save(any(Client.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Client updated =
                clientServiceImpl.updateClient("c1", "rm@mail.com", request);

        assertEquals("Updated Corp", updated.getCompanyName());
    }

    // ================= RM NOT FOUND =================

    @Test
    void createClient_shouldThrowException_whenRmNotFound() {

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> clientServiceImpl.createClient(
                        new ClientRequestDto(), "rm@mail.com")
        );
    }
}
