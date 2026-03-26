# ──── Stage 1 : Maven Build ────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache optimization: copy pom.xml first
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Compile the application
COPY src ./src
RUN mvn package -DskipTests -q

# ──── Stage 2 : Runtime image ────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]