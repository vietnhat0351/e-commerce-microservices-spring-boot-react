FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./order-service.jar
EXPOSE 8083
CMD ["java", "-jar", "order-service.jar"]