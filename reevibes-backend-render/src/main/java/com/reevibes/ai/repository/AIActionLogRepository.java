package com.reevibes.ai.repository;

import com.reevibes.ai.model.AIActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface AIActionLogRepository extends JpaRepository<AIActionLog, Long> {
    
    @Query("SELECT l.intentCode as intent, COUNT(l) as count FROM AIActionLog l GROUP BY l.intentCode ORDER BY COUNT(l) DESC")
    List<Map<String, Object>> getTopIntentsUsage();

    @Query("SELECT COUNT(l) FROM AIActionLog l WHERE l.actionStatus = 'SUCCESS'")
    long countSuccessfulActions();
}
