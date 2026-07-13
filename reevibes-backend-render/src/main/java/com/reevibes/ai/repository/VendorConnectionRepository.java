package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VendorConnectionRepository extends JpaRepository<VendorConnection, Long> {
    Optional<VendorConnection> findByVendorId(String vendorId);
}
