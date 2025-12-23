FROM maven:3.8-jdk-11 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:11-jre
WORKDIR /app
COPY --from=build /build/target/order_service-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java","-jar","/app/app.jar"]