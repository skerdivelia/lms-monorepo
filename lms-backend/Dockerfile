FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY backend/pom.xml .
RUN mvn dependency:go-offline -DskipTests

COPY backend/src ./src
RUN mvn clean package -DskipTests

# Debug step that will show us exactly what jars exist so there is zero guesswork
RUN echo "--- Built jars: ---"
RUN ls -lh target/

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

ENV JAVA_TOOL_OPTIONS "-XX:+UseSerialGC -Xmx384m"
ENV PORT 10000

COPY --from=build /build/target/lms-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 10000

ENTRYPOINT ["java", "-jar", "app.jar"]
