import { useNavigate } from "react-router-dom";
import React, { useState} from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleLogin =  (e) => {
    e.preventDefault();
    

    axios
      .post("http://localhost:3001/login", { username, password })
      .then((response) => {
        console.log(response.data);
        if (response.data.message === "login successfully") {
         
          setError(response.data.message);
         // alert("login successfull");

          navigate("/seatallotment");
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => console.log(err));
  };
  
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;

