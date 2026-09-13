---
name: shiprocket
description: >-
  Shiprocket logistics integration and MCP server tools. Use when managing orders,
  calculating shipping rates, assigning couriers, scheduling pickups, generating shipping labels,
  tracking packages, configuring webhooks, and handling automated fulfillment workflows.
---

# Shiprocket Logistics & MCP Server Guide

This skill provides direct access and guidance for the Shiprocket logistics integration and the Shiprocket MCP Server embedded in this repository under `tools/shiprocket-mcp`.

## MCP Server Overview

The Shiprocket Model Context Protocol (MCP) server allows AI agents (Claude, Cursor, Antigravity) to manage e-commerce fulfillment and logistics using natural language.

### Server Location & Build
- Source: `tools/shiprocket-mcp`
- Entry Point: `tools/shiprocket-mcp/dist/main.js`
- Transport: STDIO (`node dist/main.js`)

### Environment Variables
- `SELLER_EMAIL`: Shiprocket API user email (e.g., `sreesri1004@gmail.com` or custom API user email)
- `SELLER_PASSWORD`: Shiprocket API user password

---

## Available MCP Tools

| Tool Name | Type | Description | Key Parameters |
| :--- | :--- | :--- | :--- |
| `shipping_rate_calculator` | Read-only | Fetch serviceable couriers, rates, and EDDs | `pickup_postcode`, `delivery_postcode`, `weight_in_kg`, `cod_or_prepaid` |
| `estimated_delivery` | Read-only | Fast estimated delivery date for a destination | `delivery_pincode` |
| `list_pickup_addresses` | Read-only | Retrieve all configured seller pickup locations | None |
| `order_list` | Read-only | List recent orders filtered by fulfillment status | `status` ('NEW', 'READY_TO_SHIP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RTO') |
| `order_track` | Read-only | Live track shipment scans and status | `awb_number` |
| `order_create` | Mutating | Create an adhoc shipment in Shiprocket | Customer details, address, dimensions, items, payment mode |
| `order_ship` | Mutating | Assign courier & generate AWB tracking code | `order_id`, `courier_id` (optional) |
| `order_schedule_pickup` | Mutating | Schedule courier pickup for an order | `order_id`, `pickup_date` (YYYY-MM-DD) |
| `generate_shipment_label` | Mutating | Generate label PDF URL for a shipment | `shipment_id` |
| `order_cancel` | Mutating | Cancel an order before dispatch | `order_id`, `cancel_on_channel` |

---

## Shiprocket Webhook Architecture

To receive real-time package scan notifications and delivery updates without polling, Shiprocket sends HTTP POST payloads to our backend.

### Compliant Webhook Endpoints
Shiprocket strictly forbids the keywords `shiprocket`, `kartrocket`, `sr`, or `kr` in webhook URLs.
The compliant webhook endpoints configured on the backend are:
- `https://scratch-render.onrender.com/api/fulfillment-updates`
- `https://scratch-render.onrender.com/api/delivery-events/callback`
- `https://scratch-render.onrender.com/api/package-tracking/callback`

### Security Token
- Shiprocket sends the token in the `anx-api-key` (or `x-api-key`) HTTP header.
- Configured secret: `shiprocket.webhook.token` (default: `reevibes_ship_webhook_sec_892374923`).

### Webhook Response
- The webhook receiver handles incoming scan logs, updates the corresponding `shop_orders` row in Supabase PostgreSQL (via JPA and version bumps), and immediately returns an HTTP 200 JSON response:
  ```json
  { "status": "success", "message": "Order updated successfully" }
  ```
