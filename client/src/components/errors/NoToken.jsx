import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../styles/notoken.css'


export function NoTokenError({ message }) {
  const [timer, setTimer] = useState(4); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          navigate('/login'); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000); 

    return () => clearInterval(countdown); 
  }, [navigate]);

  return (
    <>
    <div className="error-wrapper">
      <h1>{message}</h1>
      <p>Redirecting to login in {timer} seconds...</p>
    </div>
    </>
  );
}
