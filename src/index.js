import React from "react"
import ReactDOM from "react-dom"

import App from "./Components/App"

import 'bootstrap/dist/css/bootstrap.css'

const appContainer = document.getElementById('app');
let state = {
    input_val:"Welcome to React App with PHP API",
    api_message:"",
}
ReactDOM.render(<App appState={state}/>, appContainer);


