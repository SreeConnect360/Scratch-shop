package com.reevibes.ai.repository;

import com.reevibes.ai.model.ProductBucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductBucketRepository extends JpaRepository<ProductBucket, String> {
}
