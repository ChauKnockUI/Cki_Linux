import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    fetch(`http://backend:3000/api/users`) // Đảm bảo cú pháp đúng
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

const addUser = async (e) => {
  console.log("Sending data to server:", { name, email });

  e.preventDefault();

  console.log('Data being sent:', { name, email });

  try {
    const response = await fetch(`http://backend:3000/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();
    console.log('Response data:', data);

    // Clear the form after submission
    setName('');
    setEmail('');

    // Fetch updated users list
    const updatedUsers = await fetch(`http://backend:3000/api/users`).then((res) => res.json());
    setUsers(updatedUsers);
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <div>
      <h1>User Management</h1>
      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
