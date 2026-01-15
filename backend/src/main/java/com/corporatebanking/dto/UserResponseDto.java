package com.corporatebanking.dto;

public record UserResponseDto(
        String id,
        String username,
        String email,
        String role,
        boolean active
) {}
