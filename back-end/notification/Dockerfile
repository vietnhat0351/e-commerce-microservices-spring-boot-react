FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./notification-service.jar
EXPOSE 8086
CMD ["java", "-jar", "notification-service.jar"]