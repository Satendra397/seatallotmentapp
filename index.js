
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "localhost",
    user : "root",
    password : "Sate@1234",
    database : "seatallotmentdb"
})


// Login endpoint
app.post("/login", (req, res) => {
    const q = "SELECT * FROM user WHERE username = ? AND password = ? ";
  
    connection.query(q, [req.body.username,req.body.password,req.body.date], (err, data) => {
      if(err)
      {
         return res.json({err : err})
      }
      if (data.length >0){
          return res.json({ message : "login successfully",data});
      } else{
          return res.json({ message :"Please enter valid username and password"});
  
      }
      
     
    });
  });

  
// Seat Allotment Endpoint
app.post("/seatallotment", (req, res) => {
   // const { employeeName, seatNumber } = req.body;
   const q = "SELECT * FROM seatbooking WHERE seatno = ?";
  connection.query(q, req.body.seatNumber, (err, result) => {
    if (err) {
      return res.json({ err: err });
    }

    if (result.length > 0) {
      // Seat is already booked
      return res.json({ message: "Seat is already booked." });
    }



    const q = "INSERT INTO seatbooking (`employeename`, `seatno`,`date`) VALUES (?, ?,?)";
  
    connection.query(q, [req.body.employeeName, req.body.seatNumber,req.body.date], (err, data) => {
      if (err) {
        return res.json({ err: err });
      }
      
  
      return res.json({ message: "Seat has been allocated successfully.",data });
    });
  });
});
  
  
// Fetch all allotments
app.get("/myallotments", (req, res) => {
    const query = "SELECT * FROM seatbooking";
  
    connection.query(query, (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Failed to fetch allotments" });
      }
  
      
      return res.json(data);
    });
  });


  
// Update allotment by ID
app.post("/allotments/:id", (req, res) => {
    const { id } = req.params;
    const { employeename, seatno, date } = req.body;
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace("T", " ");
  
    const query = "UPDATE seatbooking SET employeename = ?, seatno = ?, date = ? WHERE id = ?";
    const values = [employeename, seatno, date, id];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ error: "Failed to update allotment" });
      }
  
      return res.json({ message: "Allotment updated successfully" });
    });
  });

 
app.listen(3001,() =>{
    console.log("server running");
})





