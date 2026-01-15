package com.corporatebanking.controller;

import com.corporatebanking.dto.UpdateUserStatusRequestDto;
import com.corporatebanking.dto.UserResponseDto;
import com.corporatebanking.model.Client;
import com.corporatebanking.service.AdminServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminServiceImpl adminServiceImpl;

    @GetMapping(value = "/users")
    public ResponseEntity<List<UserResponseDto>> getAllUser() {
        return ResponseEntity.ok(adminServiceImpl.getAllUser());
    }
    @PutMapping(value = "/users/{id}/status")
    public ResponseEntity<String> updateUserStatus(@PathVariable String id, @RequestBody UpdateUserStatusRequestDto updateUserStatusRequestDto) {
        adminServiceImpl.updateUserStatus(id, updateUserStatusRequestDto.isActive());
        return ResponseEntity.ok("User status updated for id:-" + id);
    }

    @GetMapping(value = "/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(adminServiceImpl.getAllClients());
    }

}
