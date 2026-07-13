package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "homepage_layout")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomepageLayout {
    @Id
    private String id; // "published" or "draft"

    @Column(name = "layout_json", nullable = false, columnDefinition = "TEXT")
    private String layoutJson;
}
