package com.corporatebanking.controller;

import com.corporatebanking.dto.ClientRequestDto;
import com.corporatebanking.model.Client;
import com.corporatebanking.service.ClientServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/rm")
@PreAuthorize("hasRole('RM')")
public class RmController {
    private final ClientServiceImpl clientServiceImpl;

    @PostMapping(value = "/clients")
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientRequestDto clientRequestDto, Authentication authentication) {
        return ResponseEntity.ok(clientServiceImpl.createClient(clientRequestDto, authentication.getName()));
    }
}
