package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProductVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorProductVideoRepository extends JpaRepository<VendorProductVideo, Long> {
    List<VendorProductVideo> findByProductId(String productId);
    void deleteByProductId(String productId);
}
