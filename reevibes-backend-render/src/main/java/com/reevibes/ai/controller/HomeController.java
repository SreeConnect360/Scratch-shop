package com.reevibes.ai.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ReeVibes API Service - Operational</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        background: #09090b;
                        color: #f4f4f5;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .container {
                        max-width: 650px;
                        width: 100%;
                        background: rgba(24, 24, 27, 0.75);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 24px;
                        padding: 40px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        text-align: center;
                    }
                    .brand {
                        font-family: 'Cinzel', serif;
                        font-size: 28px;
                        letter-spacing: 4px;
                        color: #d97706;
                        margin-bottom: 8px;
                        font-weight: 700;
                    }
                    .subtitle {
                        font-size: 13px;
                        color: #a1a1aa;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        margin-bottom: 32px;
                    }
                    .status-card {
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 16px;
                        padding: 20px;
                        margin-bottom: 28px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .status-left {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .dot {
                        width: 12px;
                        height: 12px;
                        background-color: #10b981;
                        border-radius: 50%;
                        box-shadow: 0 0 12px #10b981;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                    }
                    .status-title {
                        font-weight: 600;
                        font-size: 15px;
                    }
                    .badge {
                        background: rgba(16, 185, 129, 0.15);
                        color: #34d399;
                        border: 1px solid rgba(52, 211, 153, 0.3);
                        font-size: 11px;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                        margin-bottom: 32px;
                        text-align: left;
                    }
                    .grid-item {
                        background: rgba(0, 0, 0, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        padding: 14px 16px;
                        border-radius: 12px;
                    }
                    .grid-label {
                        font-size: 11px;
                        color: #71717a;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 4px;
                    }
                    .grid-value {
                        font-size: 13px;
                        font-weight: 600;
                        color: #e4e4e7;
                    }
                    .btn-group {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                    }
                    .btn {
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 600;
                        text-decoration: none;
                        transition: all 0.2s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .btn-primary {
                        background: #d97706;
                        color: #ffffff;
                    }
                    .btn-primary:hover {
                        background: #b45309;
                        transform: translateY(-1px);
                    }
                    .btn-secondary {
                        background: rgba(255, 255, 255, 0.08);
                        color: #e4e4e7;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .btn-secondary:hover {
                        background: rgba(255, 255, 255, 0.15);
                        transform: translateY(-1px);
                    }
                    .footer {
                        margin-top: 28px;
                        font-size: 11px;
                        color: #52525b;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="brand">MAISON REEVIBES</div>
                    <div class="subtitle">Production API & Backend Service</div>
                    
                    <div class="status-card">
                        <div class="status-left">
                            <div class="dot"></div>
                            <div class="status-title">All Backend Services Online</div>
                        </div>
                        <div class="badge">Operational</div>
                    </div>

                    <div class="grid">
                        <div class="grid-item">
                            <div class="grid-label">Database</div>
                            <div class="grid-value">Supabase PostgreSQL</div>
                        </div>
                        <div class="grid-item">
                            <div class="grid-label">Hosting Platform</div>
                            <div class="grid-value">Render Cloud</div>
                        </div>
                        <div class="grid-item">
                            <div class="grid-label">Sync Protocol</div>
                            <div class="grid-value">Real-Time Polling & Storage</div>
                        </div>
                        <div class="grid-item">
                            <div class="grid-label">Framework</div>
                            <div class="grid-value">Spring Boot 3.4</div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <a href="https://reevibes.com" class="btn btn-primary" target="_blank">Visit Storefront</a>
                        <a href="https://reevibes.com/admin" class="btn btn-secondary" target="_blank">Admin Dashboard</a>
                        <a href="/api/sync/version" class="btn btn-secondary" target="_blank">API Health Check</a>
                    </div>

                    <div class="footer">
                        ReeVibes Cloud API Gateway &bull; &copy; 2026 Maison ReeVibes
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "ReeVibes Production Backend",
            "database", "Supabase PostgreSQL",
            "timestamp", Instant.now().toString()
        ));
    }
}
