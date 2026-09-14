import { useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import './App.css'

const PIECES = {
  wP: `<ellipse cx="27" cy="44" rx="9" ry="6" fill="#c8d8b0"/><ellipse cx="27" cy="29" rx="8" ry="7" fill="#d4e0bc"/><polygon points="19,25 15,16 22,25" fill="#c8d8b0"/><polygon points="35,25 39,16 32,25" fill="#c8d8b0"/><ellipse cx="22" cy="28" rx="3" ry="3" fill="#f0d840"/><ellipse cx="32" cy="28" rx="3" ry="3" fill="#f0d840"/><circle cx="23" cy="29" r="1.5" fill="#223300"/><circle cx="33" cy="29" r="1.5" fill="#223300"/>`,
  bP: `<ellipse cx="27" cy="44" rx="9" ry="6" fill="#28183a"/><ellipse cx="27" cy="29" rx="8" ry="7" fill="#32204a"/><polygon points="19,25 15,16 22,25" fill="#28183a"/><polygon points="35,25 39,16 32,25" fill="#28183a"/><ellipse cx="22" cy="28" rx="3" ry="3" fill="#ff2200"/><ellipse cx="32" cy="28" rx="3" ry="3" fill="#ff2200"/><circle cx="23" cy="29" r="1.5" fill="#ff7755"/><circle cx="33" cy="29" r="1.5" fill="#ff7755"/>`,
  wR: `<rect x="8" y="22" width="38" height="28" rx="4" fill="#c0d8ec"/><polygon points="14,22 19,3 26,22" fill="#d8eef8"/><polygon points="24,22 30,1 37,22" fill="#e0f4ff"/><ellipse cx="18" cy="34" rx="6" ry="6" fill="#f0faff"/><ellipse cx="36" cy="34" rx="6" ry="6" fill="#f0faff"/><ellipse cx="18" cy="34" rx="3" ry="3" fill="#2288cc"/><ellipse cx="36" cy="34" rx="3" ry="3" fill="#2288cc"/>`,
  bR: `<rect x="8" y="22" width="38" height="28" rx="4" fill="#0a1e30"/><polygon points="14,22 19,3 26,22" fill="#0e2a40"/><polygon points="24,22 30,1 37,22" fill="#102840"/><ellipse cx="18" cy="34" rx="6" ry="6" fill="#003050"/><ellipse cx="36" cy="34" rx="6" ry="6" fill="#003050"/><ellipse cx="18" cy="34" rx="3" ry="3" fill="#00ccff"/><ellipse cx="36" cy="34" rx="3" ry="3" fill="#00ccff"/>`,
  wN: `<rect x="7" y="42" width="5" height="11" rx="2" fill="#c8c0b0"/><rect x="15" y="44" width="5" height="9" rx="2" fill="#c8c0b0"/><rect x="28" y="42" width="5" height="11" rx="2" fill="#c8c0b0"/><rect x="37" y="40" width="5" height="11" rx="2" fill="#c8c0b0"/><ellipse cx="25" cy="40" rx="19" ry="7" fill="#d8d0c0"/><rect x="37" y="28" width="8" height="14" rx="3" fill="#cec6b6"/><ellipse cx="44" cy="26" rx="6" ry="4" fill="#cec6b6"/><rect x="17" y="27" width="12" height="14" rx="3" fill="#8899cc"/><ellipse cx="23" cy="18" rx="7" ry="7" fill="#f0d0a0"/><polygon points="16,14 11,8 17,17" fill="#f0d0a0"/><polygon points="30,14 35,8 29,17" fill="#f0d0a0"/><circle cx="20" cy="18" r="2" fill="#44bb88"/><circle cx="27" cy="18" r="2" fill="#44bb88"/><line x1="29" y1="27" x2="47" y2="5" stroke="#aabbff" stroke-width="2.5" stroke-linecap="round"/>`,
  bN: `<rect x="7" y="42" width="5" height="11" rx="2" fill="#12101e"/><rect x="15" y="44" width="5" height="9" rx="2" fill="#12101e"/><rect x="28" y="42" width="5" height="11" rx="2" fill="#12101e"/><rect x="37" y="40" width="5" height="11" rx="2" fill="#12101e"/><ellipse cx="25" cy="40" rx="19" ry="7" fill="#1c1830"/><rect x="37" y="28" width="8" height="14" rx="3" fill="#181425"/><ellipse cx="44" cy="26" rx="6" ry="4" fill="#181425"/><rect x="17" y="27" width="12" height="14" rx="3" fill="#14122a"/><ellipse cx="23" cy="18" rx="7" ry="7" fill="#1e1835"/><polygon points="16,14 11,8 17,17" fill="#1e1835"/><polygon points="30,14 35,8 29,17" fill="#1e1835"/><circle cx="20" cy="18" r="2" fill="#bb44ff"/><circle cx="27" cy="18" r="2" fill="#bb44ff"/><line x1="29" y1="27" x2="47" y2="5" stroke="#5533aa" stroke-width="2.5" stroke-linecap="round"/>`,
  wB: `<polygon points="27,17 6,54 48,54" fill="#e8e0d0"/><polygon points="27,17 9,52 45,52" fill="#f0e8d8"/><ellipse cx="27" cy="10" rx="8" ry="8" fill="#f0d8a0"/><polygon points="27,1 17,17 37,17" fill="#d0c8b8"/><ellipse cx="23" cy="10" rx="2.5" ry="2.5" fill="#ff7700"/><ellipse cx="31" cy="10" rx="2.5" ry="2.5" fill="#ff7700"/><ellipse cx="11" cy="40" rx="4" ry="7" fill="#ff8830" opacity=".9"/><ellipse cx="43" cy="40" rx="4" ry="7" fill="#ff8830" opacity=".9"/>`,
  bB: `<polygon points="27,17 6,54 48,54" fill="#0e0a18"/><polygon points="27,17 9,52 45,52" fill="#160e22"/><ellipse cx="27" cy="10" rx="8" ry="8" fill="#1a1228"/><polygon points="27,1 17,17 37,17" fill="#0a0812"/><ellipse cx="23" cy="10" rx="2.5" ry="2.5" fill="#aa22ff"/><ellipse cx="31" cy="10" rx="2.5" ry="2.5" fill="#aa22ff"/><ellipse cx="11" cy="40" rx="4" ry="7" fill="#5500aa" opacity=".9"/><ellipse cx="43" cy="40" rx="4" ry="7" fill="#5500aa" opacity=".9"/>`,
  wQ: `<polygon points="27,20 5,54 49,54" fill="#c8c0d8"/><polygon points="27,20 8,52 46,52" fill="#d8d0e8"/><ellipse cx="27" cy="13" rx="9" ry="9" fill="#e0d0e8"/><rect x="18" y="5" width="18" height="7" rx="2" fill="#9988cc"/><polygon points="18,5 21,0 24,5" fill="#b8a8e0"/><polygon points="24,5 27,0 30,5" fill="#ccc0f0"/><polygon points="30,5 33,0 36,5" fill="#b8a8e0"/><ellipse cx="22" cy="13" rx="3" ry="3" fill="#6644aa"/><ellipse cx="32" cy="13" rx="3" ry="3" fill="#6644aa"/><ellipse cx="22" cy="13" rx="1.5" ry="1.5" fill="#ddbbff"/><ellipse cx="32" cy="13" rx="1.5" ry="1.5" fill="#ddbbff"/>`,
  bQ: `<polygon points="27,20 5,54 49,54" fill="#08030f"/><polygon points="27,20 8,52 46,52" fill="#100618"/><ellipse cx="27" cy="13" rx="9" ry="9" fill="#180c28"/><rect x="18" y="5" width="18" height="7" rx="2" fill="#3d0060"/><polygon points="18,5 21,0 24,5" fill="#5a0088"/><polygon points="24,5 27,0 30,5" fill="#6a00aa"/><polygon points="30,5 33,0 36,5" fill="#5a0088"/><ellipse cx="22" cy="13" rx="3" ry="3" fill="#1a0030"/><ellipse cx="32" cy="13" rx="3" ry="3" fill="#1a0030"/><ellipse cx="22" cy="13" rx="1.5" ry="1.5" fill="#ff44ff"/><ellipse cx="32" cy="13" rx="1.5" ry="1.5" fill="#ff44ff"/>`,
  wK: `<rect x="7" y="30" width="40" height="22" rx="5" fill="#b0b0a0"/><rect x="9" y="30" width="36" height="20" rx="4" fill="#c8c8b4"/><rect x="11" y="10" width="32" height="22" rx="7" fill="#aaa898"/><rect x="13" y="12" width="28" height="18" rx="6" fill="#c0c0ac"/><rect x="16" y="21" width="22" height="5" rx="2" fill="#2a2a2a"/><rect x="11" y="4" width="32" height="7" rx="2" fill="#d4a820"/><polygon points="11,4 14,0 18,4" fill="#e8c030"/><polygon points="19,4 23,0 27,4" fill="#f0cc38"/><polygon points="27,4 31,0 35,4" fill="#f0cc38"/><polygon points="36,4 39,0 43,4" fill="#e8c030"/>`,
  bK: `<rect x="7" y="30" width="40" height="22" rx="5" fill="#0c1018"/><rect x="9" y="30" width="36" height="20" rx="4" fill="#141820"/><rect x="11" y="10" width="32" height="22" rx="7" fill="#0e1420"/><rect x="13" y="12" width="28" height="18" rx="6" fill="#161e2c"/><rect x="16" y="21" width="22" height="5" rx="2" fill="#000"/><rect x="16" y="21" width="22" height="2" rx="1" fill="#2244aa" opacity=".8"/><rect x="11" y="4" width="32" height="7" rx="2" fill="#6a4e10"/><polygon points="11,4 14,0 18,4" fill="#7a5e18"/><polygon points="19,4 23,0 27,4" fill="#886820"/><polygon points="27,4 31,0 35,4" fill="#886820"/><polygon points="36,4 39,0 43,4" fill="#7a5e18"/>`,
}

const PIECE_NAMES = {
  wP:'Гоблин', bP:'Гоблин', wR:'Ледено Същество', bR:'Ледено Същество',
  wN:'Елф на Кон', bN:'Елф на Кон', wB:'Огнен Магьосник', bB:'Огнен Магьосник',
  wQ:'Тъмна Магьосница', bQ:'Тъмна Магьосница', wK:'Рицарят Цар', bK:'Рицарят Цар',
}

function getPieceKey(piece) {
  if (!piece) return null
  return (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase()
}

function Piece({ pieceKey }) {
  if (!pieceKey) return null
  const isPawn = pieceKey.endsWith('P')
  const size = isPawn ? 36 : 48
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 54 54"
      style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.75))', display: 'block' }}
      dangerouslySetInnerHTML={{ __html: PIECES[pieceKey] }}
    />
  )
}

function Square({ piece, isLight, isSelected, isValidMove, onClick }) {
  const bg = isLight ? '#f0e8d0' : '#568a3f'
  return (
    <div
      onClick={onClick}
      style={{
        width: 64, height: 64,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: isSelected ? 'inset 0 0 0 3px #f0c820' : isValidMove ? 'inset 0 0 0 3px #ffffff88' : 'none',
        position: 'relative',
      }}
    >
      {isValidMove && !piece && (
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ffffff44' }} />
      )}
      <Piece pieceKey={piece} />
    </div>
  )
}

export default function App() {
  const [game, setGame] = useState(new Chess())
  const [selected, setSelected] = useState(null)
  const [validMoves, setValidMoves] = useState([])
  const [status, setStatus] = useState('Ход на белите')

  const board = game.board()

  const handleSquareClick = useCallback((row, col) => {
    const files = 'abcdefgh'
    const square = files[col] + (8 - row)

    if (selected) {
      const move = validMoves.find(m => m.to === square)
      if (move) {
        const newGame = new Chess(game.fen())
        newGame.move(move)
        setGame(newGame)
        setSelected(null)
        setValidMoves([])
        if (newGame.isCheckmate()) setStatus('Шах и мат!')
        else if (newGame.isDraw()) setStatus('Равенство!')
        else if (newGame.inCheck()) setStatus(newGame.turn() === 'w' ? 'Шах на белите!' : 'Шах на черните!')
        else setStatus(newGame.turn() === 'w' ? 'Ход на белите' : 'Ход на черните')
        return
      }
    }

    const piece = game.get(square)
    if (piece && piece.color === game.turn()) {
      setSelected(square)
      setValidMoves(game.moves({ square, verbose: true }))
    } else {
      setSelected(null)
      setValidMoves([])
    }
  }, [game, selected, validMoves])

  const resetGame = () => {
    setGame(new Chess())
    setSelected(null)
    setValidMoves([])
    setStatus('Ход на белите')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1228', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#f0cc38', marginBottom: 8, fontSize: 28 }}>⚔ FireVortex Chess</h1>
      <p style={{ color: '#c8b8e8', marginBottom: 16, fontSize: 14 }}>{status}</p>
      <div style={{ border: '10px solid #7a5520', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.6), inset 0 0 0 2px #c4962a' }}>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex' }}>
            {row.map((sq, colIdx) => {
              const files = 'abcdefgh'
              const square = files[colIdx] + (8 - rowIdx)
              const isLight = (rowIdx + colIdx) % 2 === 0
              const pieceKey = sq ? getPieceKey(sq) : null
              return (
                <Square
                  key={colIdx}
                  piece={pieceKey}
                  isLight={isLight}
                  isSelected={selected === square}
                  isValidMove={validMoves.some(m => m.to === square)}
                  onClick={() => handleSquareClick(rowIdx, colIdx)}
                />
              )
            })}
          </div>
        ))}
      </div>
      <button onClick={resetGame} style={{ marginTop: 20, padding: '10px 28px', background: '#6a00aa', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
        Нова игра
      </button>
    </div>
  )
}