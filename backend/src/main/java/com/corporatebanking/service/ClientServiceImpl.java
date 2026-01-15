package com.corporatebanking.service;

import com.corporatebanking.dto.ClientRequestDto;
import com.corporatebanking.exception.AccessDeniedException;
import com.corporatebanking.exception.ResourceNotFoundException;
import com.corporatebanking.model.Client;
import com.corporatebanking.model.User;
import com.corporatebanking.repository.ClientRepository;
import com.corporatebanking.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    public Client createClient(@Valid ClientRequestDto clientRequestDto, String rmEmail) {
         String rmId = getRmIdByEmail(rmEmail);
        Client client = new Client();
        client.setCompanyName(clientRequestDto.getCompanyName());
        client.setIndustry(clientRequestDto.getIndustry());
        client.setAddress(clientRequestDto.getAddress());
        client.setPrimaryContact(clientRequestDto.getPrimaryContact());
        client.setAnnualTurnover(clientRequestDto.getAnnualTurnover());
        client.setDocumentsSubmitted(clientRequestDto.isDocumentsSubmitted());
        client.setRmId(rmId);
        return clientRepository.save(client);
    }

    public List<Client> getClientsForRm(String rmEmail, String name, String industry) {
        String rmId= getRmIdByEmail(rmEmail);
        if(name != null && !name.isEmpty()) {
            return clientRepository.findByRmIdAndCompanyNameContainingIgnoreCase(rmId, name);
        }
        if(industry != null && !industry.isEmpty()) {
            return clientRepository.findByRmIdAndIndustryContainingIgnoreCase(rmId, industry);
        }
        return clientRepository.findByRmId(rmId);
    }

    public Client getClientById(String clientId, String rmEmail) throws AccessDeniedException {
        String rmId = getRmIdByEmail(rmEmail);
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));
        if(!client.getRmId().equals(rmId)) {
            throw new AccessDeniedException("Access Denied: You do not have access to this client");
        }
        return client;
    }
    public Client updateClient(String clientId, String rmEmail, @Valid ClientRequestDto clientRequestDto) throws AccessDeniedException {
        String rmId = getRmIdByEmail(rmEmail);
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));
        if(!client.getRmId().equals(rmId)) {
            throw new AccessDeniedException("Access Denied: You do not have access to update this client");
        }
        client.setCompanyName(clientRequestDto.getCompanyName());
        client.setIndustry(clientRequestDto.getIndustry());
        client.setAddress(clientRequestDto.getAddress());
        client.setPrimaryContact(clientRequestDto.getPrimaryContact());
        client.setAnnualTurnover(clientRequestDto.getAnnualTurnover());
        client.setDocumentsSubmitted(clientRequestDto.isDocumentsSubmitted());
        return clientRepository.save(client);
    }

    private String getRmIdByEmail(String rmEmail) {
        User rm = userRepository.findByEmail(rmEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + rmEmail));
        return rm.getId();
    }

}