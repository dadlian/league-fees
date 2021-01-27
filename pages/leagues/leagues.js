import React from "react";
import ReactDOM from "react-dom";
import styles from './leagues.scss';
import { settings } from '../../Settings.js';

import Header from '../../components/header/Header.js';
import Grid from '../../components/grid/Grid.js';
import Listing from '../../components/listing/Listing.js';
import Button from '../../components/button/Button.js';
import Modal from '../../components/modal/Modal.js';
import Form from '../../components/form/Form.js';

class LeaguesPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
    showModal: false,
     leagueForm: [
       {label: "League ID", type: "textfield", required: true}
     ],
     leagues: [],
     success:"",
     error:"",
     loading:false
   }

    this.toggleModal = this.toggleModal.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount(){
    this._loadLeagues();
  }

  render(){
    return (
      <div className={styles.leagues}>
        <Header />

        <Grid>
          <h2>Leagues</h2><div className={styles.instruction}>Select your league or add a new one</div>

          {
            this.state.leagues.map((league,index) => (
              <div key={index} className={styles.league}>
                <Listing fields={{"League ID":league.leagueId, "Seasons":league.seasons.length}}
                          actionText='View' action={()=>{this.edit(league)}}
                          name={league.name} thumbnail="assets/nfl-fantasy-logo.png" />
              </div>
            ))
          }

          <div className={styles.button}>
            <Button text="Add League" onClick={this.toggleModal}/>
          </div>
        </Grid>

        <Modal visible={this.state.showModal} close={this.toggleModal}>
          <div className={styles.leagueForn}>
            <Form action="Add League" fields={this.state.leagueForm} onSubmit={this.save}
                    success={this.state.success} error={this.state.error} loading={this.state.loading} loadText="Adding League..."  />
          </div>
        </Modal>
      </div>
    );
  }

  toggleModal(){
    this.setState({showModal: !this.state.showModal})
  }

  _loadLeagues(){
    fetch(`${settings.apiRoot}/leagues`)
      .then(response => response.json())
      .then(leagues => {
        this.setState({
          leagues:leagues.entries
        })
      })
  }

  save(values){
    this.setState({
      success: "",
      error: "",
      loading: true
    })

    let payload = JSON.stringify({
      leagueId: values["League ID"].value
    });

    let savePromise = null;
    savePromise = fetch(`${settings.apiRoot}/leagues`,{
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
      this.toggleModal()
      let leagues = this.state.leagues;
      leagues.push(response);
      this.setState({leagues: leagues});
    }).catch(error => {
      this.setState({
        error: "The league could not be found. Please enter another League ID."
      })
    }).finally(()=>{
      this.setState({loading: false})
    })
  }

  edit(league){
    location.href = `seasons?league=${league.leagueId}`;
  }

  delete(league, index){
    let eTag = ""
    let lastModified = ""

    return fetch(`${settings.apiRoot}${league.self}?timestamp=`+Date.now())
    .then(response => {
      eTag = response.headers.get("ETag");
      lastModified = response.headers.get("Last-Modified")
      return response.json()
    })
    .then(league => {
      fetch(`${settings.apiRoot}${league.self}`,{
        method: 'DELETE',
        headers: {
          'If-Match': eTag,
          'If-Unmodified-Since': lastModified
        }
      }).then(response => {
        if(response.status == 200){
          let leagues = this.state.leagues;
          leagues.splice(index,1);
          this.setState({
            leagues: leagues
          })
        }else{
          this.setState({
            error:`There was a problem deleting the '${capability.title}' capability`
          })
        }
      })
    })
  }
}

ReactDOM.render(
  (
    <LeaguesPage />
  ),
  document.getElementById("root")
)
