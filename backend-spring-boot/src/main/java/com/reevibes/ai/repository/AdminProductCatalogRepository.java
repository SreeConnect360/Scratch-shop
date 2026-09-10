package com.reevibes.ai.repository;

import com.reevibes.ai.model.AdminProductCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminProductCatalogRepository extends JpaRepository<AdminProductCatalog, String> {
    List<AdminProductCatalog> findByStatusIgnoreCase(String status);
}
