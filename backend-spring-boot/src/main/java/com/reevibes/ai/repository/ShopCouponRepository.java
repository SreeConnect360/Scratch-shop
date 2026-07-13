package com.reevibes.ai.repository;

import com.reevibes.ai.model.ShopCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShopCouponRepository extends JpaRepository<ShopCoupon, String> {
    Optional<ShopCoupon> findByCodeIgnoreCase(String code);
}
