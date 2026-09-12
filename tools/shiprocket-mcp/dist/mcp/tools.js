"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTools = void 0;
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const connections_1 = require("./connections");
const axios_2 = require("axios");
const config_1 = require("@/config");
const issuerBase = () => process.env.OAUTH_ISSUER ?? `http://localhost:${process.env.APP_PORT ?? "3000"}`;
// Called when Shiprocket returns 401.
// Marks the session so the next POST/GET /mcp request revokes MCP tokens and returns 401,
// triggering a full OAuth re-auth (login form) in both Claude and ChatGPT.
// Also returns _meta["mcp/www_authenticate"] which ChatGPT renders as an inline re-auth button.
function shiprocketAuthError(sessionId) {
    connections_1.expiredSellerTokenSessions.add(sessionId);
    const base = issuerBase();
    return {
        content: [
            {
                type: "text",
                text: "Your Shiprocket session has expired. Please reconnect: Settings → Integrations → Shiprocket → Disconnect → Reconnect.",
            },
        ],
        _meta: {
            "mcp/www_authenticate": [
                `Bearer resource_metadata="${base}/.well-known/oauth-protected-resource", error="invalid_token", error_description="Shiprocket session expired, please reconnect"`,
            ],
        },
        isError: true,
    };
}
const initializeTools = (server) => {
    server.tool("estimated_delivery", `Get the Estimated Date of Delivery (EDD) for a given destination.
    
    Args:
        delivery_pincode: String representing pincode of order delivery destination
    
    Returns: Dictionary containing following info: 
        estimated_delivery_date: Date-time formatted string representing expected date & time of delivery
        delivery_pincode: String representing pincode of order delivery destination`, {
        delivery_pincode: zod_1.z.string(),
    }, { title: "Estimated Delivery Date", readOnlyHint: true, destructiveHint: false }, async ({ delivery_pincode: deliveryPincode }, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const listAddressUrl = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/settings/company/pickup?limit=1&medium=shiprocketMCP`;
        try {
            const addressList = (await axios_1.default.get(listAddressUrl, {
                headers: { Authorization: `Bearer ${sellerToken}`, "Content-Type": "application/json" },
            })).data;
            const pickupPostcode = addressList?.data?.shipping_address?.[0]?.pin_code ?? "110092";
            const serviceabilityUrl = `${config_1.API_DOMAINS.SERVICEABILITY}/courier/ratingserviceability?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPincode}&weight=0.5&cod=0&medium=shiprocketMCP`;
            const serviceabilityData = (await axios_1.default.get(serviceabilityUrl, {
                headers: { Authorization: `Bearer ${sellerToken}`, "Content-Type": "application/json" },
            })).data;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            estimated_delivery_date: serviceabilityData.data.available_courier_companies[0].etd,
                            delivery_pincode: deliveryPincode,
                        }),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [{ type: "text", text: JSON.stringify({ success: false, error: err.response?.data }) }],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [{ type: "text", text: `Unable to fetch expected date of delivery due to some error` }],
            };
        }
    });
    server.tool("order_track", `Get order tracking related information.

    Args:
        awb_number: String representing AWB number assigned to the order
    
    Returns: Dictionary containing following info:
        order_status: String representing order status
        awb_number: String representing AWB number of order
        last_activity: String representing last marked activity of order
        last_scan_location: String representing last marked location of order
        last_scan_time: Timestamp formatted string representing last order scan timestamp
        tracking_url: String representing URL of order tracking page`, {
        awb_number: zod_1.z.string(),
    }, { title: "Track Order", readOnlyHint: true, destructiveHint: false }, async ({ awb_number: awbNumber }, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const trackUrl = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/courier/track/awb/${awbNumber}?medium=shiprocketMCP`;
        try {
            const trackData = (await axios_1.default.get(trackUrl, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data?.tracking_data;
            if ("error" in trackData && trackData.error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: trackData.error,
                            }),
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            number: awbNumber,
                            order_status: trackData.shipment_track[0].current_status,
                            last_activity: trackData?.shipment_track_activities?.[0]?.activity ?? null,
                            last_scan_location: trackData?.shipment_track_activities?.[0]?.location ?? null,
                            last_scan_time: trackData?.shipment_track_activities?.[0]?.date ?? null,
                            tracking_url: trackData?.track_url,
                        }),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `I couldn't find any data for the tracking ID you provided. Please double-check the ID and try again.`,
                    },
                ],
            };
        }
    });
    server.tool("order_list", `Get list of orders
    
    Args:
        status: Optional ENUM('NEW', 'READY_TO_SHIP', 'IN_TRANSIT', 'DELIVERED') representing status filter for orders
        
    Return: List of dictionary containing following info:
        `, {
        status: zod_1.z
            .string(zod_1.z.enum([
            "CANCELLED",
            "NEW",
            "READY_TO_SHIP",
            "IN_TRANSIT",
            "DELIVERED",
            "RTO",
        ]))
            .optional(),
    }, { title: "List Orders", readOnlyHint: true, destructiveHint: false }, async ({ status }, context) => {
        let concatenatedStatusIds = "";
        switch (status) {
            case "NEW": {
                concatenatedStatusIds = "1";
                break;
            }
            case "CANCELLED": {
                concatenatedStatusIds = "5,18";
                break;
            }
            case "READY_TO_SHIP": {
                concatenatedStatusIds = "34,14,35,12,13,3,4";
                break;
            }
            case "IN_TRANSIT": {
                concatenatedStatusIds = "37,20,44,19,51,43,6";
                break;
            }
            case "DELIVERED": {
                concatenatedStatusIds = "7";
                break;
            }
            case "RTO": {
                concatenatedStatusIds = "15,55,46,45,16,17,36,87,85";
                break;
            }
        }
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/orders?medium=shiprocketMCP${status ? `&filter=${concatenatedStatusIds}&filter_by=status` : ""}`;
        try {
            const data = (await axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data;
            const structuredOrders = data?.data?.map((order) => ({
                order_id: order.id,
                channel_name: order.channel_name,
                channel_order_id: order.channel_order_id,
                customer_name: order.customer_name,
                order_total_cost: order.total,
                status: order.status,
                order_created_at: order.channel_created_at,
                products: Array.isArray(order.products)
                    ? order.products.map((product) => ({
                        name: product.name,
                        product_sku: product.channel_sku,
                        quantity: product.quantity,
                    }))
                    : [],
                shipment_id: Array.isArray(order.shipments)
                    ? order.shipments?.[0]?.id
                    : null,
                shipping_courier_name: Array.isArray(order.shipments)
                    ? order.shipments?.[0]?.courier
                    : null,
                awb_number: Array.isArray(order.shipments)
                    ? order.shipments?.[0]?.awb
                    : null,
                payment_mode: order.cod === 1 ? "COD" : "PREPAID",
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(structuredOrders),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            message: `Unable to fetch orders due to some error occurred`,
                        }),
                    },
                ],
            };
        }
    });
    server.tool("shipping_rate_calculator", `Get serviceable shipping couriers, their prices and EDDs (Estimated Delivery Dates).
    
    Args:
        pickup_postcode: String representing pincode of order pickup location
        delivery_postcode: String representing pincode of order delivery location
        weight_in_kg: String representing weight of the order package
        cod_or_prepaid: Enum('COD', 'PREPAID') representing mode of payment of the order
    
    Returns: List of dictionary containing following info:
        courier_name: String representing name of the courier
        cutoff_time: String representing time deadline for 
        etd: Date-time formatted string representing expected date & time of delivery
        freight_charge: Number represeting cost of shipment in Indian Rupees
        transport_mode: Enum('SURFACE', 'AIR') representing mode of transport
        rto_charges: Number represeting the cost (in Indian Rupees) associated with return shipment if order gets RTO`, {
        pickup_postcode: zod_1.z.string(),
        delivery_postcode: zod_1.z.string(),
        weight_in_kg: zod_1.z.number(),
        cod_or_prepaid: zod_1.z.string(zod_1.z.enum(["COD", "PREPAID"])),
    }, { title: "Shipping Rate Calculator", readOnlyHint: true, destructiveHint: false }, async ({ pickup_postcode: pickupPincode, delivery_postcode: deliveryPostcode, weight_in_kg: weight, cod_or_prepaid: codOrPrepaid, }, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SERVICEABILITY}/courier/ratingserviceability?medium=shiprocketMCP&pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPostcode}&weight=${weight}&cod=${codOrPrepaid === "COD" ? 1 : 0}`;
        try {
            const data = (await axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data;
            const couriers = data.data.available_courier_companies.map((courier) => ({
                courier_name: courier.courier_name,
                cutoff_time: courier.cutoff_time,
                etd: courier.etd,
                freight_charge: courier.freight_charge,
                transport_mode: courier.is_surface ? "SURFACE" : "AIR",
                rto_charges: courier.rto_charges,
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(couriers),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `Unable to fetch couriers due to some error`,
                    },
                ],
            };
        }
    });
    server.tool("order_ship", `Ship order by assigning courier to the order

    Args:
        order_id: Alphanumeric ID which can be 'Order ID' or 'Channel Order ID' or 'Shipment ID'
        courier_id: Optional number representing courier ID to assign shipment
        
    Returns: Dictionary containing success status and a status message`, {
        order_id: zod_1.z.string().min(1),
        courier_id: zod_1.z.number().optional(),
    }, { title: "Ship Order", readOnlyHint: false, destructiveHint: true }, async ({ order_id: orderId, courier_id: courierId }, context) => {
        orderId = orderId.trim();
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/courier/assign/awb`;
        try {
            const data = (await axios_1.default.post(url, {
                oid: isNaN(Number(orderId)) ? orderId : parseInt(orderId),
                courier_id: courierId,
                medium: "shiprocketMCP",
            }, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Shipment assigned to ${data?.response?.data?.courier_name} with AWB code ${data?.response?.data?.awb_code}`,
                        }),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            message: `Unable to assign courier due to some error occurred`,
                        }),
                    },
                ],
            };
        }
    });
    server.tool("order_schedule_pickup", `Schedule pickup for the order shipment

    Args:
        order_id: Alphanumeric ID which can be 'Order ID' or 'Channel Order ID' or 'Shipment ID'
        pickup_date: Date formatted ('YYYY-MM-DD') string representing date on which pickup will be scheduled

    Returns: Dictionary containing success status and a status message`, {
        order_id: zod_1.z.string().min(1),
        pickup_date: zod_1.z.string(),
    }, { title: "Schedule Order Pickup", readOnlyHint: false, destructiveHint: true }, async ({ order_id: orderId, pickup_date: pickupDate }, context) => {
        orderId = orderId.trim();
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/courier/generate/pickup`;
        try {
            await axios_1.default.post(url, {
                oid: isNaN(Number(orderId)) ? orderId : parseInt(orderId),
                pickup_date: [pickupDate],
                medium: "shiprocketMCP",
            }, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Shipment's pickup is scheduled on date ${pickupDate}`,
                        }),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            message: `Unable to schedule your pickup due to some error occurred`,
                        }),
                    },
                ],
            };
        }
    });
    server.tool("order_cancel", `Cancel order

    Args:
        order_id: Number representing order ID
        cancel_on_channel: Optional boolean representing if the order should also be cancelled on the original channel
        
    Returns: Dictionary containing success status and a status message`, {
        order_id: zod_1.z.number(),
        cancel_on_channel: zod_1.z.boolean().default(true),
    }, { title: "Cancel Order", readOnlyHint: false, destructiveHint: true }, async ({ order_id: orderId, cancel_on_channel: cancelOnChannel }, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/orders/cancel`;
        try {
            await axios_1.default.post(url, {
                ids: [orderId],
                cancel_on_channel: cancelOnChannel,
                medium: "shiprocketMCP",
            }, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Order cancelled successfully`,
                        }),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            message: `Unable to cancel your order due to some error occurred`,
                        }),
                    },
                ],
            };
        }
    });
    server.tool(`order_create`, `Create order

    Args:
        pickup_location_nickname: String representing short nickname of pickup location
        customer_name: String representing name of the customer who placed order
        customer_email: String representing email of the customer who placed order
        customer_phone: 10-digit number representing phone number of the customer who placed order
        delivery_address: String representing customer address on which order will be delivered
        delivery_city: String representing city of delivery address
        delivery_pincode: 6-digit number representing pincode of delivery address
        delivery_state: String representing state of delivery address
        delivery_country: String representing country of delivery address
        length:	Number representing length of the order package in centimeters
        breadth: Number representing breadth of the order package in centimeters
        height:	Number representing height of the order package in centimeters
        weight: Number representing wight of the order package in kilograms
        mode_of_payment: Enum('COD', 'PREPAID') representing mode of payment for the order
        order_items: List of dictionary containing following info of each product in the order:
            name: String representing name of the product item
            sku: String representing SKU of the product item
            units: Number representing quantity of product ordered
            selling_price: Number representing price of product ordered

    Returns: Dictionary containing success status and a status message`, {
        pickup_location: zod_1.z.string(),
        customer_name: zod_1.z.string(),
        customer_email: zod_1.z.string().email(),
        customer_phone: zod_1.z.number(),
        delivery_address: zod_1.z.string(),
        delivery_city: zod_1.z.string(),
        delivery_pincode: zod_1.z.number(),
        delivery_state: zod_1.z.string(),
        delivery_country: zod_1.z.string().default("India"),
        length: zod_1.z.number(),
        breadth: zod_1.z.number(),
        height: zod_1.z.number(),
        weight: zod_1.z.number(),
        mode_of_payment: zod_1.z.string(zod_1.z.enum(["COD", "PREPAID"])),
        order_items: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            sku: zod_1.z.string(),
            units: zod_1.z.number(),
            selling_price: zod_1.z.number(),
        })),
    }, { title: "Create Order", readOnlyHint: false, destructiveHint: true }, async (args, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/orders/create/adhoc`;
        try {
            const data = (await axios_1.default.post(url, {
                order_id: `MCP-${Date.now()}-${Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4)}`,
                order_date: new Date().toLocaleDateString("en-CA"),
                pickup_location: args.pickup_location,
                billing_customer_name: args.customer_name.split(" ")[0],
                billing_last_name: args.customer_name.split(" ").slice(1).join(" ") || "",
                billing_address: args.delivery_address,
                billing_city: args.delivery_city,
                billing_pincode: args.delivery_pincode,
                billing_state: args.delivery_state,
                billing_country: args.delivery_country,
                billing_email: args.customer_email,
                billing_phone: args.customer_phone,
                shipping_is_billing: true,
                order_items: args.order_items,
                payment_method: args.mode_of_payment,
                sub_total: args.order_items.reduce((acc, item) => acc + item.selling_price * item.units, 0),
                length: args.length,
                breadth: args.breadth,
                height: args.height,
                weight: args.weight,
                medium: "shiprocketMCP",
            }, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data;
            if (!data.order_id) {
                return {
                    content: [{ type: "text", text: JSON.stringify({ success: false, error: data.message ?? "Order creation failed" }) }],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Order created successfully with Order Id: ${data.order_id}`,
                        }),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            message: `Unable to create your order due to some error occurred`,
                        }),
                    },
                ],
            };
        }
    });
    server.tool("list_pickup_addresses", `Get all the pickup address of the seller

    Returns: List of dictionary representing pickup addresses of seller with following info:
        pickup_address_id: Number representing pickup address ID
        pickup_location_nickname: String representing short nickname of pickup location
        address: String representing pickup address line
        city: String representing pickup address city
        state: String representing pickup address state
        country: String representing pickup address country
        pincode: 6-digit number representing pickup address pincode`, {}, { title: "List Pickup Addresses", readOnlyHint: true, destructiveHint: false }, async (_args, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/settings/company/pickup?medium=shiprocketMCP`;
        try {
            const data = (await axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data?.data?.shipping_address
                            ?.slice(0, 10)
                            ?.map((address) => ({
                            pickup_address_id: address.id,
                            pickup_location_nickname: address.pickup_location,
                            address: address.address,
                            city: address.city,
                            state: address.state,
                            country: address.country,
                            pincode: address.pin_code,
                        }))),
                    },
                ],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: err.response?.data,
                            }),
                        },
                    ],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            message: `Unable to fetch pickup addresses due to some error occurred`,
                        }),
                    },
                ],
            };
        }
    });
    server.tool("generate_shipment_label", `Generate shipment label and get the link of generated label as PDF file

    Returns:
        file_url: String representing URL of generated label`, { shipment_id: zod_1.z.number() }, { title: "Generate Shipment Label", readOnlyHint: true, destructiveHint: false }, async ({ shipment_id: shipmentId }, context) => {
        const { sellerToken } = connections_1.connectionsBySessionId[context.sessionId ?? connections_1.globalSessionId];
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/courier/generate/label`;
        try {
            const data = (await axios_1.default.post(url, { shipment_id: shipmentId }, {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                    "Content-Type": "application/json",
                },
            })).data;
            if (!data.label_created || !data.label_url) {
                return {
                    content: [{ type: "text", text: JSON.stringify({ success: false, error: data.response ?? "Label generation failed. Ensure the shipment has an AWB assigned." }) }],
                };
            }
            return {
                content: [{ type: "text", text: JSON.stringify({ file_url: data.label_url }) }],
            };
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError && err.response?.status === 401) {
                return shiprocketAuthError(context.sessionId ?? connections_1.globalSessionId);
            }
            if (err instanceof axios_2.AxiosError) {
                console.error(err.response?.data);
                return {
                    content: [{ type: "text", text: JSON.stringify({ success: false, error: err.response?.data }) }],
                };
            }
            else if (err instanceof Error) {
                console.error(err.stack);
            }
            return {
                content: [{ type: "text", text: JSON.stringify({ success: false, message: "Unable to generate label" }) }],
            };
        }
    });
};
exports.initializeTools = initializeTools;
