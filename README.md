# ☁️ CloudVault

<p align="center">
  <strong>Secure cloud-based file storage backend built with Spring Boot, PostgreSQL, JWT Authentication, and Amazon S3.</strong>
</p>

<p align="center">
  <a href="https://www.java.com/">
    <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  </a>
  <a href="https://spring.io/projects/spring-boot">
    <img src="https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  </a>
  <a href="https://aws.amazon.com/s3/">
    <img src="https://img.shields.io/badge/Amazon%20S3-Cloud%20Storage-569A31?style=for-the-badge&logo=amazons3&logoColor=white" alt="Amazon S3">
  </a>
  <a href="https://spring.io/projects/spring-security">
    <img src="https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security">
  </a>
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/Docker-PostgreSQL-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  </a>
  <a href="https://maven.apache.org/">
    <img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven">
  </a>
</p>

---

## 📌 About

CloudVault is a secure backend for cloud-based file storage.

The application uses:

- **Spring Boot** for REST APIs
- **Spring Security + JWT** for stateless authentication
- **BCrypt** for password hashing
- **PostgreSQL** for users and file metadata
- **Amazon S3** for storing actual file objects
- **Docker** for the local PostgreSQL development environment

The system keeps file binaries in S3 while PostgreSQL stores the metadata and ownership information associated with each file.

---

## ✨ Completed Backend Features

| Feature | Status |
|---|:---:|
| User Registration | ✅ |
| JWT Login / Authentication | ✅ |
| BCrypt Password Hashing | ✅ |
| Protected REST APIs | ✅ |
| User-specific File Ownership | ✅ |
| File Upload to Amazon S3 | ✅ |
| File Metadata in PostgreSQL | ✅ |
| List User Files | ✅ |
| Get File Metadata | ✅ |
| Download Files | ✅ |
| Delete Files | ✅ |
| DTO-based API Responses | ✅ |
| Environment-based Configuration | ✅ |
| Docker PostgreSQL Setup | ✅ |

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │        Client        │
                         │   Postman / REST     │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP + JWT
                                    ▼
                         ┌──────────────────────┐
                         │    Spring Boot API   │
                         │                      │
                         │  Spring Security     │
                         │  Controllers         │
                         │  Services            │
                         │  Repositories        │
                         └──────────┬───────────┘
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
                      ▼                           ▼
             ┌─────────────────┐         ┌─────────────────┐
             │   PostgreSQL     │         │    Amazon S3    │
             │                 │         │                 │
             │ Users           │         │ Actual files    │
             │ File metadata   │         │ PDF / images    │
             │ Ownership       │         │ Other objects   │
             └─────────────────┘         └─────────────────┘
```

### Storage Model

```text
File
├── Binary data
│   └── Amazon S3
│
└── Metadata
    └── PostgreSQL
```

---

## 🔄 File Upload Flow

```text
Client
  │
  │ POST /api/files
  │ + JWT
  │ + multipart/form-data
  ▼
Spring Security
  │
  │ Validate JWT
  ▼
FileController
  │
  ▼
FileService
  ├──────────────► Amazon S3
  │                  └── Actual file
  │
  └──────────────► PostgreSQL
                     └── File metadata + owner
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Backend language |
| Spring Boot | REST API |
| Spring Security | Authentication and authorization |
| JWT | Stateless authentication |
| BCrypt | Password hashing |
| Spring Data JPA | Persistence layer |
| Hibernate | ORM |
| PostgreSQL | User and file metadata |
| Amazon S3 | Cloud file storage |
| AWS SDK for Java | S3 integration |
| Maven | Build and dependency management |
| Docker | Local PostgreSQL environment |
| Postman | API testing |

---

## 📁 Project Structure

```text
CloudVault/
│
├── cloudvault/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/rohit/cloudvault/
│       │   │       ├── config/
│       │   │       ├── controller/
│       │   │       ├── dto/
│       │   │       ├── exception/
│       │   │       ├── model/
│       │   │       ├── repository/
│       │   │       ├── security/
│       │   │       ├── service/
│       │   │       └── storage/
│       │   │
│       │   └── resources/
│       │       └── application.properties.example
│       │
│       └── test/
│
├── docker/
│   └── docker-compose.yml
│
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CloudVault
```

Enter the backend directory:

```bash
cd cloudvault
```

---

## 2. Start PostgreSQL

From the **CloudVault project root**:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Verify the container:

```bash
docker ps
```

To stop PostgreSQL:

```bash
docker compose -f docker/docker-compose.yml down
```

To stop PostgreSQL and remove its local volume:

```bash
docker compose -f docker/docker-compose.yml down -v
```

> ⚠️ `down -v` removes the PostgreSQL data volume.

---

## 3. Configure Environment Variables

The repository intentionally does **not** contain the real `application.properties`.

Use `application.properties.example` as the configuration template and provide secrets through environment variables.

### PostgreSQL

```bash
export DB_PASSWORD="your_postgres_password"
```

### JWT

```bash
export JWT_SECRET="your_secure_256_bit_jwt_secret"
export JWT_EXPIRATION="86400000"
```

### AWS S3

```bash
export AWS_ACCESS_KEY_ID="your_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
export AWS_S3_BUCKET="your_s3_bucket_name"
export AWS_S3_REGION="us-east-1"
```

> 🔒 Never commit actual AWS credentials, database passwords, or JWT secrets to GitHub.

---

## 4. Run the Backend

From:

```text
CloudVault/cloudvault
```

run:

```bash
./mvnw spring-boot:run
```

The API will be available at:

```text
http://localhost:8080
```

---

# 🔐 Authentication API

## Register

```http
POST /api/auth/register
```

Example:

```json
{
  "username": "Rohit",
  "email": "rohit@example.com",
  "password": "your-password"
}
```

## Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "rohit@example.com",
  "password": "your-password"
}
```

Example response:

```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "username": "Rohit",
    "email": "rohit@example.com",
    "createdAt": "2026-09-26T17:24:05.348435"
  }
}
```

Use the returned token for protected endpoints:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# 📂 File API

All file endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/files` | Upload a file |
| `GET` | `/api/files` | List authenticated user's files |
| `GET` | `/api/files/{id}` | Get file metadata |
| `GET` | `/api/files/{id}/download` | Download a file |
| `DELETE` | `/api/files/{id}` | Delete a file |

### Upload

```http
POST /api/files
```

Use:

```text
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

Form-data:

```text
file = <your-file>
```

The actual file is uploaded to S3 and its metadata is stored in PostgreSQL.

---

# ☁️ Amazon S3 Security

CloudVault uses a dedicated IAM identity with restricted S3 access.

The application requires:

```text
s3:ListBucket
s3:GetObject
s3:PutObject
s3:DeleteObject
```

The permissions are scoped to the CloudVault bucket rather than using unrestricted S3 access.

### Bucket resource

```text
arn:aws:s3:::YOUR_BUCKET_NAME
```

### Object resource

```text
arn:aws:s3:::YOUR_BUCKET_NAME/*
```

AWS credentials are supplied through environment variables and are not hardcoded in the application.

---

# 🧪 Testing

The backend can be tested using **Postman**.

Recommended flow:

```text
Register
   ↓
Login
   ↓
Copy JWT
   ↓
Upload File
   ↓
List Files
   ↓
Get Metadata
   ↓
Download File
   ↓
Delete File
```

You can also verify S3 objects using AWS CLI:

```bash
aws s3 ls s3://$AWS_S3_BUCKET
```

---

# 🔒 Security

CloudVault currently includes:

- JWT-based stateless authentication
- BCrypt password hashing
- Protected file endpoints
- User-based file ownership
- Restricted S3 IAM permissions
- Environment-based credentials
- DTO-based API responses
- No password field exposed through the REST API

Sensitive values include:

```text
DB_PASSWORD
JWT_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

These values should only be provided through the local environment.

---

# 🐳 Docker Commands

### Start PostgreSQL

```bash
docker compose -f docker/docker-compose.yml up -d
```

### Check running containers

```bash
docker ps
```

### Stop PostgreSQL

```bash
docker compose -f docker/docker-compose.yml down
```

### Remove PostgreSQL volume

```bash
docker compose -f docker/docker-compose.yml down -v
```

---

## 📊 Backend Status

<p align="center">

| Component | Status |
|---|:---:|
| Spring Boot REST API | ✅ |
| PostgreSQL | ✅ |
| JWT Authentication | ✅ |
| BCrypt Password Hashing | ✅ |
| Amazon S3 Integration | ✅ |
| File Upload | ✅ |
| File Metadata | ✅ |
| File Listing | ✅ |
| File Download | ✅ |
| File Deletion | ✅ |
| User Ownership | ✅ |
| DTO Responses | ✅ |
| Docker PostgreSQL | ✅ |

</p>

---

## 👨‍💻 Author

**Rohit Maiya M**

Built as an academic major project and portfolio project.
