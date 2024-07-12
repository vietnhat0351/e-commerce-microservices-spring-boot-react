FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./gateway-service.jar
EXPOSE 9090
CMD ["java", "-jar", "gateway-service.jar"]