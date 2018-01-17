import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'

import axios from "axios"
import Entries from "./Entries"

const Container = styled.div`
    width:100%;
    background-color:#FFFAD0;
    ${ clearFix() }
`

const Link = styled.a`

    cursor:pointer

`
const FilterOptionContainer = styled.div`

`
const Input = styled.input`
    width:50%;
`

export default class App extends Component{
    constructor(props){
        super(props);

        let defaultState = {
            courses:[],
            ltis:[],
            allEntries:[],
            entries:[],
            user_ids:[],
            temp_search_text:"",
            search_text:""
    
        }

        props.appState ? this.state = props.appState : this.state = defaultState

        this.openEntries = this.openEntries.bind(this)

    }

    shouldComponentUpdate(nextProps, nextState){

        if(this.state.temp_search_text === nextState.temp_search_text){
            return true
        }
        return false
    }
    
    componentWillMount(){

        var self = this
        
        axios.get('./api/api.php', {
            params: {
                action: "getAllEntries",
            }
        })
        .then(function (response) {
            let data = response.data

            console.log("data", data)

            let courses = data.map(item => item.course_id)
            let LTIs = data.map((item) => {
	            return {
		            "lti_id":item.lti_id,
		            "course_id":item.course_id
	            }
            })



            courses = courses.filter((v, i, a) => a.indexOf(v) === i); 
            LTIs = LTIs.filter((v, i, a) => a.indexOf(v) === i); 
            
            console.log("COURSES", courses, LTIs)
            
            self.setState({
                courses:courses,
                ltis:LTIs,
                allEntries:data
            })
            
        })
        .catch(function (error) {
            
        });
    }

    openEntries(lti, course){

        console.log(lti, course)

        
        let entries = this.state.allEntries.filter((entry)=>{
            return ((entry.lti_id === lti) && (entry.course_id === course))
        })

        let user_ids = entries.map(entry => entry.user_id)

        this.setState({
            entries:entries,
            user_ids:user_ids
        })
    }




    render(){
/*

        let LTIListItems = this.state.ltis.map((lti)=>{
            return (<li key={uuid.v4()}><Link onClick={()=>{this.openEntries(lti)}}>{lti.lti_id}</Link></li>)
        })
*/



        let courses = []

        let c = []

        this.state.courses.forEach((course)=>{
            let co = {}
            
            co["course"] = course
            co["ltis"] = []

            this.state.allEntries.forEach((entry)=>{

                if(course === entry.course_id){
                    if(co["ltis"].indexOf(entry.lti_id) === -1){
                        co["ltis"].push(entry.lti_id)                
                    }
                
                }

            })

            courses.push(co);

        })
        
		console.log("REA", courses)
        
        let coursesListItems = courses.map((course)=>{
            return (<li key={uuid.v4()}>
            
                    {course.course}
                    <ul>
                    {course.ltis.map((lti)=>{
                        return (<li key={uuid.v4()}><Link onClick={()=>{this.openEntries(lti, course.course)}}>{lti}</Link></li>)
                    })}
                    </ul>

            </li>)
        })

        let filterOptions = (<FilterOptionContainer>
            Filter By Submission ID: 
            <Input placeholder="e.g. f770caedc6d860f087297810891526d7_3_u1"
            
                onChange={(event)=>{
                    this.setState({
                        search_text:event.target.value
                    })
                }}
            
            ></Input>
            </FilterOptionContainer>)

        this.state.entries.length > 0 ? "":filterOptions = ""

        let entries = this.state.entries

        if((this.state.search_text) && (this.state.search_text.length > 0) && (this.state.user_ids.indexOf(this.state.search_text) !== -1)){
            

            entries = this.state.entries.filter((entry)=>{
                return entry.user_id === this.state.search_text
            })
            
            console.log(entries)

        }

        return(<Container>

            <ul>{coursesListItems}</ul>
            {filterOptions}
            {<Entries entries={entries}/>}
            
        </Container>)
    }
}

App.PropTypes = {

}

App.defaultProps = {

}