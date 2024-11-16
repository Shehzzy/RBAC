import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:2000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token in the header
          },
        });

        setMessage(data.message);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      {/* You can render more user data here */}
    </div>
  );
};

export default Dashboard;
