package com.corporatebanking.repository;

import com.corporatebanking.model.CreditRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CreditRequestRepository extends MongoRepository<CreditRequest, String> {

    List<CreditRequest> findBySubmittedBy(String id);
}
