// @flow
/* eslint eqeqeq: "off" */

import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'

const history = createHashHistory();

class Nyhetssak {
  id: number;
  static nextId = 1;

  overskrift: string;
  innhold: string;
  bilde: string;
  kategori: string;
  viktighet: number;
  tid: number;

  constructor(overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: number, tid: number) {
    this.id = Nyhetssak.nextId++;
    this.overskrift = overskrift;
    this.innhold = innhold
    this.bilde = bilde;
    this.kategori = kategori;
    this.viktighet = viktighet;
    this.tid = tid;
  }
}

let saker = [
  new Nyhetssak('Nyhetssak', 'Hunden er her', 'bilder/sak1.jpg', 'Nyheter', 1, 5),
  new Nyhetssak('Sportssak', 'Flyet har landet', 'bilder/sak2.jpg', 'Sport', 1, 10),
  new Nyhetssak('Kultursak', 'Sofa (20) savnet', 'bilder/sak3.jpg', 'Kultur', 2, 15),
];

let kategorier = ["Nyheter", "Sport", "Kultur"];

class Navigation extends Component {
  render() {
  return <>
    <Navbar bg="dark" expand="lg" variant="dark">
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
      <Nav.Link href={"#/kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    <Button variant="outline-success" href="#/addNews">Legg til nyhetsartikkel</Button>
    </Nav>
  </Navbar.Collapse>
  <Navbar.Collapse className="justify-content-end">
  <Navbar.Text>
      Signed in as: <a href="#">Dilawar Mahmood</a>
    </Navbar.Text>
  </Navbar.Collapse>
</Navbar>
</>
  }
}

class Forside extends Component {
  render() {
    let nysaker = saker.filter(sak => sak.viktighet == 1);
    return <>
      {nysaker.map(sak => (
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.id}>
        <Card className="bg-dark text-white" style={{ width: '25rem' }}>
        <Card.Img src={sak.bilde} alt="Card image"/>
         <Card.ImgOverlay>
           <Card.Title>{sak.overskrift}</Card.Title>
          <Card.Text>
          {sak.innhold}
    </Card.Text>
    <Card.Text>Updated {sak.tid} minutes ago.</Card.Text>
  </Card.ImgOverlay>
</Card>
</a>
      ))}
    </>
  }
}

class Sakliste extends Component<{ match: { params: { kategori: string } } }> {
  render() {
    let nysaker = saker.filter(sak => sak.viktighet == 2 && sak.kategori==this.props.match.params.kategori);
    return <>
      {nysaker.map(sak => (
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.id}>
        <Card className="bg-dark text-white" style={{ width: '18rem' }}>
        <Card.Img src={sak.bilde} alt="Card image"/>
         <Card.ImgOverlay>
           <Card.Title>{sak.overskrift}</Card.Title>
    <Card.Text>Updated {sak.tid} minutes ago.</Card.Text>
  </Card.ImgOverlay>
</Card>
</a>
      ))}
    </>
  }
}

class Sak extends Component<{ match: { params: { id: number, kategori: string } } }> {
  render() {
    let sak = saker.find(sak => sak.id == this.props.match.params.id);
    return <>
    <Button variant="danger" onClick={this.delete}>Slett nyhetsartikkel</Button>
    <Card className="bg-dark text-white" style={{ width: '36rem' }}>
        <Card.Img src={sak.bilde} alt="Card image"/>
           <Card.Title>{sak.overskrift}</Card.Title>
           <Card.Text>{sak.innhold}</Card.Text>
    <Card.Text>Updated {sak.tid} minutes ago.</Card.Text>
</Card>
    </>
  }

  delete() {
    saker = saker.filter(e => e.id != this.props.match.params.id);
    history.push('/');
  }
}

class AddSak extends Component {
  overskrift = '';
  innhold = '';
  bilde = '';
  kategori = '';
  viktighet = 0;
  tid = 0;

  render() {
    return <>
    <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Overskrift</Form.Label>
    <Form.Control 
    type="text" 
    value={this.overskrift}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.overskrift = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlTextarea1">
    <Form.Label>Innhold</Form.Label>
    <Form.Control as="textarea" rows="3"
    type="text" 
    value={this.innhold}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.innhold = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Bilde</Form.Label>
    <Form.Control
    type="text" 
    value={this.bilde}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.bilde = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlSelect2">
    <Form.Label>Kategori</Form.Label>
    <Form.Control
    type="text" 
    value={this.kategori}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.kategori = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlSelect2">
    <Form.Label>Viktighet</Form.Label>
    <Form.Control
    type="number" 
    value={this.viktighet}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.viktighet = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Tid</Form.Label>
    <Form.Control 
    type="number" 
    value={this.tid}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tid = event.target.value)}
    />
  </Form.Group>
  <Button variant="success" onClick={this.add}>Legg til nyhetsartikkel</Button>
</Form>
    </>
  }

  add() {
    let sak = saker.find(sak => sak.overskrift == this.overskrift);
    if (sak) {
      return <>
        <Alert variant="danger">
          Denne artikkelen eksisterer fra før av!
        </Alert>
      </>
    }
    else {
      let nySak = new Nyhetssak(this.overskrift, this.innhold, this.bilde, this.kategori, this.viktighet, this.tid)
      saker.push(nySak);
      history.push('/');
      console.log(nySak);
    }
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Navigation />
        <Route exact path="/" component={Forside}/>
        <Route exact path="/kategori/:kategori" component={Sakliste}/>
        <Route exact path="/kategori/:kategori/:id" component={Sak}/>
        <Route path="/addNews" component={AddSak}/>
      </div>
    </HashRouter>,
    root
  );