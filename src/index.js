// @flow
/* eslint eqeqeq: "off" */

import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';

import './Livefeed.css';

import axios from 'axios';

const history = createHashHistory();

class Nyhetssak {

  id: number;
  overskrift: string;
  innhold: string;
  bilde: string;
  kategori: string;
  viktighet: Boolean;
  tid: number;
  kommentarer: Kommentar[];

  constructor(id: number, overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: Boolean, tid: number) {
    this.id = id;
    this.overskrift = overskrift;
    this.innhold = innhold
    this.bilde = bilde;
    this.kategori = kategori;
    this.viktighet = viktighet;
    this.tid = tid;
    this.kommentarer = [];
  }
}

class Kommentar {

  nick: string;
  kommentar: string;

  constructor(id: number, nick: string, kommentar: string) {
    this.id = id;
    this.nick = nick;
    this.kommentar = kommentar;
  }
}

let saker = [
  new Nyhetssak(1, 'Nyhetssak', 'Hunden er her', 'bilder/sak1.jpg', 'Nyheter', true, 5),
  new Nyhetssak(2, 'Sportssak', 'Flyet har landet', 'bilder/sak2.jpg', 'Sport', false, 10),
  new Nyhetssak(3, 'Kultursak', 'Sofa (20) savnet', 'bilder/sak3.jpg', 'Sport', false, 15),
];

axios.get('http://localhost:8080/nyhetssaker').then(response => {
  response.data.map(r => saker.push(new Nyhetssak(r["saksId"], r["overskrift"], r["innhold"], r["bilde"], r["kategori"], Boolean(r["viktighet"]), 10)));
});

let kommentarer = [
  new Kommentar(1, "Dilawar", "'Du er kul"),
  new Kommentar(2, "Bøg", "Jeg er kul"),
  new Kommentar(3, "Nikk", "hei"),
  new Kommentar(4, "Jens", "yee"),
];

saker.forEach((e, index) => {
  var rand = Math.floor(Math.random() * kommentarer.length);
  var rand2 = Math.floor(Math.random() * kommentarer.length);
  if(rand == rand2) {
    if(rand >= 1) {
      rand2 -= 1
    } else {rand2 += 1}
  }
  e.kommentarer.push(kommentarer[rand]);
  e.kommentarer.push(kommentarer[rand2]);
})

let kategorier = ["Nyheter", "Sport", "Kultur", "Annet"];

class LiveFeed extends Component {
  render() {
    return (
      <div class="wrapper">
        <div class="ticker">
          {saker.map(sak => (
            <div>
              <LiveFeedElement title={sak.overskrift} date={sak.tid}/>
            </div> 
          ))}
        </div>
      </div>
    )
  }
}

class LiveFeedElement extends Component {
  render() {
    return (
      <div>
        <h1 class="title">{this.props.title}</h1>
        <h1 class="date">Updated {this.props.date} minutes ago</h1>
      </div>
    )
  }
}

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
    let nysaker = saker.filter(sak => sak.viktighet == true);
    return <>
   <CardGroup> 
      {nysaker.map(sak => (
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.id}>
  <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src={sak.bilde} />
  <Card.Body>
    <Card.Title>{sak.overskrift}</Card.Title>
    <Card.Text>
      {sak.innhold}
    </Card.Text>
  </Card.Body>
</Card>
</a>
      ))}
      </CardGroup>
    </>
  }
}

class Sakliste extends Component<{ match: { params: { kategori: string } } }> {
  render() {
    let nysaker = saker.filter(sak => sak.viktighet == false && sak.kategori==this.props.match.params.kategori);
    return <>
   <CardGroup> 
      {nysaker.map(sak => (
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.id}>
  <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src={sak.bilde} />
  <Card.Body>
    <Card.Title>{sak.overskrift}</Card.Title>
    <Card.Text>
      {sak.innhold}
    </Card.Text>
  </Card.Body>
</Card>
</a>
      ))}
      </CardGroup>
    </>
  }
}

class Sak extends Component<{ match: { params: { id: number, kategori: string } } }> {
  nick = '';
  kommentar = '';
  render() {
  let sak = saker.find(sak => sak.id == this.props.match.params.id);
  let sakKommentar = sak.kommentarer;
    console.log(sakKommentar);
    return <>
    <Button variant="danger" onClick={this.delete}>Slett nyhetsartikkel</Button>
    <Nav.Link href={"#/rediger/"+sak.kategori+"/"+sak.id}>
    <Button variant="success" onClick={this.edit}>Rediger nyhetsartikkel</Button>
    </Nav.Link>
    <Card className="bg-light text-black" style={{ width: '36rem' }}>
        <Card.Img src={sak.bilde} alt="Card image"/>
           <Card.Title>{sak.overskrift}</Card.Title>
           <Card.Text>{sak.innhold}</Card.Text>
    <Card.Text>Updated {sak.tid} minutes ago.</Card.Text>
</Card>

    <Form>
  <Form.Row>
    <Col>
      <Form.Control 
      placeholder="Nick" 
      type="text"
      value={this.nick}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.nick = event.target.value)}
      />
    </Col>
    <Col>
      <Form.Control
      placeholder="Kommentar"
      type="text"
      value = {this.kommentar}
      onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.kommentar = event.target.value)} 
      />
    </Col>
  </Form.Row>
</Form>
<Button variant="primary" onClick={this.add}>Kommenter</Button>

  {sakKommentar.map(kommentar => (
    <Card className="bg-dark text-white" style={{ width: '18rem' }}>
           <Card.Title>{kommentar.nick}</Card.Title>
           <Card.Text>{kommentar.kommentar}</Card.Text>
</Card>
  ))}
    </>
  }

  add() {
    let sak = saker.find(sak => sak.id == this.props.match.params.id);
    sak.kommentarer.push(new Kommentar(this.nick, this.kommentar));
    history.push("#/");
    history.push("#/kategori/"+sak.kategori+"/"+sak.id);
  }

  delete() {
    let sak = saker.find(e => e.id != this.props.match.params.id);
    axios.delete('http://localhost:8080/nyhetssaker/'+this.props.match.params.id).then(history.push('/'));
  }
}

class EditSak extends Component<{ match: { params: { id: number, kategori: string } } }> {
  overskrift = '';
  innhold = '';
  bilde = '';
  kategori = '';
  viktighet = false;
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
    <Form.Control as="textarea" rows="9"
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
    <br></br>
    <select
    type="text"
    value={this.kategori}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.kategori = event.target.value)}>
    {kategorier.map(kategori => (
      <option>{kategori}</option>
    ))}
    </select>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlSelect2">
    <Form.Label>Viktighet</Form.Label>
    <br></br>
    <input
    type="checkbox"
    value={this.viktighet}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.viktighet = event.target.checked)}
    cheked={this.viktighet}
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
  <Button variant="success" onClick={this.save}>Endre nyhetsartikkel</Button>
</Form>
    </>
  }

  mounted() {
    let sak = saker.find(sak => sak.id == this.props.match.params.id);
    if (!sak) {
      Alert.danger('Sak not found: ' + this.props.match.params.id);
      return;
    }

  this.overskrift = sak.overskrift;
  this.innhold = sak.innhold;
  this.bilde = sak.bilde;
  this.kategori = sak.kategori;
  this.viktighet = sak.viktighet;
  this.tid = sak.tid;
  }

  save() {
    let sak = saker.find(sak => sak.id == this.props.match.params.id);
    if (!sak) {
      Alert.danger('Sak not found: ' + this.props.match.params.id);
      return;
    }

  sak.overskrift = this.overskrift;
  sak.innhold = this.innhold;
  sak.bilde = this.bilde;
  sak.kategori = this.kategori;
  sak.viktighet = this.viktighet;
  sak.tid = this.tid;
  
  history.push("#/");
  history.push("#/kategori" + "/" + sak.kategori + "/" + sak.id);
  }
}

class AddSak extends Component {
  overskrift = '';
  innhold = '';
  bilde = '';
  kategori = '';
  viktighet = false;
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
    <Form.Control as="textarea" rows="9"
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
    <br></br>
    <select
    type="text"
    value={this.kategori}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.kategori = event.target.value)}>
    {kategorier.map(kategori => (
      <option>{kategori}</option>
    ))}
    </select>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlSelect2">
    <Form.Label>Viktighet</Form.Label>
    <br></br>
    <input
    type="checkbox"
    value={this.viktighet}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.viktighet = event.target.checked)}
    cheked={this.viktighet}
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
      //let nySak = new Nyhetssak(this.overskrift, this.innhold, this.bilde, this.kategori, this.viktighet, this.tid)
      //saker.push(nySak);
      axios.post('http://localhost:8080/nyhetssaker', {
        overskrift: this.overskrift,
        innhold: this.innhold,
        bilde: this.bilde,
        kategori: this.kategori,
        viktighet: this.viktighet,
        brukerId: 1 
      }).then(response => {
        console.log(response);
      });
      history.push('/');
     // console.log(nySak);
    }
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Navigation />
        <LiveFeed />
        <Route exact path="/" component={Forside}/>
        <Route exact path="/kategori/:kategori" component={Sakliste}/>
        <Route exact path="/kategori/:kategori/:id" component={Sak}/>
        <Route path="/addNews" component={AddSak}/>
        <Route exact path="/rediger/:kategori/:id" component={EditSak}/>
      </div>
    </HashRouter>,
    root
  );