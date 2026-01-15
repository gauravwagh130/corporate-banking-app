package com.corporatebanking.service;

import com.corporatebanking.dto.ClientRequestDto;
import com.corporatebanking.exception.AccessDeniedException;
import com.corporatebanking.model.Client;
import jakarta.validation.Valid;

import java.util.List;

public interface ClientService {

    Client createClient(@Valid ClientRequestDto clientRequestDto, String rmEmail);

    List<Client> getClientsForRm(String rmEmail, String name, String industry);

    Client getClientById(String clientId, String rmEmail) throws AccessDeniedException;

    Client updateClient(String clientId, String rmEmail, @Valid ClientRequestDto clientRequestDto)
            throws AccessDeniedException;
}
