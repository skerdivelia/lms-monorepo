FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -DskipTests --no-transfer-progress

COPY src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# ENV JAVA_TOOL_OPTIONS "-XX:+UseSerialGC -Xmx384m"
# ENV PORT 10000

COPY --from=build /build/target/*.jar ./app.jar

EXPOSE 10000

ENTRYPOINT ["java", "-jar", "./app.jar"]
