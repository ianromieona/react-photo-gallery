import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

// CSS
import "./index.css";

// Components
import App from "./App";

// Redux
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
reportWebVitals();
