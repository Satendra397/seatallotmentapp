import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyAllotment.css";
import { useNavigate } from 'react-router-dom';

const MyAllotment = () => {
  const [allotments, setAllotments] = useState([]);
  const navigate = useNavigate();

   
  // Session management state
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsLoggedIn(false), 30000); // 30 seconds
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Event listeners for user activity
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, []);

  useEffect(() => {
    fetchAllotments();
  }, []);

  const fetchAllotments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/myallotments");
      const fetchedAllotments = response.data.map((allotment) => ({
        ...allotment,
        editable: false, // Initialize the editable flag
      }));
      setAllotments(fetchedAllotments);
      console.log(fetchedAllotments);
    } catch (err) {
      console.log(err);
    }
  };
  

  const handleEdit = (id) => {
    setAllotments((prevAllotments) =>
      prevAllotments.map((allotment) =>
        allotment.id === id ? { ...allotment, editable: !allotment.editable } : allotment
      )
    );
  };

  
const handleInputChange = (id, field, value) => {
  setAllotments((prevAllotments) =>
    prevAllotments.map((allotment) =>
      allotment.id === id ? { ...allotment, [field]: value } : allotment
    )
  );
};
  

  const handleSave = async (id) => {
    // Find the allotment with the given id
    const editedAllotment = allotments.find((allotment) => allotment.id === id);
    

    try {
      // Send the updated allotment data to the server
       const response = await axios.post(`http://localhost:3001/allotments/${id}`, editedAllotment);

       
    // Create a new array of allotments with the updated allotment
    const updatedAllotments = allotments.map((allotment) =>
    allotment.id === id ? editedAllotment : allotment
  );

  // Update the state with the new array of allotments
  setAllotments(updatedAllotments);
       console.log(response.data);


      // Refresh the allotments list
      fetchAllotments();

      // Optionally, show a success message to the user
      //alert("Allotment updated successfully");
    } catch (error) {
      console.error(error);
      // Optionally, show an error message to the user
    }
  };

  
  if (!isLoggedIn) {
    navigate('/');
    return null;
  }

  return (
    <div className="my-allotment">
      <h2>My Allotments</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Seat No</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allotments.map((allotment) => (
            <tr key={allotment.id}>
              <td>{allotment.id}</td>
              <td>
                {allotment.editable ? (
                  <input
                    type="text"
                    value={allotment.employeename}
                    onChange={(e) =>
                      handleInputChange(allotment.id ,'employeename',e.target.value)
                    }
                  />
                ) : (
                  allotment.employeename
                )}
              </td>
              <td>
                {allotment.editable ? (
                  <input
                    type="text"
                    value={allotment.seatno}
                    onChange={(e) => handleInputChange(allotment.id,'seatno' , e.target.value)}
                  />
                ) : (
                  allotment.seatno
                )}
              </td>
              <td>
                {allotment.editable ? (
                  <input
                    type="text"
                    value={allotment.date}
                    onChange={(e) => handleInputChange(allotment.id,'date',  e.target.value)}
                  />
                ) : (
                  allotment.date
                )}
              </td>
              <td>
                {allotment.editable ? (
                  <>
                    <button onClick={() => handleSave(allotment.id)}>
                      Save
                    </button>
                    
                </>
                ) : (
                  <button onClick={() => handleEdit(allotment.id)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAllotment;

