FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./product-service.jar
EXPOSE 8081
CMD ["java", "-jar", "product-service.jar"]