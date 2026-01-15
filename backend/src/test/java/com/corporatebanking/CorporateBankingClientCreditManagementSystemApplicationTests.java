package com.corporatebanking;

import com.corporatebanking.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = {
        MongoAutoConfiguration.class,
        MongoDataAutoConfiguration.class
})
class CorporateBankingClientCreditManagementSystemApplicationTests {

    // 🔑 MOCK **ALL** Mongo repositories
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private ClientRepository clientRepository;
    @MockitoBean
    private CreditRequestRepository creditRequestRepository;

    @Test
    void contextLoads() {
    }
}
