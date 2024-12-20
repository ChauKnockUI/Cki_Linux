const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình database
const dbConfig = {
  host: 'db', // Tên service của database trong Docker Compose
  user: 'root',
  password: 'yourpassword',
  database: 'webapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // Thời gian chờ kết nối (10 giây)
};

let pool;

// Hàm kiểm tra kết nối và thử lại nếu thất bại
async function initializeDatabaseConnection(retries = 5, delay = 5000) {
  while (retries > 0) {
    try {
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      console.log("Database connected!");
      connection.release();
      break;
    } catch (err) {
      console.error(`Database connection failed. Retries left: ${retries}`, err);
      retries--;
      if (retries === 0) {
        console.error("Could not establish database connection. Exiting.");
        process.exit(1); // Thoát nếu không thể kết nối
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// API: Lấy danh sách users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
});

// API: Thêm user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  console.log(`Received name: ${name}, email: ${email}`);
  try {
    await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).send('User added');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Error adding user');
  }
});

// Khởi tạo server và kết nối database
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await initializeDatabaseConnection();
});
