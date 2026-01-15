package com.corporatebanking.controller;

import com.corporatebanking.dto.CreditRequestRequestDto;
import com.corporatebanking.dto.CreditRequestResponseDto;
import com.corporatebanking.dto.CreditRequestUpdateDto;
import com.corporatebanking.service.CreditRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/credit-requests")
public class CreditRequestController {

    private final CreditRequestService creditRequestService;

    @PostMapping
    @PreAuthorize("hasRole('RM')")
    public ResponseEntity<CreditRequestResponseDto> createCreditRequest(
            @Valid @RequestBody CreditRequestRequestDto creditRequestRequestDto, Authentication authentication) throws Exception {
        CreditRequestResponseDto response = creditRequestService.createCreditRequest(authentication.getName(),creditRequestRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'RM')")
    public ResponseEntity<List<CreditRequestResponseDto>> getCreditRequests(Authentication authentication) {
        List<CreditRequestResponseDto> response = creditRequestService.getCreditRequests(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'RM')")
    public ResponseEntity<CreditRequestResponseDto> getCreditRequestById(@PathVariable String id, Authentication authentication) {
        CreditRequestResponseDto response = creditRequestService.getCreditRequestById(id, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<CreditRequestResponseDto> updateCreditRequestStatus(@PathVariable String id, Authentication authentication,
            @RequestBody CreditRequestUpdateDto creditRequestUpdateDto) {
        CreditRequestResponseDto response = creditRequestService.updateCreditRequestStatus(id, authentication.getName(), creditRequestUpdateDto);
        return ResponseEntity.ok(response);
    }
}
