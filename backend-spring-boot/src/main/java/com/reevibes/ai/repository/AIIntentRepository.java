package com.reevibes.ai.repository;

import com.reevibes.ai.model.AIIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AIIntentRepository extends JpaRepository<AIIntent, Long> {
    Optional<AIIntent> findByIntentCode(String intentCode);
}
