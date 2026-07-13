package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(precision = 12, scale = 2)
    private BigDecimal revenue = BigDecimal.ZERO;

    private Boolean active = true;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;
}
