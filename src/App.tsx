import React, { useState, useEffect } from "react";
import background from './img/bg.png';
import './main.css';
import card1 from './img/Card 1.png';
import card3 from './img/Card 3.png';
import card5 from './img/Card 5.png';
import card7 from './img/Card 7.png';
import cardBack from './img/front.png';

type CardType = { 
  id: string;
  flipped: boolean;
  backImage: string;
  frontImage: string;
  click: boolean;
  matchingCardId: string;
};

const MatchingCard: React.FC = () => {
  const cards: string[] = [
    card1, 
    card3, 
    card5, 
    card7, 
  
  ]  

  //random card
  const shuffleArray = (arr: any[]): any[] => {
    return arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  };
  
  //สร้างกระดานโดยใช้ .map   
  const createBoard = (): CardType[] =>
    ([...cards, ...cards]).map((card, i) => ({
      id: `card${i}`,
      flipped: true,
      backImage: cardBack,
      frontImage: card,
      click: true,
      matchingCardId: i < cards.length ? `card${i + cards.length}` : `card${i - cards.length}`
    }));
  
  //การเก็บ array บนกระดาน
  const [board, setBoard] = useState<CardType[]>(shuffleArray(createBoard()));
  
  //การ์ดที่ถูกพลิก
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  
  //พลิกการ์ดทั้งหมดกลับไปที่ด้านหลัง
  useEffect(() => {
    const timer = setTimeout(() => {
      setBoard(prevBoard =>
        prevBoard.map(card => ({ ...card, flipped: false }))
      );

    }, 1000);//1 วินาที
    return () => clearTimeout(timer);
  }, []);

  //click และ id
  const handleCardClick = (id: string) => {
    setBoard(prevBoard =>
      prevBoard.map(card =>
        card.id === id && card.click
          ? { ...card, flipped: true, click: false } // ปรับ click เป็น false เมื่อคลิกแล้ว
          : card
      )
    );
  
    // อัพเดตการ์ดที่ถูกเปิด
    setFlippedCards(prev => [...prev, id]);
  
    // เช็คว่าการ์ดตรงกันหรือไม่
    if (flippedCards.length === 1) {
      const firstCard = board.find(card => card.id === flippedCards[0]);
      const secondCard = board.find(card => card.id === id);
  
      if (firstCard && secondCard && firstCard.matchingCardId === secondCard.id) {
        setBoard(prevBoard =>
          prevBoard.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, click: false , flipped:true } // ปรับ click เป็น false เมื่อ match แล้ว
              : card
          )
        );
      } else {
        setTimeout(() => {
          setBoard(prevBoard =>
            prevBoard.map(card =>
              card.id === firstCard?.id || card.id === secondCard?.id
                ? { ...card, flipped: false, click: true } // ปรับ flipped เป็น false และ click เป็น true เมื่อไม่ match
                : card
            )
          );
        }, 1000); // 1 วินาที
      }
      setFlippedCards([]);
    }
  };

  //console log
  useEffect(() => {
    const allCardsMatched = board.every(card => !card.click);
    if (allCardsMatched) {
      console.log('Winner!');
    }
  }, [board]);


  return (
    <div>
      <div
        className="background-img"
        style={{
          backgroundImage: `url(${background})`,
          height: '36rem',
          width: '35rem',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: "flex",
        }}
      >
        <div className="container">
          {board.map(card => (
            <div key={card.id} className="card" onClick={() => handleCardClick(card.id)}>
              <div className={`card-img ${card.flipped ? 'flipped' : ''}`}>
                <img src={card.backImage} className="card-img" alt="Back" />
                <img src={card.frontImage} className="card-img" alt="Front" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => location.reload()} className="restartGame">
          <div className="text">Restart</div>
      </button>
    </div>
  );
};

export default MatchingCard;
