import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactRunner } from '@chub-ai/stages-ts';
import Stage from './Stage';
import App from './App';
import type { InitStateType, ChatStateType, MessageStateType, ConfigType } from './types/chub';
import './index.css';

const params = new URLSearchParams(window.location.search);
// TestRunner é usado em desenvolvimento OU com ?test na URL
const useTestRunner = import.meta.env.DEV || params.has('test');

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  useTestRunner ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <ReactRunner<Stage, InitStateType, ChatStateType, MessageStateType, ConfigType>
      factory={(data) => new Stage(data)}
    />
  ),
);
