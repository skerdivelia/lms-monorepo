FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -DskipTests

COPY src ./src
RUN mvn clean package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

ENV JAVA_TOOL_OPTIONS "-XX:+UseSerialGC -Xmx384m"

RUN find /build/target -name "*.jar" ! -name "*.original" | head -n 1 | xargs cp /app/app.jar

EXPOSE 10000

ENTRYPOINT ["java", "-cp", "app.jar", "com.lms.LmsApplication"]
