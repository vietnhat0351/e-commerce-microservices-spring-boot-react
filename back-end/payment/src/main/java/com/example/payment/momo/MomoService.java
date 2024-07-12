package com.example.payment.momo;

import com.example.payment.Payment;
import com.example.payment.PaymentMethod;
import com.example.payment.PaymentRepository;
import com.example.payment.clients.OrderServiceFeignClient;
import com.example.payment.kafka.Customer;
import com.example.payment.kafka.PaymentProducer;
import com.example.payment.kafka.PaymentSuccessNotification;
import com.example.payment.momo.client.MomoFeignClient;
import com.example.payment.momo.constants.Parameter;
import com.example.payment.momo.dto.*;
import com.example.payment.momo.enums.Language;
import com.example.payment.momo.enums.RequestType;
import com.example.payment.momo.utils.Encoder;
import com.example.payment.order.Order;
import com.example.payment.order.enums.OrderStatus;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {

    private final MomoFeignClient momoFeignClient;
    private final OrderServiceFeignClient orderClient;
    private final PartnerInfo partnerInfo;
    private final PaymentRepository paymentRepository;
    private final PaymentProducer paymentProducer;

    @Value("${payment.momo.redirect-url}")
    private String returnUrl;
    @Value("${payment.momo.notify-url}")
    private String notifyUrl;

    public PaymentResponse createPayment(MomoPaymentRequestBody request) {

        Order order = orderClient.getOrder(request.getOrderId());

        if (order == null) {
            log.error("[createPayment] Order not found");
            return null;
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            log.error("[createPayment] Order status is not PENDING");
            return null;
        }
        System.out.println(order.getTotalPrice());
        PaymentRequest paymentRequest = createPaymentRequest(
                order.getId(),
                Long.toString((long) order.getTotalPrice()),
                order.getId(),
                request.getOrderInfo(),
                request.getExtraData()
        );
        System.out.println(paymentRequest);
        return momoFeignClient.createPayment(paymentRequest);
    }

    public PaymentRequest createPaymentRequest(
            String requestId, String amount, String orderId, String orderInfo, String extraData) {
        try {
            RequestType requestType = RequestType.CAPTURE_WALLET;
            String requestRawData = new StringBuilder()
                    .append(Parameter.ACCESS_KEY).append("=").append(partnerInfo.getAccessKey()).append("&")
                    .append(Parameter.AMOUNT).append("=").append(amount).append("&")
                    .append(Parameter.EXTRA_DATA).append("=").append(extraData).append("&")
                    .append(Parameter.IPN_URL).append("=").append(notifyUrl).append("&")
                    .append(Parameter.ORDER_ID).append("=").append(orderId).append("&")
                    .append(Parameter.ORDER_INFO).append("=").append(orderInfo).append("&")
                    .append(Parameter.PARTNER_CODE).append("=").append(partnerInfo.getPartnerCode()).append("&")
                    .append(Parameter.REDIRECT_URL).append("=").append(returnUrl).append("&")
                    .append(Parameter.REQUEST_ID).append("=").append(requestId).append("&")
                    .append(Parameter.REQUEST_TYPE).append("=").append(requestType.getRequestType())
                    .toString();

            String signRequest = Encoder.signHmacSHA256(requestRawData, partnerInfo.getSecretKey());
            log.debug("[PaymentRequest] rawData: " + requestRawData + ", [Signature] -> " + signRequest);

            return new PaymentRequest(partnerInfo.getPartnerCode(), orderId, requestId, Language.EN, orderInfo, Long.valueOf(amount), "Phạm Việt Nhật", null, requestType,
                    returnUrl, notifyUrl, "test store ID", extraData, null, Boolean.TRUE, null, signRequest);
        } catch (Exception e) {
            log.error("[PaymentRequest] " + e);
        }
        return null;
    }

    public void cancelTransaction(String orderId) {
        try {
            String requestRawData = "accessKey=$accessKey&amount=$amount&description=$description&orderId=$orderId&partnerCode=$partnerCode&requestId=$requestId&requestType=$requestType"
                    .replace("$accessKey", partnerInfo.getAccessKey())
                    .replace("$amount", "2428")
                    .replace("$description", "cancel")
                    .replace("$orderId", orderId)
                    .replace("$partnerCode", partnerInfo.getPartnerCode())
                    .replace("$requestId", orderId)
                    .replace("$requestType", "cancel");
            System.out.println(requestRawData);
            String signature = Encoder.signHmacSHA256(requestRawData, partnerInfo.getSecretKey());
            CancelTransactionRequest cancelTransactionRequest = new CancelTransactionRequest(
                    partnerInfo.getPartnerCode(),
                    orderId,
                    orderId,
                    "cancel",
                    2428L,
                    "vi",
                    "cancel",
                    signature);
            Object object = momoFeignClient.queryPayment(cancelTransactionRequest);
            System.out.println(object);
        } catch (Exception e) {
            log.error("[CancelRequest] " + e);
        }
    }

    public Payment handlePaymentNotification(PaymentNotification paymentNotification) {

        if(paymentRepository.findById(paymentNotification.getOrderId()).isPresent()){
            return null;
        }

        if(paymentNotification.getResultCode() != 0){
            log.error("[handlePaymentNotification] Payment failed: " + paymentNotification.getMessage());
            return null;
        }

        Payment payment = new Payment();
        payment.setOrderId(paymentNotification.getOrderId());
        payment.setAmount((double) paymentNotification.getAmount());
        payment.setPaymentMethod(PaymentMethod.MOMO_WALLET);
        payment.setCreatedDate(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        payment.setLastModifiedDate(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        paymentRepository.save(payment);
        Customer customer = orderClient.getCustomerFromOrder(payment.getOrderId());
        paymentProducer.sendPaymentSuccessMessage(new PaymentSuccessNotification(
                payment.getId(),
                payment.getOrderId(),
                customer,
                payment.getPaymentMethod(),
                payment.getAmount(),
                payment.getCreatedDate()));
        return payment;
    }

    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId).orElse(null);
    }
}
