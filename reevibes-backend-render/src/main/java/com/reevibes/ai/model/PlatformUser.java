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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRoles() { return roles; }
    public void setRoles(String roles) { this.roles = roles; }

    public String getAddresses() { return addresses; }
    public void setAddresses(String addresses) { this.addresses = addresses; }

    public String getWishlist() { return wishlist; }
    public void setWishlist(String wishlist) { this.wishlist = wishlist; }

    public String getCart() { return cart; }
    public void setCart(String cart) { this.cart = cart; }

    public String getLastLogin() { return lastLogin; }
    public void setLastLogin(String lastLogin) { this.lastLogin = lastLogin; }
}
