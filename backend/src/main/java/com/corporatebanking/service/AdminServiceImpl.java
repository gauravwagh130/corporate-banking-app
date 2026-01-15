package com.corporatebanking.service;

import com.corporatebanking.dto.UserResponseDto;
import com.corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.Client;
import com.corporatebanking.model.User;
import com.corporatebanking.repository.ClientRepository;
import com.corporatebanking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public String updateUserStatus(String id, boolean active){
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id:- " + id));
        user.setActive(active);
        userRepository.save(user);
        return "User status updated for id:-" + id;
    }

    public List<UserResponseDto> getAllUser() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.isActive()
                ))
                .toList();
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
}
