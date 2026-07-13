package com.reevibes.ai.repository;

import com.reevibes.ai.model.VendorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorProductRepository extends JpaRepository<VendorProduct, String> {
    List<VendorProduct> findByVendorId(String vendorId);
    List<VendorProduct> findByStatus(String status);
    Optional<VendorProduct> findByVendorIdAndExternalId(String vendorId, String externalId);

    @Query("SELECT DISTINCT p.category FROM VendorProduct p WHERE p.category IS NOT NULL")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT p.brand FROM VendorProduct p WHERE p.brand IS NOT NULL")
    List<String> findDistinctBrands();
}
