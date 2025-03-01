import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AuctionItem() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [bid, setBid] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/auctions/${id}`);
        setItem(res.data);
      } catch (error) {
        setMessage('Error fetching auction item: ' + error.response?.data?.message || error.message);
        console.error(error);
      }
    };

    fetchItem();
  }, [id]);

  const handleBid = async () => {


    if (bid <= item.currentBid) {
      setMessage('Bid must be higher than the current bid.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be signed in to post an auction.');
      navigate('/signin');
      return;
    }
    
      const res = await axios.post(`http://localhost:5001/bid/${id}`, { bid },{ headers: { Authorization: `Bearer ${token}` } });
      setMessage(res.data.message);
      if (res.data.winner) {
        setMessage(`Auction closed. Winner: ${res.data.winner}`);
      }
    } catch (error) {
      setMessage('Error placing bid.');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>{item.itemName}</h2>
      <p>{item.description}</p>
      <p>Current Bid: ${item.currentBid}</p>
      <p>Highest Bidder: {item.highestBidder || 'No bids yet'}</p>
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        placeholder="Enter your bid"
      />
      <button onClick={handleBid}>Place Bid</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AuctionItem;
