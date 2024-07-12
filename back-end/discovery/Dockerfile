FROM openjdk:17-alpine
WORKDIR /app
COPY target/*.jar ./discovery-service.jar
EXPOSE 8761
CMD ["java", "-jar", "discovery-service.jar"]