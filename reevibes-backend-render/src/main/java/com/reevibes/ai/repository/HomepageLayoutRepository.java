package com.reevibes.ai.repository;

import com.reevibes.ai.model.HomepageLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomepageLayoutRepository extends JpaRepository<HomepageLayout, String> {
}
