# Student Management System - Microservices on Kubernetes

Final Lab Exam: Microservices, Database, Docker & Kubernetes
Student: Vanuth Srom

## Architecture
- **API Gateway** (Port 5000)
- **Registration Microservice** (Port 5001) - Common
- **Delete Student Microservice** (Port 5002) - Assigned Service
- **Database**: Cloud MongoDB Atlas
- **Kubernetes**: 2 Pods (Pod 1: API Gateway + Registration; Pod 2: Delete Service)

## Endpoints
- `POST /register`: Registers student into MongoDB database
- `DELETE /delete/:id`: Deletes student from database by Student_id
