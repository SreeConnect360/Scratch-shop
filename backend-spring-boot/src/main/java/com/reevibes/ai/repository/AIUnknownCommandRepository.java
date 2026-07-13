package com.reevibes.ai.repository;

import com.reevibes.ai.model.AIUnknownCommand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIUnknownCommandRepository extends JpaRepository<AIUnknownCommand, Long> {
}
