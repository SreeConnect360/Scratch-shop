package com.reevibes.ai.repository;

import com.reevibes.ai.model.AICommandPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AICommandPatternRepository extends JpaRepository<AICommandPattern, Long> {
    Optional<AICommandPattern> findByCommandText(String commandText);
    Optional<AICommandPattern> findByNormalizedCommand(String normalizedCommand);
    List<AICommandPattern> findByIntent_IntentCode(String intentCode);
}
