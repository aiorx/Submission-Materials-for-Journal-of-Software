import { useState, useEffect } from 'react';
import axios from './api/axiosConfig';
import { useParams } from 'react-router-dom';

// This code is mostly Produced via common programming aids4 or with help from GPT4
function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [numSeats, setNumSeats] = useState(1);
  const [recommendedSeats, setRecommendedSeats] = useState([]);

  useEffect(() => {
    axios.get(`/sessions/${id}`)
      .then(response => {
        setSession(response.data);
      })
      .catch(error => {
        console.error('Error fetching session', error);
      });
  }, [id]);

  if (!session) {
    return <div>Loading...</div>;
  }

  const handleSeatRequest = () => {
    console.log(id)
    console.log(numSeats)
    axios.get(`/sessions/${id}/recommend-seats?numSeats=${numSeats}`)
      .then(response => {
        console.log(response.data);
        const leftMostSeat = { row: response.data[0] + 1, column: response.data[1] + 1 };
        const newRecommendedSeats = Array.from({length: numSeats}, (_, i) => ({ row: leftMostSeat.row, column: leftMostSeat.column + i }));
        setRecommendedSeats(newRecommendedSeats);
        console.log(newRecommendedSeats);
      })
      .catch(error => {
        console.error('Error fetching recommended seats', error);
      });
  };

  const handleWatch = () => {
    axios.post('/films/watch', session.film)
        .then(response => {
            console.log('Film added to watch history', response);
        })
        .catch(error => {
            console.error('Error adding film to watch history', error);
        });
  };

  return (
    <div>
      <h2>{session.film.title}</h2>
      <p>{new Date(session.time).toLocaleString()}</p>
      <p>{session.language}</p>
      <input type="number" min="1" value={numSeats} onChange={e => setNumSeats(e.target.value)} />
      <button onClick={handleSeatRequest}>Find Seats</button>
      <button onClick={handleWatch}>Watch</button>
      <div>
        {session.isSeatFree.map((row, i) => (
          <div key={i}>
            {row.map((seat, j) => {
                const isRecommended = recommendedSeats.some(s => s.row === i+1 && s.column === j+1);
                return (
                    <span key={j} style={{backgroundColor: isRecommended ? 'yellow' : 'white'}}>
                    {seat ? '🟩' : '🟥'}
                    </span>
                );
                })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionDetails;
