import React from "react";
import ReactDOM from "react-dom";
import styles from './teams.scss';
import { settings } from '../../Settings.js';

import Header from '../../components/header/Header.js';
import Grid from '../../components/grid/Grid.js';
import Listing from '../../components/listing/Listing.js';
import Button from '../../components/button/Button.js';
import Modal from '../../components/modal/Modal.js';
import Form from '../../components/form/Form.js';

class TeamsPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
    showModal: false,
     payForm: [
       {label: "Cardholder", type: "textfield", required: true},
       {label: "Card Number", type: "textfield", required: true, pattern: "^[0-9]{14,18}$"},
       {label: "CVV", type: "textfield", required: true, pattern: "^[0-9]{3,5}$"},
       {label: "Expiry Month", type: "dropdown", options: ["01","02","03","04","05","06","07","08","09","10","11","12"], required: true, short: true},
       {label: "Expiry Year", type: "dropdown", options: ["2021","2022","2023","2024","2025","2026","2027","2028","2029","2030"], required: true, short: true},
       {label: "Email", type: "textfield", required: true, pattern: "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,}|[0-9]{1,3})(\\]?)$"},
       {label: "Phone", type: "textfield", required: true},
       {label: "Address Line 1", type: "textfield", required: true},
       {label: "City", type: "textfield", required: true},
       {label: "State/Province/Parish", type: "textfield", required: true},
       {label: "Country", type: "textfield", required: true}
     ],
     season: {teams: []},
     league: {},
     team: {},
     success:"",
     error:"",
     loading:false
   }

    this.hideModal = this.hideModal.bind(this);
    this.payForTeam = this.payForTeam.bind(this);
    this.pay = this.pay.bind(this);
  }

  componentDidMount(){
    this._loadLeague();
    this._loadSeason();
  }

  render(){
    return (
      <div className={styles.teams}>
        <Header />

        <Grid>
          <h2>{this.state.league.name} {this.state.season.year} Season</h2>
          <div className={styles.instruction}>Click 'Pay' under your team to pay your dues</div>

          {
            this.state.season.teams.map((team,index) => (
              <div key={index} className={styles.team}>
                <Listing fields={{"Finish":team.position, "Outstanding":`\$${team.due}.00`}}
                          actionText={team.due?'Pay':''} action={()=>{this.payForTeam(team)}}
                          name={team.name} thumbnail="../../assets/nfl-fantasy-logo.png" />
              </div>
            ))
          }
        </Grid>

        <Modal visible={this.state.showModal} close={this.hideModal}>
          <div className={styles.payForm}>
            <Form action="Pay Dues" fields={this.state.payForm} onSubmit={this.pay}
                    success={this.state.success} error={this.state.error} loading={this.state.loading} loadText="Paying Fees..."  />
          </div>
        </Modal>
      </div>
    );
  }

  hideModal(){
    document.body.style.overflow = "scroll";
    this.setState({showModal: false})
  }

  _loadLeague(){
    let urlParams = new URLSearchParams(window.location.search);
    fetch(`${settings.apiRoot}/leagues/${urlParams.get("league")}`)
      .then(response => response.json())
      .then(league => {
        this.setState({
          league:league
        })
      })
  }

  _loadSeason(){
    let urlParams = new URLSearchParams(window.location.search);
    fetch(`${settings.apiRoot}/seasons/${urlParams.get("season")}?timestamp=`+Date.now())
      .then(response => response.json())
      .then(season => {
        season.teams.sort((a, b) => {
          return parseInt(a.position) - parseInt(b.position);
        })
        this.setState({
          season:season
        })
      })
  }

  payForTeam(team){
    window.scrollTo(0,0);
    document.body.style.overflow = "hidden";
    this.setState({
      team: team,
      showModal: true
    })
  }

  pay(values){
    this.setState({
      success: "",
      error: "",
      loading: true
    })

    let payload = JSON.stringify({
      amount:this.state.team.due,
      cardholder:values["Cardholder"].value,
      number:values["Card Number"].value,
      cvv:values["CVV"].value,
      expiryMonth:values["Expiry Month"].value,
      expiryYear:values["Expiry Year"].value.substr(2,2),
      email:values["Email"].value,
      phone:values["Phone"].value,
      address:values["Address Line 1"].value,
      city:values["City"].value,
      district:values["State/Province/Parish"].value,
      country:values["Country"].value
    });

    let savePromise = null;
    let urlParams = new URLSearchParams(window.location.search);
    savePromise = fetch(`${settings.apiRoot}${this.state.team.self}/payments`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:payload
    })

    savePromise.then(response => {
      if(response.status == 201){
        return response.json()
      }else{
        throw new Error(response.statusText)
      }
    }).then(response => {
      this.hideModal();
      let season = this.state.season;
      for(let i=0; i < season.teams.length; i++){
        if(season.teams[i].self == this.state.team.self){
          season.teams[i].due = 0;
          break;
        }
      }

      this.setState({season: season});
    }).catch(error => {
      this.setState({
        error: "The payment could not be processed. Please check your details and try again"
      })
    }).finally(()=>{
      this.setState({loading: false})
    })
  }
}

ReactDOM.render(
  (
    <TeamsPage />
  ),
  document.getElementById("root")
)
