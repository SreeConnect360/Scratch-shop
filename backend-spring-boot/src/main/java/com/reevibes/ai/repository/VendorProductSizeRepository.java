package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProductSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorProductSizeRepository extends JpaRepository<VendorProductSize, Long> {
    List<VendorProductSize> findByProductId(String productId);
    void deleteByProductId(String productId);
}
