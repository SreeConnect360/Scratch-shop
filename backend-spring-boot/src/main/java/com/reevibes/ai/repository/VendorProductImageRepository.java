package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorProductImageRepository extends JpaRepository<VendorProductImage, Long> {
    List<VendorProductImage> findByProductId(String productId);
    void deleteByProductId(String productId);
}
