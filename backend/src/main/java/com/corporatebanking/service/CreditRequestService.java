package com.corporatebanking.service;

import com.corporatebanking.dto.CreditRequestRequestDto;
import com.corporatebanking.dto.CreditRequestResponseDto;
import com.corporatebanking.dto.CreditRequestUpdateDto;
import com.corporatebanking.dto.CreditRequestEvent;
import com.corporatebanking.exception.AccessDeniedException;
import com. corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.*;
import com.corporatebanking.repository. ClientRepository;
import com.corporatebanking.repository.CreditRequestRepository;
import com.corporatebanking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java. util.List;

@Service
@RequiredArgsConstructor
public class CreditRequestService {
    private final CreditRequestRepository creditRequestRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final KafkaProducerService kafkaProducerService; // 🔥 Added

    private User currentUser(String rmEmail) {
        return userRepository. findByEmail(rmEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email:  " + rmEmail));
    }

    public CreditRequestResponseDto createCreditRequest(String rmEmail, CreditRequestRequestDto request){
        User rm = currentUser(rmEmail);

        Client client = clientRepository.findByIdAndRmId(request.getClientId(), rm.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));

        CreditRequest creditRequest = new CreditRequest();
        creditRequest.setClientId(client.getId());
        creditRequest.setSubmittedBy(rm.getId());
        creditRequest.setRequestAmount(request.getRequestAmount());
        creditRequest.setPurpose(request.getPurpose());
        creditRequest.setTenureMonths(request.getTenureMonths());
        creditRequest.setStatus(CreditRequestStatus.PENDING);
        creditRequest.setRemarks("");
        creditRequest.setCreatedAt(Instant.now());

        CreditRequest savedRequest = creditRequestRepository.save(creditRequest);

        // 🔥 Publish Kafka Event for Credit Request Created
        publishCreditRequestCreatedEvent(savedRequest);

        return mapperToDto(savedRequest);
    }

    public List<CreditRequestResponseDto> getCreditRequests(String email) {
        User user = currentUser(email);

        List<CreditRequest> requests = switch (user.getRole()) {
            case ADMIN, ANALYST ->
                    creditRequestRepository.findAll();
            case RM ->
                    creditRequestRepository.findBySubmittedBy(user.getId());
            default ->
                    throw new AccessDeniedException("Access denied");
        };

        return requests.stream().map(this::mapperToDto).toList();
    }

    public CreditRequestResponseDto getCreditRequestById(String id, String rmEmail) {
        User user = currentUser(rmEmail);
        CreditRequest creditRequest = creditRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credit Request not found with id: " + id));

        if (user.getRole() == Role.ADMIN || user.getRole() == Role. ANALYST){
            return mapperToDto(creditRequest);
        }

        if (user.getRole() == Role.RM) {
            if (! creditRequest.getSubmittedBy().equals(user.getId())) {
                throw new AccessDeniedException("Access Denied: You do not have access to this credit request");
            }
            return mapperToDto(creditRequest);
        }

        throw new AccessDeniedException("Access Denied: You do not have permission to view this credit request");
    }

    public CreditRequestResponseDto updateCreditRequestStatus(String id, String analystEmail, CreditRequestUpdateDto request) {
        User analyst = currentUser(analystEmail);

        CreditRequest creditRequest = creditRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credit Request not found with id: " + id));

        creditRequest.setStatus(request.getStatus());
        creditRequest.setRemarks(request.getRemarks());

        CreditRequest updatedRequest = creditRequestRepository.save(creditRequest);

        // 🔥 Publish Kafka Event for Status Update
        publishCreditRequestStatusUpdatedEvent(updatedRequest, analyst. getId());

        return mapperToDto(updatedRequest);
    }

    // 🔥 Helper method to publish Credit Request Created event
    private void publishCreditRequestCreatedEvent(CreditRequest creditRequest) {
        CreditRequestEvent event = new CreditRequestEvent(
                "CREDIT_REQUEST_CREATED",
                creditRequest.getId(),
                creditRequest.getClientId(),
                creditRequest.getSubmittedBy(),
                creditRequest.getRequestAmount(),
                creditRequest. getTenureMonths(),
                creditRequest.getPurpose(),
                creditRequest.getStatus(),
                creditRequest.getRemarks(),
                creditRequest.getCreatedAt(),
                null
        );
        kafkaProducerService.publishCreditRequestEvent(event);
    }

    // 🔥 Helper method to publish Credit Request Status Updated event
    private void publishCreditRequestStatusUpdatedEvent(CreditRequest creditRequest, String updatedBy) {
        CreditRequestEvent event = new CreditRequestEvent(
                "CREDIT_REQUEST_STATUS_UPDATED",
                creditRequest.getId(),
                creditRequest.getClientId(),
                creditRequest.getSubmittedBy(),
                creditRequest.getRequestAmount(),
                creditRequest. getTenureMonths(),
                creditRequest.getPurpose(),
                creditRequest.getStatus(),
                creditRequest.getRemarks(),
                Instant.now(),
                updatedBy
        );
        kafkaProducerService.publishCreditRequestEvent(event);
    }

    private CreditRequestResponseDto mapperToDto(CreditRequest creditRequest){
        return new CreditRequestResponseDto(
                creditRequest.getId(),
                creditRequest.getClientId(),
                creditRequest.getSubmittedBy(),
                creditRequest.getRequestAmount(),
                creditRequest.getTenureMonths(),
                creditRequest.getPurpose(),
                creditRequest.getStatus(),
                creditRequest.getRemarks(),
                creditRequest. getCreatedAt()
        );
    }
}