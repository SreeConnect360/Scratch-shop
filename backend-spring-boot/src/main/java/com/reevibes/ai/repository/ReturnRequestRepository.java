package com.reevibes.ai.repository;

import com.reevibes.ai.model.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, String> {
    List<ReturnRequest> findByCustomerId(String customerId);
}
