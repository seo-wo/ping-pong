import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

export const socket = io('http://localhost:3002/match');

let _user1: string = '';
let _user2: string = '';
let _room: string = '';
let flag: boolean = false;


interface Dto {
  width: number;
  height: number;
  x: number;
  y: number;
  type: string;
  playerId: string
  score: number;
}

export default function App(){
  const [_gameInitFlag, setGameInitFlag] = useState(true);
  const [_gameStartFlag, setGameStartFlag] = useState(false);
  const [_dto, setDto] = useState<Map<string, Dto>>(new Map());

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomID: string = e.currentTarget.roomID.value;
    if (!roomID) {
      alert('방 번호를 입력해주세요.');
      return;
    }
    socket.emit('pressJoin', roomID);
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomID = e.currentTarget.roomID.value;

    if (!roomID) {
      alert('방 번호를 입력해주세요.');
      return;
    }
    socket.emit('pressCreate', roomID);
  }

  const handleGameStart = () => {
    console.log('I preesed game start', socket.id);
    socket.emit('pressGameStart', _room);
  }

  useEffect(() => {
    socket.on(
      'roomExist',
      (retrunMessage: string) => {
        alert(retrunMessage);
    });
    return () => {
      socket.off('roomExist');
    }
  },[]);

  useEffect(() => {
    socket.on(
      'roomLocked',
      (roomID: string, user1: string, user2: string) => {
      _room = roomID;
      _user1 = user1;
      _user2 = user2;
      setGameInitFlag(false);
    });
    return () => {
      socket.off('roomLocked');
    }
  }, [_gameInitFlag]);

  useEffect(() => {
    socket.on(
      'gameInit',
      (user1Dto: Dto, user2Dto: Dto, BallDto) => {
        setDto((prevDto) => new Map(prevDto.set(user1Dto.playerId, user1Dto)));
        setDto((prevDto) => new Map(prevDto.set(user2Dto.playerId, user2Dto)));
        setDto((prevDto) => new Map(prevDto.set('Ball', BallDto)));
    });
    return () => {
      socket.off('gameInit');
    }
  }, [_dto]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!flag) return;
      const { key } = e;
      if (key === 'a') {
        socket.emit('keydown', {key: 'up', roomID: _room, user1: _user1, user2: _user2});
        console.log(socket.id, 'up');
      } else if (key === 'z') {
        socket.emit('keydown', {key: 'down', roomID: _room, user1: _user1, user2: _user2});
        console.log(socket.id, 'down');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return() => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    socket.on('gameStarted', () => {
      flag = true;
      console.log('gameStarted', socket.id);
      setGameStartFlag(true);
    });
    return () => {
      socket.off('gameStarted');
    }
  }, [_gameStartFlag]);

  useEffect(() => {
    socket.on('updatePosition', (dto: Dto) => {
      console.log('this console is', socket.id);
      console.log('updatePosition by', dto.playerId, dto.y);
      
      setDto((prevDto) => new Map(prevDto.set(dto.playerId, dto)));
      // setDto((prevDto) => new Map(prevDto.set('Ball', ballDto)));
    },); 
    return () => {
      socket.off('updatePosition');
    }
  }, [_dto]);

  useEffect(() => {
    socket.on('updateBall', (ballDto: Dto) => {
      console.log('ballUpate', ballDto);
      setDto((prevDto) => new Map(prevDto.set('Ball', ballDto)));
    },);
    return () => {
      socket.off('ballUpate');
    }
  }, [_dto]);

  useEffect(() => {
    socket.on(
      'roomFull',
      (retrunMessage: string) => {
      alert(retrunMessage);
    });
    return () => {
      socket.off('roomFull');
    } 
  },[]);

  useEffect(() => {
    socket.on(
      'test',
      (retrunMessage: string) => {
        console.log('handle interval',retrunMessage);
    });
    return () => {
      socket.off('test');
    }
  },[]);

  return (
    <div>
      {
      (_gameInitFlag && !_gameStartFlag) && <div>
        <form onSubmit={handleJoin}>
          <input type="text" name="roomID" placeholder="roomID" />
          <button type="submit">Join</button>
        </form>
        <form onSubmit={handleCreate}>
          <input type="text" name="roomID" placeholder="roomID" />
          <button type="submit">Create</button>
        </form>
      </div> 
      }
      {
        (!_gameStartFlag && !_gameInitFlag) && <div>
          <button onClick={handleGameStart}>Game Start</button>
        </div>
      }
      {
      (!_gameInitFlag && _gameStartFlag) && <div>
        <div style={{
          position: 'absolute',
          backgroundColor: 'black',
          width: _dto.get(_user1)?.width,
          height: _dto.get(_user1)?.height,
          left: _dto.get(_user1)?.x,
          top: _dto.get(_user1)?.y,
        }}>
        </div>
        <div style={{
          position: 'absolute',
          backgroundColor: 'black',
          width: _dto.get(_user2)?.width,
          height: _dto.get(_user2)?.height,
          left: _dto.get(_user2)?.x,
          top: _dto.get(_user2)?.y,
        }}>
        </div>
        <div style={{
          position: 'absolute',
          backgroundColor: 'black',
          width: _dto.get('Ball')?.width,
          height: _dto.get('Ball')?.height,
          left: _dto.get('Ball')?.x,
          top: _dto.get('Ball')?.y,
        }}>
        </div>
      </div>}
    </div>
  );
}