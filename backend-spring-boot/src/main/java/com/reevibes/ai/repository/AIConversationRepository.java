package com.reevibes.ai.repository;

import com.reevibes.ai.model.AIConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {
    List<AIConversation> findBySessionIdOrderByCreatedAtAsc(String sessionId);
    List<AIConversation> findByUserIdOrderByCreatedAtAsc(String userId);
}
