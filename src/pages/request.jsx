import React, {useState, useEffect} from 'react';
import { Page, Navbar,Button, ListGroup, List, ListItem,ListInput} from 'framework7-react';
import axios from 'axios';

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(utc)
dayjs.extend(isBetween)


const RequestPage = (props) => {

  const {f7router, f7route} = props

  let [request, setRequest] = useState({
    From: "-",
    To: "-",
    Time: dayjs(new Date(2021,8,1)),
    Passengers: [],
    Status: "Request"
  })

  let [people, setPeople] = useState([])
  let [passengerList, setPassengerList] = useState([])
  let [locations, setLocations] = useState([])
  let [saved, setSaved] = useState(false)
  
  useEffect(() => {
    getPeople()
    getLocations()
  }, []);

  useEffect(() => {
    console.log("locations have changed: ", locations)
  },[locations])

  useEffect(() => {
    console.log("request has changed: ", request)
  },[request,setRequest])

  useEffect(() => {
    console.log("people has changed: ", people)
  },[people])

  return (
    <Page>
      <Navbar title="Transportation Request Form" />
      {saved || <List noHairlinesMd form>
        <ListGroup>
          <ListInput
            label="Departure time"
            type="datepicker"
            // value={[request.Time]}
            placeholder="Please choose..."
            onCalendarChange={(e)=>{
              if(e) {
                console.log("time: ",e[0])
                let tempRequest = request
                tempRequest["Time"] = e[0]
                setRequest(tempRequest)
              }
            }}
            calendarParams={{
              // minDate: dayjs().year(2021).month(7).day(31),
              // maxDate: dayjs().year(2021).month(8).day(6),
              yearSelector: true,
              timePicker: true,
              dateFormat:"d M HH::mm",
              // events: [{
              //   from: dayjs().year(2021).month(7).day(31),
              //   to: dayjs().year(2021).month(8).day(6),
              //   color: "#4caf50"
              // }],
            }}
          >
          </ListInput>
          <ListItem title="FROM" groupTitle></ListItem>
          <ListInput
            label="Location"
            type="select"
            // value={request.From}
            placeholder="Please choose..."
            onChange={(e)=>{
              console.log("From changed: ", e.target.value)
              let tempRequest = request
              tempRequest["From"] = e.target.value
              setRequest(tempRequest)
            }}
          >
            <option value="-">-</option>  
            {locations.map((location, id) => {return(
              <option key={id} value={location?.id}>{location?.fields?.Name}</option>  
            )})}
          </ListInput>
          
        </ListGroup>

        <ListGroup>
          <ListItem title="TO" groupTitle></ListItem>
          <ListInput
            label="Location"
            type="select"
            // value={request.To}
            placeholder="Please choose..."
            // errorMessage="Please enter the destination"
            onChange={(e)=>{
              console.log("To changed: ", e.target.value)
              let tempRequest = request
              tempRequest["To"] = e.target.value
              setRequest(tempRequest)
            }}
          >
            <option value="-">-</option>  
            {locations.map((location, id) => {return(
              <option key={id} value={location?.id}>{location?.fields?.Name}  </option>  
            )})}
          </ListInput>
        </ListGroup>
        <ListGroup>
          <ListItem title="PASSENGERS" groupTitle></ListItem>
          <ListItem
            title="People list"
            smartSelect
            smartSelectParams={{
              openIn: 'popup',
              searchbar: true,
              searchbarPlaceholder: 'Search people',
              on: {
                change(ss, value) {
                  // console.log("smart select value: ",value)
                  let tempRequest = request
                  tempRequest["Passengers"] = value
                  setRequest(tempRequest)
                  // console.log("updated request: ", request)
                }
              }
            }}
          >
            <select name="person" multiple>
                {people.map((person,id) => {return (<option key={id} value={person.id}>{person.fields.Name}</option>)})}
            </select>
          </ListItem>
          
        </ListGroup>
        <Button fill onClick={() => submitRequest(request)}>Save transportation request</Button>
      </List>}
      {saved && <h1>The shuttle has been saved. Go back to the transportation page</h1>}
    </Page>
  );

  function getLocations() {
    fetch("https://api.airtable.com/v0/appw2hvpKRTQCbB4O/Directory%3A%20Locations?&view=Drivable",
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer keyYNFILTvHzPsq1B'
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setLocations(data.records);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  
  function submitRequest(request) {
    console.log("submitted: ", request)
    let data = {
      "records": [
        {"fields":
          {
            "From":request.From,
            "To":dayjsrequest.To,
            "Time": dayjs(request.Time).add(-2,"hours"),
            "Passengers": request.Passengers,
            "Status": request.Status
          }
        }
      ],
      "typecast":true
    }
    console.log("post data: ", data)
    
    fetch("https://api.airtable.com/v0/appw2hvpKRTQCbB4O/Booking%3A%20Shuttles",
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer keyYNFILTvHzPsq1B'
        },
        body: JSON.stringify(data)
        
      }
    )
    .then((response) => {
      console.log("shuttle saved: ",response)
      setSaved(true)
    })
    .catch((error) => {
      console.log(error);
    });
  }
    
  function getPeople() {
    fetch("https://api.airtable.com/v0/appw2hvpKRTQCbB4O/tbllZ7xwJ94GXrVsT",
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer keyYNFILTvHzPsq1B'
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setPeople(data.records);
        })
        .catch((error) => {
          console.log(error);
        });
  }


  function getTransportation() {
    fetch("https://api.airtable.com/v0/appw2hvpKRTQCbB4O/tbleaxo1OqwVqJwBk",
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer keyYNFILTvHzPsq1B'
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setTransportation(data.records);
        })
        .catch((error) => {
          console.log(error);
        });
  }
}
export default RequestPage;