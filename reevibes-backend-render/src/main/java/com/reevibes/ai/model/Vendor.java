package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    @Id
    private String id;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "contact_person")
    private String contactPerson;

    private String email;
    private String phone;

    @Column(name = "products_json", columnDefinition = "TEXT")
    private String productsJson;

    private Double revenue = 0.0;
}
