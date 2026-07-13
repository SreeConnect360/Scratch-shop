package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProductVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorProductVersionRepository extends JpaRepository<VendorProductVersion, Long> {
    List<VendorProductVersion> findByProductIdOrderByVersionTimestampDesc(String productId);
}
