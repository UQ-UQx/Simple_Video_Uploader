import React from "react"
import ReactDOM from "react-dom"

import App from "./Components/App"

import axios from "axios"

import moment from "moment"
import {tz} from "moment-timezone"

import 'bootstrap/dist/css/bootstrap.css'

const appContainer = document.getElementById('app');


// var self = this;
axios.get('../public/api/api.php', {
    params: {
        action: "isSubmitted",
        data:{
            user_id: $LTI_userID,
            lti_id: $LTI_resourceID,
        }
    }
})
.then(function (response) {
    let serverState = response.data

    let submitted = serverState.submitted
    let src = serverState.src
    let submission_id = serverState.submission_id

    let dueDate = moment({ year :$DUE_YEAR, M :($DUE_MONTH-1), day :$DUE_DAY, hour :$DUE_HOUR, minute :$DUE_MINUTE})
    
/*
    if($LTI_resourceID === "courses.edx.org-d3129cb4d6ac46b1b9781665be83ae5d"){
	    
	    dueDate = moment({ year :2018, M :10, day :27, hour :23, minute :30})
    }
*/

    console.log(dueDate.format("LLLL"))

    let past_deadline = false;
    if(moment().tz("utc").isSameOrAfter(dueDate)){
        
        past_deadline = true;
    }

    

    loadApp({
        submitted:submitted,
        src:src,
        submission_id:submission_id,
        past_deadline:past_deadline,
        dueDate:dueDate
    })
})
.catch(function (error) {    
    loadApp(null)
});

function loadApp(state){
    ReactDOM.render(<App appState={state}/>, appContainer);
}