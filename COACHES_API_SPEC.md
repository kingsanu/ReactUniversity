# Coaches API Specification

## Overview
This document outlines the API endpoints and data structures for the Coaches module in the admin panel.

## Endpoints

### 1. Get All Coaches
Retrieves a paginated list of coaches with their details and status.

- **URL**: `/authapi/coaches`
- **Method**: `GET`
- **Query Parameters**:
    - `page` (number, optional): Page number (default: 1)
    - `limit` (number, optional): Items per page (default: 10)
    - `search` (string, optional): Search by name or email

#### Response
```json
{
  "data": [
    {
      "id": "coach_123",
      "fullName": "John Coach",
      "email": "john.coach@example.com",
      "status": "active",
      "joinedAt": "2023-01-15T10:00:00Z",
      "specialization": "Career Development",
      "activeStudents": 12
    },
    {
      "id": "coach_124",
      "fullName": "Jane Mentor",
      "email": "jane.mentor@example.com",
      "status": "pending",
      "joinedAt": "2023-11-20T14:30:00Z",
      "specialization": "Technical Interview",
      "activeStudents": 0
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Invite Coach (Single)
Invites a single coach by email.

- **URL**: `/authapi/invite-coach`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "new.coach@example.com"
}
```

#### Response
```json
{
  "message": "Invitation sent successfully",
  "invitationId": "inv_456"
}
```

### 3. Bulk Invite Coaches
Registers/Invites multiple coaches at once.

- **URL**: `/authapi/signup-coach-bulk`
- **Method**: `POST`
- **Body**:
```json
{
  "coaches": [
    {
      "fullName": "Alice Coach",
      "email": "alice@example.com",
      "password": "generated_password"
    },
    {
      "fullName": "Bob Coach",
      "email": "bob@example.com",
      "password": "generated_password"
    }
  ]
}
```

#### Response
```json
[
  {
    "email": "alice@example.com",
    "success": true,
    "id": "coach_789"
  },
  {
    "email": "bob@example.com",
    "success": false,
    "error": "Email already exists"
  }
]
```
