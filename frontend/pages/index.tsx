import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
  // const [id, setId] = useState('');
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:3001/match/join', { id });
  //     const message = response.data.message;
  //     alert(message);

  //     router.push('/game');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleClick = async () => {
    router.push('/app');
  };
  return (
    <div>
      <h1>
        HOME PAGE
      </h1>
      <br></br>
      <h2>
        Move to Match PAGE
      </h2>
      <button onClick={handleClick}>Match Page</button>
    </div>
  )
}