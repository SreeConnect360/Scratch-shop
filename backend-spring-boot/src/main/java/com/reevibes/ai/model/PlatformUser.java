package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "platform_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformUser {
    @Id
    private String id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 50)
    private String country;

    @Column(length = 20)
    private String dob;

    @Column(length = 10)
    private String gender;

    @Column(length = 20)
    private String status = "Active";

    @Column(length = 255)
    private String roles = "CUSTOMER";

    @Column(columnDefinition = "TEXT")
    private String addresses;

    @Column(columnDefinition = "TEXT")
    private String wishlist;

    @Column(columnDefinition = "TEXT")
    private String cart;

    @Column(name = "last_login", length = 50)
    private String lastLogin;
}
