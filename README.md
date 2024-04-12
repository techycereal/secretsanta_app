# Secret Santa Application

## Overview
The Secret Santa application is designed to facilitate group gift exchanges, making it easier for people to organize and participate in Secret Santa events. It allows users to create groups, join them, add wishlist items, and view the lists of their assigned gift recipients.

## Features
- **Group Management**: Create and manage groups for gift exchanges.
- **Member Management**: Add members to groups and manage their participation.
- **Wishlist Management**: Members can add items to their personal wishlists.
- **Pairing System**: Randomly pairs members within their groups to organize the gift exchange.
- **Admin Features**: Special admin codes for group management and additional controls.

## Technology Stack
- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **SQLite3**: SQL database engine used for storing all application data.
- **Body-Parser**: Middleware for parsing incoming request bodies.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.

## Setup and Installation

### Prerequisites
- Node.js installed on your system.
- Basic knowledge of JavaScript and Node.js environments.

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>

### Install dependencies:

```bash
npm install
```

## Database Setup

Before starting the server, you need to set up the database schema. The application uses SQLite for data storage, and the following tables are required for the application to function correctly:

### Tables

#### EnterGroups
- `groupId`: INTEGER PRIMARY KEY NOT NULL - Unique identifier for the group.
- `groupCode`: TEXT - Unique code for the group.
- `groupName`: TEXT - Name of the group.
- `adminCode`: TEXT - Administrative code for managing the group.

### Groups
- groupCode: TEXT - Group code, referencing EnterGroups.
- Person: TEXT - Name of the person.
- personId: INTEGER PRIMARY KEY - Unique identifier for the person.

### List
- groupId: INTEGER - Group identifier, referencing EnterGroups.
- personId: INTEGER - Person identifier, referencing Groups.
- item: TEXT - Item on the wishlist.


### Pairs
- groupId: INTEGER - Group identifier, referencing EnterGroups.
- personId: INTEGER - Person identifier, referencing Groups.
- personId2: INTEGER - Paired person identifier, referencing Groups.
