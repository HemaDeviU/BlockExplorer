// AccountsPage.js
import React, { useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const AccountsPage = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleGetBalance = async () => {
    try {
      const accountBalance = await alchemy.core.getBalance(address);
      setBalance(accountBalance);
    } catch (error) {
      console.error('Error fetching account balance:', error);
    }
  };

  return (
    <div>
      <h2>Accounts Page</h2>
      <div>
        <label htmlFor="address">Enter Ethereum Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={handleAddressChange}
          placeholder="0x..."
        />
        <button onClick={handleGetBalance}>Get Balance</button>
      </div>
      {balance !== null && (
        <div>
          <h3>Account Balance:</h3>
          <p>{balance} Wei</p>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
