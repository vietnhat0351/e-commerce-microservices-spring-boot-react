FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./payment-service.jar
EXPOSE 8085
CMD ["java", "-jar", "payment-service.jar"]