package com.reevibes.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.internet.MimeBodyPart;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gmail.client.id}")
    private String clientId;

    @Value("${gmail.client.secret}")
    private String clientSecret;

    @Value("${gmail.refresh.token}")
    private String refreshToken;

    @Value("${gmail.otp.from}")
    private String otpFromEmail;

    @Value("${gmail.welcome.from}")
    private String welcomeFromEmail;

    @Value("${gmail.from.name}")
    private String fromName;

    @Value("${gmail.reply.to}")
    private String replyToEmail;

    private String getAccessToken() {
        if (clientId == null || clientId.trim().isEmpty() || 
            clientSecret == null || clientSecret.trim().isEmpty() || 
            refreshToken == null || refreshToken.trim().isEmpty()) {
            log.warn("Gmail API Credentials not fully configured. Email sending will be simulated.");
            return null;
        }

        String url = "https://oauth2.googleapis.com/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = String.format("client_id=%s&client_secret=%s&refresh_token=%s&grant_type=refresh_token",
                clientId, clientSecret, refreshToken);

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<?, ?> responseBody = response.getBody();
                if (responseBody != null) {
                    return (String) responseBody.get("access_token");
                }
            }
        } catch (Exception e) {
            log.error("Failed to retrieve access token from Google OAuth. Email will be simulated.", e);
        }
        return null;
    }

    private void sendGmailApi(String fromEmail, String toEmail, String subject, String htmlContent) {
        String accessToken = getAccessToken();
        if (accessToken == null) {
            log.info("=== SIMULATED EMAIL ===");
            log.info("From: {} <{}>", fromName, fromEmail);
            log.info("To: {}", toEmail);
            log.info("Subject: {}", subject);
            log.info("Content: {}", htmlContent);
            log.info("========================");
            return;
        }

        try {
            Session session = Session.getDefaultInstance(new Properties(), null);
            MimeMessage email = new MimeMessage(session);
            
            email.setFrom(new InternetAddress(fromEmail, fromName));
            email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(toEmail));
            email.setSubject(subject);
            email.setHeader("Reply-To", replyToEmail);

            MimeMultipart multipart = new MimeMultipart();
            MimeBodyPart bodyPart = new MimeBodyPart();
            bodyPart.setContent(htmlContent, "text/html; charset=utf-8");
            multipart.addBodyPart(bodyPart);
            email.setContent(multipart);

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            email.writeTo(buffer);
            byte[] rawBytes = buffer.toByteArray();
            String encodedEmail = Base64.getUrlEncoder().withoutPadding().encodeToString(rawBytes);

            String sendUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("raw", encodedEmail);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(sendUrl, request, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("Email sent successfully to {} via Gmail API", toEmail);
            } else {
                log.error("Gmail API returned non-OK status: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {} via Gmail API", toEmail, e);
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Email Verification - ReeVibes";
        String htmlContent = getOtpEmailTemplate(otp);
        sendGmailApi(otpFromEmail, toEmail, subject, htmlContent);
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to ReeVibes!";
        String htmlContent = getWelcomeEmailTemplate(name);
        sendGmailApi(welcomeFromEmail, toEmail, subject, htmlContent);
    }

    private String getOtpEmailTemplate(String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <style>" +
                "    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }" +
                "    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e4e4e7; }" +
                "    .logo { text-align: center; margin-bottom: 30px; }" +
                "    .logo img { height: 40px; }" +
                "    .title { font-size: 24px; font-weight: bold; color: #18181b; text-align: center; margin-bottom: 20px; }" +
                "    .body-text { font-size: 16px; color: #71717a; line-height: 1.6; margin-bottom: 30px; }" +
                "    .otp-container { text-align: center; margin: 30px 0; padding: 20px; background-color: #fafafa; border-radius: 12px; border: 1px dashed #e4e4e7; }" +
                "    .otp-code { font-size: 36px; font-weight: 800; color: #18181b; letter-spacing: 6px; }" +
                "    .expiry { font-size: 13px; color: #a1a1aa; text-align: center; margin-top: 10px; }" +
                "    .footer { text-align: center; font-size: 12px; color: #a1a1aa; margin-top: 40px; border-top: 1px solid #e4e4e7; padding-top: 20px; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='logo'>" +
                "      <img src='https://res.cloudinary.com/ihbgxvyo/image/upload/f_auto,q_auto/favicon_turcbu' alt='ReeVibes Logo'>" +
                "    </div>" +
                "    <div class='title'>Email Verification</div>" +
                "    <div class='body-text'>" +
                "      Hello,<br/><br/>" +
                "      Your verification code is:" +
                "    </div>" +
                "    <div class='otp-container'>" +
                "      <div class='otp-code'>" + otp + "</div>" +
                "      <div class='expiry'>This code expires in 5 minutes.</div>" +
                "    </div>" +
                "    <div class='body-text'>" +
                "      If you did not request this code, please ignore this email." +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2026 ReeVibes. All rights reserved." +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    private String getWelcomeEmailTemplate(String name) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <style>" +
                "    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 0; }" +
                "    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); border: 1px solid #f4f4f5; }" +
                "    .header { background: linear-gradient(135deg, #18181b, #27272a); padding: 40px; text-align: center; color: #ffffff; }" +
                "    .logo { margin-bottom: 20px; }" +
                "    .logo img { height: 35px; filter: brightness(0) invert(1); }" +
                "    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }" +
                "    .content { padding: 40px; }" +
                "    .greeting { font-size: 20px; font-weight: 700; color: #18181b; margin-bottom: 16px; }" +
                "    .message { font-size: 15px; color: #52525b; line-height: 1.7; margin-bottom: 30px; }" +
                "    .features { background-color: #f4f4f5; padding: 24px; border-radius: 12px; margin-bottom: 30px; }" +
                "    .feature-item { display: flex; align-items: start; margin-bottom: 16px; }" +
                "    .feature-item:last-child { margin-bottom: 0; }" +
                "    .feature-title { font-weight: 700; color: #18181b; font-size: 14px; margin-bottom: 4px; }" +
                "    .feature-desc { color: #71717a; font-size: 13px; line-height: 1.5; }" +
                "    .cta-container { text-align: center; margin: 40px 0; }" +
                "    .cta-button { background-color: #18181b; color: #ffffff !important; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block; transition: all 0.2s; }" +
                "    .support { font-size: 13px; color: #a1a1aa; border-top: 1px solid #f4f4f5; padding-top: 24px; margin-top: 40px; text-align: center; }" +
                "    .footer { background-color: #f4f4f5; padding: 24px; text-align: center; font-size: 12px; color: #a1a1aa; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <div class='logo'>\n" +
                "        <img src='https://res.cloudinary.com/ihbgxvyo/image/upload/f_auto,q_auto/favicon_turcbu' alt='ReeVibes Logo'>\n" +
                "      </div>" +
                "      <h1>Welcome to ReeVibes!</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <div class='greeting'>Hello " + name + ",</div>" +
                "      <div class='message'>" +
                "        Thank you for joining ReeVibes, your premier destination for curated fashion collections. We are thrilled to welcome you to our exclusive community of design enthusiasts and curators." +
                "      </div>" +
                "      <div class='features'>" +
                "        <div class='feature-item'>" +
                "          <div>" +
                "            <div class='feature-title'>✨ Curated Selections</div>" +
                "            <div class='feature-desc'>Handpicked items tailored by top global fashion labels.</div>" +
                "          </div>" +
                "        </div>" +
                "        <div style='height: 15px;'></div>" +
                "        <div class='feature-item'>" +
                "          <div>" +
                "            <div class='feature-title'>🔒 Secure & Fast Checkout</div>" +
                "            <div class='feature-desc'>Streamlined purchase paths with fully transparent tracking.</div>" +
                "          </div>" +
                "        </div>" +
                "      </div>" +
                "      <div class='cta-container'>" +
                "        <a href='http://localhost:5173' class='cta-button'>Explore Dashboard</a>" +
                "      </div>" +
                "      <div class='support'>" +
                "        Need help or have questions? Reach out to us at <a href='mailto:hello@reevibes.com' style='color: #18181b; text-decoration: underline;'>hello@reevibes.com</a>" +
                "      </div>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2026 ReeVibes. All rights reserved." +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
