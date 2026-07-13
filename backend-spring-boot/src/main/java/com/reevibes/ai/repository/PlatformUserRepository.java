package com.reevibes.ai.repository;

import com.reevibes.ai.model.PlatformUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlatformUserRepository extends JpaRepository<PlatformUser, String> {
    Optional<PlatformUser> findByEmailIgnoreCase(String email);
}
