FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./user-service.jar
EXPOSE 8082
CMD ["java", "-jar", "user-service.jar"]