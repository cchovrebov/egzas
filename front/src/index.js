import { render } from "react-dom";
import App from "./App";
import { Provider } from 'react-redux'
import store from './reducers'

const rootElement = document.getElementById("root");

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);