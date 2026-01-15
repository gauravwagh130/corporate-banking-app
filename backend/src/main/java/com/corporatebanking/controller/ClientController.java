package com.corporatebanking.controller;

import com.corporatebanking.dto.ClientRequestDto;
import com.corporatebanking.model.Client;
import com.corporatebanking.service.ClientServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/clients")
public class ClientController {
    private final ClientServiceImpl clientServiceImpl;

    @GetMapping
    public ResponseEntity<List<Client>> getClientsForRm(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String industry,
            Authentication authentication) {
        List<Client> clients = clientServiceImpl.getClientsForRm(authentication.getName(), name, industry);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable String id, Authentication authentication) throws AccessDeniedException {
        Client client = clientServiceImpl.getClientById(id, authentication.getName());
        return ResponseEntity.ok(client);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @Valid @RequestBody ClientRequestDto clientRequestDto, Authentication authentication) throws AccessDeniedException {
        Client updatedClient = clientServiceImpl.updateClient(id, authentication.getName(), clientRequestDto);
        return ResponseEntity.ok(updatedClient);
    }
}


