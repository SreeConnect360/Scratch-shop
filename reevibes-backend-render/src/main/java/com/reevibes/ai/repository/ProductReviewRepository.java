package com.reevibes.ai.repository;

import com.reevibes.ai.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, String> {
    List<ProductReview> findByProductId(String productId);
}
