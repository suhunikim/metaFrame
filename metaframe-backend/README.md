# MetaFrame Backend

Spring Boot 3.2 + Gradle Groovy backend for the MetaFrame IDE.

## Toolchain

- Java 21
- Gradle Wrapper 8.10.2
- PostgreSQL 15+

## Run

```powershell
$env:JAVA_HOME='C:\Program Files\JetBrains\IntelliJ IDEA 2024.3.7\jbr'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat bootRun
```

IntelliJ `Run` also uses the same Gradle wrapper setup. The backend now reads a local `.env` file automatically through `spring.config.import`, so you can create `metaframe-backend/.env` from `.env.example` and run without adding extra VM options.

## Verify

```powershell
$env:JAVA_HOME='C:\Program Files\JetBrains\IntelliJ IDEA 2024.3.7\jbr'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat test
.\gradlew.bat bootJar
```

## Environment

Copy `.env.example` to `.env` or place the same values in your shell or IDE run configuration.

The backend is DB-first, so `bootRun` and IntelliJ `Run` still require PostgreSQL to be reachable at the configured `METAFRAME_DB_URL`.
