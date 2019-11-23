// @flow

import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import * as React from 'react';
import { Component } from 'react-simplified';
import {Alert} from '../widgets';
import {Nyhetssak, nyhetssakService, Bruker} from '../services';
import socketIOClient from 'socket.io-client';
import { createHashHistory } from 'history';

const history = createHashHistory();

let kategorier = ["Nyheter", "Sport", "Kultur", "Annet"];

export class LiveFeed extends Component {
  saker: Nyhetssak[] = [];
  endpoint: string = "http://localhost:4001";

  componentDidMount() {
    let socket = socketIOClient(this.endpoint);
    socket.on("Livefeed", saker => this.saker = saker);
  }

  render() {
    if (this.saker) {
      return (
      <div class="wrapper">
        <div class="ticker">
          {this.saker.map(sak => (
            <div>
              <LiveFeedElement overskrift={sak.overskrift} tidspunkt={sak.tidspunkt} id={sak.saksId} kategori={sak.kategori}/>
            </div> 
          ))}
        </div>
      </div>
    )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  /*
  mounted() {
    nyhetssakService
      .livefeed()
      .then(saker => (this.saker = saker))
      .catch((error: Error) => Alert.danger(error.message));
  }*/
}

export class LiveFeedElement extends Component<{overskrift: string, tidspunkt: string, id: number, kategori: string}> {

  render() {
    return (
      <div>
      <a href={"#/kategori"+"/"+this.props.kategori+"/"+this.props.id}><p class="title">{this.props.overskrift} | {this.props.tidspunkt.substring(0, 10) + " " + this.props.tidspunkt.substring(11, 16)}</p></a>
      </div>
    )
  }
}

export class Navigation extends Component {
  inn_bruker: Bruker | any = null;
  soketekst: string = "";

  render() {
    //console.log(this.inn_bruker);
    if (this.inn_bruker) {
      return <>
    <Navbar sticky="top" bg="dark" expand="lg" variant="dark">
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    <Nav.Link href="#/">
      <img
        src="bilder/logo.jpg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Community News"
      />
  </Nav.Link>
    <Nav.Link href="#/">Forside</Nav.Link>
    {kategorier.map(kategori => (
      <Nav.Link href={"/#kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    <Nav.Link href={"/#kategori/MineSaker/" + this.inn_bruker.brukerId}>Mine saker</Nav.Link>
    <Button variant="outline-success" href="#/addNews">Legg til nyhetsartikkel</Button>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Søk" className="mr-sm-2" value={this.soketekst} onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.soketekst = event.target.value)}/>
      <Button variant="outline-success" href={"/#søkeSak/"+this.soketekst}>Søk</Button>
    </Form>
  </Navbar.Collapse>
  <Navbar.Collapse className="justify-content-end">
  <Navbar.Text>
      Signed in as: <a>{this.inn_bruker.brukernavn}</a>
    </Navbar.Text>
  <Button id="button" variant="danger" onClick={this.logout}>Logg ut</Button>
  </Navbar.Collapse>
</Navbar>
</>
    }
    else {
      return <>
    <Navbar sticky="top" bg="dark" expand="lg" variant="dark">
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    <Nav.Link href="#/">
      <img
        src="bilder/logo.jpg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Community News"
      />
  </Nav.Link>
    <Nav.Link href="#/">Forside</Nav.Link>
    {kategorier.map(kategori => (
      <Nav.Link href={"/#kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    </Nav>
  </Navbar.Collapse>
  <Form inline>
      <FormControl type="text" placeholder="Søk" className="mr-sm-2" value={this.soketekst} onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.soketekst = event.target.value)}/>
      <Button variant="outline-success" href={"/#søkeSak/"+this.soketekst}>Søk</Button>
    </Form>
  <Navbar.Collapse className="justify-content-end">
  <Navbar.Text>
      <Button id="button" variant="primary" href="/#login">Logg inn</Button>
      <Button variant="success" href="/#registrer">Registrer</Button>
    </Navbar.Text>
  </Navbar.Collapse>
</Navbar>
</>
    }
  }

  mounted(ny_bruker: Bruker | any) {
    this.inn_bruker = ny_bruker;
  }

  logout() {
    history.push("/");
    this.inn_bruker = null;
    Alert.danger("Nå er du logget ut.")
  }
}