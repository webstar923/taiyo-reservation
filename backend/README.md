# Reservation System - Node Express

This project is a **reservation system** built with **Node.js** and **Express**. It provides APIs for managing reservations and modifying existing ones.

## Features

- **Reservation API**: Allows users to create new reservations.
- **Change Reservation API**: Allows users to modify existing reservations.
- **Flexible date and time**: Users can specify their preferred date, time, and room for reservation.
- **Simple and intuitive API endpoints**: Designed for easy integration into frontend systems.

## Installation

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x.x or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Database](#database-setup) (e.g., MySQL, MongoDB, etc.)

### Steps to Set Up

1. **Clone the repository**:
   ```bash
   git clone git@github.com:webstar923/reservation_sys_bk.git

   ```

2. **Navigate into the project directory**:
   ```bash
   cd your-repository-name
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment variables**:
   Create a `.env` file in the root directory with the following variables (modify the values according to your environment):

   ```env
   PORT=5000
   DB_CONNECTION_STRING=your-database-connection-string
   ```

   - **PORT**: The port number your application will run on.
   - **DB_CONNECTION_STRING**: Connection string for your database (e.g., MongoDB, MySQL).

5. **Set up your database**:
   Set up the necessary tables/collections for storing reservation data. For a relational database (like MySQL), you might use a table such as:

   ```sql
   CREATE TABLE reservations (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     date DATE,
     time TIME,
     room VARCHAR(255)
   );
   ```

   Adjust this based on your database type and schema.

### Running the Project

Once everything is set up, start the server:

```bash
npm start
```

The server will be running on `http://localhost:5000`.

### Testing the APIs

You can test the APIs using tools like **Postman** or **cURL**.

#### 1. **Create a Reservation**

- **Method**: `POST`
- **Endpoint**: `/api/reservations`
- **Request Body**:
   ```json
   {
     "name": "John Doe",
     "date": "2025-02-15",
     "time": "10:00",
     "room": "101"
   }
   ```

- **Response**:
   ```json
   {
     "id": 1,
     "name": "John Doe",
     "date": "2025-02-15",
     "time": "10:00",
     "room": "101"
   }
   ```

#### 2. **Change a Reservation**

- **Method**: `PUT`
- **Endpoint**: `/api/reservations/:id`
- **Request Body**:
   ```json
   {
     "name": "John Doe",
     "date": "2025-02-16",
     "time": "11:00",
     "room": "102"
   }
   ```

- **Response**:
   ```json
   {
     "id": 1,
     "name": "John Doe",
     "date": "2025-02-16",
     "time": "11:00",
     "room": "102"
   }
   ```

### API Documentation

For detailed API documentation, visit the `/docs` endpoint once the project is running, or refer to the API files in the `src/routes` directory.

## File Structure

```
/reservation-system
  ├── /node_modules          # Node.js modules
  ├── /src
      ├── /controllers       # Controllers for handling business logic
      ├── /models            # Database models
      ├── /routes            # API routes
      ├── /utils             # Utility functions
  ├── .env                   # Environment variables
  ├── .gitignore             # Git ignore file
  ├── package.json           # Project metadata and dependencies
  └── README.md              # Project documentation
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributions

If you'd like to contribute, please feel free to fork the repository and submit a pull request with your changes.

---

Thank you for using the **Reservation System**. If you have any questions or issues, feel free to open an issue or contact us.
```

---

### Summary:

- **Installation**: Details the steps for setting up the project (dependencies, environment variables, and database setup).
- **API Documentation**: Specifies how to test the reservation and change APIs with examples of requests and responses.
- **Project Structure**: Provides an overview of the file structure.
- **License**: Includes a standard open-source license (MIT).

Let me know if you need any more adjustments!