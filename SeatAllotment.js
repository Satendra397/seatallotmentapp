import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatAllotment.css';
import { Link, useNavigate } from 'react-router-dom';

const SeatAllocation = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

   // Seat availability state
   const [bookedSeats, setBookedSeats] = useState([]);

  // Session management state
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsLoggedIn(false), 3000000); // 30 seconds
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
    // Fetch the list of booked seats from the server
    const fetchBookedSeats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bookedseats');
        setBookedSeats(response.data.bookedSeats);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookedSeats();
  }, []);

  const handleSave = async () => {
    if (!employeeName) {
      console.log('Please enter employee name');
      return;
    }
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const response = await axios.post('http://localhost:3001/seatallotment', {
        employeeName,
        seatNumber: selectedSeat,
        date: formattedDate,
      });
      setSelectedSeat(null);
      setEmployeeName('');
      setShowPopup(false);
      if (response.data.message === 'Seat is already booked.') {
        return alert('Seat is already booked.');
      }
      console.log(response.data);
      alert('Seat allocated successfully.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeat(seatNumber);
    setShowPopup(true);
  };

  if (!isLoggedIn) {
    navigate('/');
    return null;
  }

  const seats = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18'
  ];

  

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <h2>Seat Allotment Component</h2>
      <h2>
        <div>
          <Link to='/myallotment'>Seat Allotment Dashboard</Link>
        </div>
      </h2>

      <div className="seat-row">
        {seats.map((seatNumber) => (
          <div
            className={`seat${bookedSeats.includes(seatNumber) ? ' booked' : ''}`}
            onClick={() => handleSeatClick(seatNumber)}
            key={seatNumber}
          >
            Seat {seatNumber}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder={`Enter employee name to allot seat ${selectedSeat}`}
          />
          <br/>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SeatAllocation;




















/*
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './SeatAllotment.css';
import { Link, useNavigate } from 'react-router-dom';
//import MyAllotment from './MyAllotment';

const SeatAllocation = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  
  // Session management state
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsLoggedIn(false), 3000000); // 30 seconds
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

 
  const handleSave = async () => {
    if(!employeeName){
        console.log("please enter employee name");
        return;
    }
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const response = await axios.post('http://localhost:3001/seatallotment', {
        employeeName,
        seatNumber: selectedSeat,
        date : formattedDate, 
      });
      setSelectedSeat(null);
      setEmployeeName('');
      setShowPopup(false);
      if(response.data.message==="Seat is already booked.")
      {
        return alert("Seat is already booked.");
      }
      console.log(response.data);
      alert("seat allocated successfully.");

     

    } catch (error) {
      console.error(error);
    }
  };
  const handleSeatClick = (seatNumber) => {
    
    setSelectedSeat(seatNumber);
    setShowPopup(true);
  };

  
  if (!isLoggedIn) {
    navigate('/');
    return null;
  }
     const handleCancel = () =>{
      setShowPopup(false);

     }



  return (
    <div>
        <h2> Seat Allotment Component</h2>
        <h2><div> <Link to='/myallotment'>Seat Allotment Dashboard </Link></div></h2>
        
          
        
      <div className="seat-row">
        <div className="seat" onClick={() => handleSeatClick('1')}>
          Seat 1
        </div>
        <div className="seat" onClick={() => handleSeatClick('2')}>
          Seat 2
        </div>
        <div className="seat" onClick={() => handleSeatClick('3')}>
          Seat 3
        </div>
        <div className="seat" onClick={() => handleSeatClick('4')}>
          Seat 4
        </div>
        <div className="seat" onClick={() => handleSeatClick('5')}>
          Seat 5
        </div>
        <div className="seat" onClick={() => handleSeatClick('6')}>
          Seat 6
        </div>
      </div>
      <div className="seat-row">
        <div className="seat" onClick={() => handleSeatClick('7')}>
          Seat 7
        </div>
        <div className="seat" onClick={() => handleSeatClick('8')}>
          Seat 8
        </div>
        <div className="seat" onClick={() => handleSeatClick('9')}>
          Seat 9
        </div>
        <div className="seat" onClick={() => handleSeatClick('10')}>
          Seat 10
        </div>
        <div className="seat" onClick={() => handleSeatClick('11')}>
          Seat 11
        </div>
        <div className="seat" onClick={() => handleSeatClick('12')}>
          Seat 12
        </div>
        </div>
      <div className="seat-row">
        <div className="seat" onClick={() => handleSeatClick('13')}>
          Seat 13
        </div>
        <div className="seat" onClick={() => handleSeatClick('14')}>
          Seat 14
        </div>
        <div className="seat" onClick={() => handleSeatClick('15')}>
          Seat 15
        </div>
        <div className="seat" onClick={() => handleSeatClick('16')}>
          Seat 16
        </div>
        <div className="seat" onClick={() => handleSeatClick('17')}>
          Seat 17
        </div>
        <div className="seat" onClick={() => handleSeatClick('18')}>
          Seat 18
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder={`Enter employee name to allot seat ${selectedSeat}`}
          />
          <br/>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SeatAllocation;
*/