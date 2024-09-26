import { useState } from 'react'
import chipInLogo from './assets/chip-in-logo1.png'
import './global.css'

import Layout from './Layout';
import { Outlet } from "react-router-dom";

type AppProps = {
  message: string;
};

export default function App({ message }: AppProps) {
  const [count, setCount] = useState<number>(0);

  return (
    <Layout>
      <Outlet />
      <div>
        <a target="_blank">
          <img src={chipInLogo} className="logo" alt="Vite logo" />
        </a>
        <a>
          <img src={chipInLogo} className="logo react" alt="Chip In logo" />
        </a>
      </div>
      <p>
          <code>src/App.tsx</code>
      </p>
      <div>Message: {message}</div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </Layout>
  );
};