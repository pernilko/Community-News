import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import * as React from 'react';
import { Component } from 'react-simplified';
import {Alert} from '../widgets';
import {nyhetssakService} from '../services';
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
              <LiveFeedElement title={sak.overskrift} time={sak.tidspunkt}/>
            </div> 
          ))}
        </div>
      </div>
    )
    }
    else {
      return (
      <div>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      </div>
      )
    }
  }

  /*  
  mounted() {
    nyhetssakService
      .livefeed()
      .then(saker => (this.saker = saker))
      .catch((error: Error) => Alert.danger(error.message));
  }
  */
}

class LiveFeedElement extends Component {
  render() {
    return (
      <div>
      <p class="title">{this.props.title}, {this.props.time.substring(0, 10) + " " + this.props.time.substring(11, 16)}</p>
      </div>
    )
  }
}

export class Navigation extends Component {
  inn_bruker = null;

  render() {
    console.log(this.inn_bruker);
    if (this.inn_bruker) {
      return <>
    <Navbar id="sticky" bg="dark" expand="lg" variant="dark">
  <Navbar.Brand href="#">
      <img
        src="bilder/logo.jpg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Community News"
      />
  </Navbar.Brand>
  <Navbar.Brand href="#/">Communtiy News</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    {kategorier.map(kategori => (
      <Nav.Link href={"/#kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    <Nav.Link href={"/#kategori/MineSaker/" + this.inn_bruker.brukerId}>Mine saker</Nav.Link>
    <Button variant="outline-success" href="#/addNews">Legg til nyhetsartikkel</Button>
    </Nav>
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
  <Navbar.Brand href="#">
      <img
        src="bilder/logo.jpg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Community News"
      />
  </Navbar.Brand>
  <Navbar.Brand href="#/">Communtiy News</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    {kategorier.map(kategori => (
      <Nav.Link href={"/#kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    </Nav>
  </Navbar.Collapse>
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

  mounted(ny_bruker) {
    this.inn_bruker = ny_bruker;
  }

  logout() {
    history.push("/");
    this.inn_bruker = null;
    Alert.danger("Nå er du logget ut.")
  }
}

export class MineSaker extends Component<{ match: { params: { id: number } } }> {
  saker: Nyhetssak[] = [];

  render() {
    console.log(this.saker);
    if (this.saker) {
      return <>
      {this.saker.map(sak => (
        <div className="mx-auto w-75">
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.saksId}>
  <Card>
  <img src={sak.bilde} width="945" height="400"/>
  <Card.Body>
    <Card.Title>{sak.overskrift}</Card.Title>
  </Card.Body>
</Card>
</a>
</div>
      ))}
      </>
    }
    else {
      return (
        <div> Laster dine saker... </div>
      )
    }
  }

  mounted() {
    nyhetssakService
      .getSakBruker(this.props.match.params.id)
      .then(saker => (this.saker = saker))
      .catch((error: Error) => Alert.danger(error.message));
  }
}