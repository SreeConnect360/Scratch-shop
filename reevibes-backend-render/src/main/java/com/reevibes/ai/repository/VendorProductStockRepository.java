package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorProductStockRepository extends JpaRepository<VendorProductStock, Long> {
    List<VendorProductStock> findByProductId(String productId);
    Optional<VendorProductStock> findByProductIdAndSizeName(String productId, String sizeName);
    void deleteByProductId(String productId);
}
