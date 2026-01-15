package com.corporatebanking.service;

import com.corporatebanking.dto.CreditRequestRequestDto;
import com.corporatebanking.dto.CreditRequestUpdateDto;
import com.corporatebanking.exception.AccessDeniedException;
import com.corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.*;
import com.corporatebanking.repository.ClientRepository;
import com.corporatebanking.repository.CreditRequestRepository;
import com.corporatebanking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreditRequestServiceTest {

    @Mock
    private CreditRequestRepository creditRequestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @InjectMocks
    private CreditRequestService creditRequestService;

    // ================= CREATE CREDIT REQUEST =================

    @Test
    void createCreditRequest_shouldCreateRequest_whenValidRmAndClient() {

        User rm = new User();
        rm.setId("rm1");
        rm.setRole(Role.RM);

        Client client = new Client();
        client.setId("client1");
        client.setRmId("rm1");

        CreditRequestRequestDto request = new CreditRequestRequestDto(
                "client1",
                1_000_000L,
                12,
                "Business Expansion"
        );

        when(userRepository.findByEmail("rm@mail.com"))
                .thenReturn(Optional.of(rm));
        when(clientRepository.findByIdAndRmId("client1", "rm1"))
                .thenReturn(Optional.of(client));
        when(creditRequestRepository.save(any(CreditRequest.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        var response =
                creditRequestService.createCreditRequest("rm@mail.com", request);

        assertEquals("client1", response.getClientId());
        assertEquals(CreditRequestStatus.PENDING, response.getStatus());

        verify(kafkaProducerService).publishCreditRequestEvent(any());
    }

    // ================= GET CREDIT REQUESTS (RM) =================

    @Test
    void getCreditRequests_shouldReturnRmRequests() {

        User rm = new User();
        rm.setId("rm1");
        rm.setRole(Role.RM);

        CreditRequest request = new CreditRequest();
        request.setSubmittedBy("rm1");
        request.setCreatedAt(Instant.now());

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(creditRequestRepository.findBySubmittedBy("rm1"))
                .thenReturn(List.of(request));

        var result =
                creditRequestService.getCreditRequests("rm@mail.com");

        assertEquals(1, result.size());
    }

    // ================= GET CREDIT REQUEST BY ID (AUTHORIZED RM) =================

    @Test
    void getCreditRequestById_shouldReturn_whenRmOwnsRequest() {

        User rm = new User();
        rm.setId("rm1");
        rm.setRole(Role.RM);

        CreditRequest request = new CreditRequest();
        request.setId("cr1");
        request.setSubmittedBy("rm1");
        request.setCreatedAt(Instant.now());

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(creditRequestRepository.findById("cr1"))
                .thenReturn(Optional.of(request));

        var response =
                creditRequestService.getCreditRequestById("cr1", "rm@mail.com");

        assertEquals("cr1", response.getId());
    }

    // ================= GET CREDIT REQUEST BY ID (ACCESS DENIED) =================

    @Test
    void getCreditRequestById_shouldThrowAccessDenied_whenRmMismatch() {

        User rm = new User();
        rm.setId("rm1");
        rm.setRole(Role.RM);

        CreditRequest request = new CreditRequest();
        request.setSubmittedBy("rm2");

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(rm));
        when(creditRequestRepository.findById("cr1"))
                .thenReturn(Optional.of(request));

        assertThrows(
                AccessDeniedException.class,
                () -> creditRequestService.getCreditRequestById("cr1", "rm@mail.com")
        );
    }

    // ================= UPDATE CREDIT REQUEST (ANALYST) =================

    @Test
    void updateCreditRequestStatus_shouldUpdate_whenAnalyst() {

        User analyst = new User();
        analyst.setId("a1");
        analyst.setRole(Role.ANALYST);

        CreditRequest request = new CreditRequest();
        request.setId("cr1");

        CreditRequestUpdateDto updateDto =
                new CreditRequestUpdateDto(CreditRequestStatus.APPROVED, "Looks good");

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(analyst));
        when(creditRequestRepository.findById("cr1"))
                .thenReturn(Optional.of(request));
        when(creditRequestRepository.save(any()))
                .thenAnswer(inv -> inv.getArgument(0));

        var response =
                creditRequestService.updateCreditRequestStatus("cr1", "analyst@mail.com", updateDto);

        assertEquals(CreditRequestStatus.APPROVED, response.getStatus());

        verify(kafkaProducerService).publishCreditRequestEvent(any());
    }

    // ================= USER NOT FOUND =================

    @Test
    void createCreditRequest_shouldThrow_whenUserNotFound() {

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> creditRequestService.createCreditRequest(
                        "rm@mail.com",
                        new CreditRequestRequestDto("c1", 100L, 6, "Test"))
        );
    }
}
