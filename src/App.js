import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
function handleBlockClick(block, setLatestBlock, setTransactions, setTransactionReceipt) {
  try {
    const detailedBlock =  alchemy.core.getBlock(block.number);
    setLatestBlock(detailedBlock);
    setTransactions(detailedBlock.transactions);
    setTransactionReceipt(null); 
  } catch (error) {
    console.error('Error fetching detailed block information:', error);
  }
}
function handleTransactionClick (transaction, setTransactionReceipt) {
  try {
    const transactionReceipt =  alchemy.core.getTransactionReceipt(transaction.hash);
    setTransactionReceipt(transactionReceipt);
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
  }
}


function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [latestBlock, setLatestBlock] = useState();
  const [transactions, setTransactions] = useState();
  const [transactionReceipt, setTransactionReceipt] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const latestBlockData = await alchemy.core.getBlock();
        setLatestBlock(latestBlockData);
        setTransactions(latestBlockData.transactions);
        setTransactionReceipt(null);

        const blockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(blockNumber);

        const transactionsData = await alchemy.core.getBlockWithTransactions();
        setTransactions(transactionsData);

        const receipt = await alchemy.core.getTransactionReceipt();
        setTransactionReceipt(receipt);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [setBlockNumber, setLatestBlock, setTransactions, setTransactionReceipt]);


    return (
      <div className="App">
        <h2>Block Number: {blockNumber}</h2>
        <div className="BlockInfo" onClick={() => handleBlockClick(latestBlock)}>
          <h2>Latest Block:</h2>
          <pre>{JSON.stringify(latestBlock, null, 2)}</pre>
        </div>
        <div className="BlockInfo">
          <h2>Transactions:</h2>
          <ul className="TransactionsList">
            {transactions &&
              transactions.map((transaction, index) => (
                <li
                  key={index}
                  className="TransactionItem"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  Transaction #{index + 1}
                </li>
              ))}
          </ul>
        </div>
        <div className="BlockInfo">
          <h2>Transaction Receipt:</h2>
          <pre>{JSON.stringify(transactionReceipt, null, 2)}</pre>
        </div>
      </div>
  );
}

export default App;
