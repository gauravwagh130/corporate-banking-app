package com.corporatebanking.service;

import com.corporatebanking.dto.UserResponseDto;
import com.corporatebanking.model.Client;

import java.util.List;

public interface AdminService {
    String updateUserStatus(String id, boolean active);
    List<UserResponseDto> getAllUser();
    List<Client> getAllClients();

}
