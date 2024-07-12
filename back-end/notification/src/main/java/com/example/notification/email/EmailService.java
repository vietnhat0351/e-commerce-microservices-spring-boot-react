package com.example.notification.email;

import com.example.notification.order.OrderConfirmation;
import com.example.notification.payment.PaymentSuccessNotification;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    public void sendOrderConfirmation(OrderConfirmation orderConfirmation) throws MessagingException {
        String to = orderConfirmation.getCustomer().getEmail();
        log.info("Sending email to: " + to);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                message,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());
        helper.setFrom("vietnhat0351@gmail.com");
        Map<String, Object> model = new HashMap<>();
        model.put("orderConfirmation", orderConfirmation);
        Context context = new Context();
        context.setVariables(model);

        helper.setSubject(EmailTemplates.ORDER_CONFIRMATION.getSubject());

        try {
            String html = templateEngine.process(EmailTemplates.ORDER_CONFIRMATION.getTemplate(), context);
            helper.setText(html, true);
            helper.setTo(to);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to: " + to);
        }
    }

    public void sendPaymentSuccess(PaymentSuccessNotification paymentSuccessNotification) throws MessagingException {
        String to = paymentSuccessNotification.getCustomer().getEmail();
        log.info("Sending email to: " + to);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                message,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());
        helper.setFrom("vietnhat0351@gmail.com");
        Map<String, Object> model = new HashMap<>();
        model.put("paymentSuccessNotification", paymentSuccessNotification);
        Context context = new Context();
        context.setVariables(model);

        helper.setSubject(EmailTemplates.PAYMENT_CONFIRMATION.getSubject());

        try {
            String html = templateEngine.process(EmailTemplates.PAYMENT_CONFIRMATION.getTemplate(), context);
            helper.setText(html, true);
            helper.setTo(to);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to: " + to);
        }
    }
}
