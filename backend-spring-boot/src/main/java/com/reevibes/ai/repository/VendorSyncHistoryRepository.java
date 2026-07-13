package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorSyncHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorSyncHistoryRepository extends JpaRepository<VendorSyncHistory, Long> {
    List<VendorSyncHistory> findByVendorIdOrderByRunTimeDesc(String vendorId);
}
