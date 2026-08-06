package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorProductRepository extends JpaRepository<VendorProduct, String> {
}
