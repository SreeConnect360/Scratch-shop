package com.reevibes.ai.repository;

import com.reevibes.ai.model.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, String> {
    List<ShopOrder> findByUserIdOrderByOrderDateDesc(String userId);
}
