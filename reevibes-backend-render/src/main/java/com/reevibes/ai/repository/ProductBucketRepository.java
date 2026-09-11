package com.reevibes.ai.repository;

import com.reevibes.ai.model.ProductBucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductBucketRepository extends JpaRepository<ProductBucket, String> {
    List<ProductBucket> findAllByOrderByDisplayOrderAsc();
}
