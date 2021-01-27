import React from "react";
import ReactDOM from "react-dom";
import styles from './seasons.scss';
import { settings } from '../../Settings.js';

import Header from '../../components/header/Header.js';
import Grid from '../../components/grid/Grid.js';
import Listing from '../../components/listing/Listing.js';
import Button from '../../components/button/Button.js';
import Modal from '../../components/modal/Modal.js';
import Form from '../../components/form/Form.js';

class SeasonsPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
    showModal: false,
     seasonForm: [
       {label: "Year", type: "textfield", required: true}
     ],
     seasons: [],
     league: {},
     success:"",
     error:"",
     loading:false
   }

    this.toggleModal = this.toggleModal.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount(){
    this._loadSeasons();
    this._loadLeague();
  }

  render(){
    return (
      <div className={styles.seasons}>
        <Header />

        <Grid>
          <h2>{this.state.league.name} Seasons</h2><div className={styles.instruction}>Select your season or add a new one</div>

          {
            this.state.seasons.map((season,index) => (
              <div key={index} className={styles.season}>
                <Listing fields={{"Teams":season.teams.length, "Champion":season.teams[0].name}}
                          actionText='View' action={()=>{this.edit(season)}}
                          name={`${season.year} Season`} thumbnail="assets/nfl-fantasy-logo.png" />
              </div>
            ))
          }

          <div className={styles.button}>
            <Button text="Add Season" onClick={this.toggleModal}/>
          </div>
        </Grid>

        <Modal visible={this.state.showModal} close={this.toggleModal}>
          <div className={styles.seasonForm}>
            <Form action="Add Season" fields={this.state.seasonForm} onSubmit={this.save}
                    success={this.state.success} error={this.state.error} loading={this.state.loading} loadText="Adding Season..."  />
          </div>
        </Modal>
      </div>
    );
  }

  toggleModal(){
    this.setState({showModal: !this.state.showModal})
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

  _loadSeasons(){
    let urlParams = new URLSearchParams(window.location.search);
    fetch(`${settings.apiRoot}/leagues/${urlParams.get("league")}/seasons`)
      .then(response => response.json())
      .then(seasons => {
        this.setState({
          seasons:seasons.entries
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
      year: values["Year"].value
    });

    let savePromise = null;
    let urlParams = new URLSearchParams(window.location.search);
    savePromise = fetch(`${settings.apiRoot}/leagues/${urlParams.get("league")}/seasons`,{
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
      let seasons = this.state.seasons;
      seasons.push(response);
      this.setState({seasons: seasons});
    }).catch(error => {
      this.setState({
        error: "The season could not be found. Please enter another Year."
      })
    }).finally(()=>{
      this.setState({loading: false})
    })
  }

  edit(season){
    location.href = `teams?league=${this.state.league.leagueId}&season=${season.self.match(/([0-9]+)$/)[0]}`;
  }

  delete(season, index){
    let eTag = ""
    let lastModified = ""

    return fetch(`${settings.apiRoot}${season.self}?timestamp=`+Date.now())
    .then(response => {
      eTag = response.headers.get("ETag");
      lastModified = response.headers.get("Last-Modified")
      return response.json()
    })
    .then(season => {
      fetch(`${settings.apiRoot}${season.self}`,{
        method: 'DELETE',
        headers: {
          'If-Match': eTag,
          'If-Unmodified-Since': lastModified
        }
      }).then(response => {
        if(response.status == 200){
          let seasons = this.state.seasons;
          seasons.splice(index,1);
          this.setState({
            seasons: seasons
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
    <SeasonsPage />
  ),
  document.getElementById("root")
)
