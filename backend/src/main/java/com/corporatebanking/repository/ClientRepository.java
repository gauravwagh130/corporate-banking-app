package com.corporatebanking.repository;

import com.corporatebanking.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends MongoRepository<Client, String> {
    List<Client> findByRmId(String rmId);
    List<Client> findByRmIdAndCompanyNameContainingIgnoreCase(String rmId, String name);
    List<Client> findByRmIdAndIndustryContainingIgnoreCase(String rmId, String industry);
    Optional<Client> findByIdAndRmId(String id, String rmId);
}
