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
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import {Nyhetssak, nyhetssakService, Kommentar, kommentarService, Bruker, brukerService} from './services';
import {Alert} from './widgets';
import './index.css';
import axios from 'axios';

const history = createHashHistory();

let kategorier = ["Nyheter", "Sport", "Kultur", "Annet"];

class LiveFeed extends Component {
  saker: Nyhetssak[] = [];

  render() {
    if (this.saker) {
      return (
      <div class="wrapper">
        <div class="ticker">
          {this.saker.map(sak => (
            <div>
              <LiveFeedElement title={sak.overskrift} date={sak.tid}/>
            </div> 
          ))}
        </div>
      </div>
    )
    }
    else {
      return (
      <div>Laster LiveFeed...</div>
      )
    }
  }

  mounted() {
    nyhetssakService
      .livefeed()
      .then(saker => (this.saker = saker))
      .catch((error: Error) => Alert.danger(error.message));
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
  inn_bruker = null;


  render() {
    console.log(this.inn_bruker);
    if (this.inn_bruker) {
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
      <Nav.Link href={"/#kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    <Nav.Link href={"/#kategori/MineSaker/" + this.inn_bruker.brukerId}>Mine saker</Nav.Link>
    <Button variant="outline-success" href="#/addNews">Legg til nyhetsartikkel</Button>
    </Nav>
  </Navbar.Collapse>
  <Navbar.Collapse className="justify-content-end">
  <Navbar.Text>
      Signed in as: <a href="#">{this.inn_bruker.brukernavn}</a>
    </Navbar.Text>
  <Button variant="danger" onClick={this.logout}>Logg ut</Button>
  </Navbar.Collapse>
</Navbar>
</>
    }
    else {
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
      <Nav.Link href={"/#kategori/"+kategori}>{kategori}</Nav.Link>
    ))}
    </Nav>
  </Navbar.Collapse>
  <Navbar.Collapse className="justify-content-end">
  <Navbar.Text>
      <Button variant="primary" href="/#login">Logg inn</Button>
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
    this.inn_bruker = null;
  }
}

class Forside extends Component {
  saker: Nyhetssak[] = [];
  render() {
    //let nysaker = saker.filter(sak => sak.viktighet == true);
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
        <div>Laster forside...</div>
      )
    }
  }

  
  mounted() {
    nyhetssakService
      .getSaker()
      .then(saker => (this.saker = saker))
      .catch((error: Error) => Alert.danger(error.message));
    let livefeed = LiveFeed.instance();
    livefeed.mounted();
  }
}

class Sakliste extends Component<{ match: { params: { kategori: string } } }> {
  saker: Nyhetssak[] = [];
  render() {
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
        <div> Laster kategori {this.props.match.params.kategori}</div>
      )
    }
  }

  mounted() {
    nyhetssakService
      .getSakKat(this.props.match.params.kategori)
      .then(saker => (this.saker = saker))
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class MineSaker extends Component<{ match: { params: { id: number } } }> {
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

class Sak extends Component<{ match: { params: { id: number, kategori: string } } }> {
  nick = '';
  kommentar = '';
  sak = null;
  kommentarer: Kommentar[] = [];
  inn_bruker = null;
  brukerId = 0;
  render() {
    if (this.sak) {
      if (this.inn_bruker) {
        if (this.inn_bruker.brukerId == this.brukerId) {
          return <>
    <Button variant="danger" onClick={this.delete}>Slett nyhetsartikkel</Button>
    <Nav.Link href={"#/rediger/"+this.props.match.params.kategori+"/"+this.props.match.params.id}>
    <Button variant="success" onClick={this.edit}>Rediger nyhetsartikkel</Button>
    </Nav.Link>
    <Button variant="primary" onClick={this.upvote}>Upvote</Button>
    <Card className="bg-light text-black" style={{ width: '36rem' }}>
        <Card.Img src={this.sak.bilde} alt="Card image"/>
           <Card.Title>{this.sak.overskrift}</Card.Title>
           <Card.Text>{this.sak.innhold}</Card.Text>
    <Card.Text>Updated {this.sak.tidspunkt} minutes ago.</Card.Text>
</Card>

    <Form>
  <Form.Row>
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
<Button variant="primary" onClick={this.add_b}>Kommenter</Button>

  {this.kommentarer.map(kommentar => (
    <Card className="bg-dark text-white" style={{ width: '18rem' }}>
           <Card.Title>{kommentar.nick}</Card.Title>
           <Card.Text>{kommentar.kommentar}</Card.Text>
</Card>
  ))}
    </> 
        }
        else {
          return <>
    <Button variant="primary" onClick={this.upvote}>Upvote</Button>
    <Card className="bg-light text-black" style={{ width: '36rem' }}>
        <Card.Img src={this.sak.bilde} alt="Card image"/>
           <Card.Title>{this.sak.overskrift}</Card.Title>
           <Card.Text>{this.sak.innhold}</Card.Text>
    <Card.Text>Updated {this.sak.tidspunkt} minutes ago.</Card.Text>
</Card>

    <Form>
  <Form.Row>
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
<Button variant="primary" onClick={this.add_b}>Kommenter</Button>

  {this.kommentarer.map(kommentar => (
    <Card className="bg-dark text-white" style={{ width: '18rem' }}>
           <Card.Title>{kommentar.nick}</Card.Title>
           <Card.Text>{kommentar.kommentar}</Card.Text>
</Card>
  ))}
    </> 
        }
      }
      else {
        return <>
    <Button variant="primary" onClick={this.upvote}>Upvote</Button>
    <Card className="bg-light text-black" style={{ width: '36rem' }}>
        <Card.Img src={this.sak.bilde} alt="Card image"/>
           <Card.Title>{this.sak.overskrift}</Card.Title>
           <Card.Text>{this.sak.innhold}</Card.Text>
    <Card.Text>Updated {this.sak.tidspunkt} minutes ago.</Card.Text>
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

  {this.kommentarer.map(kommentar => (
    <Card className="bg-dark text-white" style={{ width: '18rem' }}>
           <Card.Title>{kommentar.nick}</Card.Title>
           <Card.Text>{kommentar.kommentar}</Card.Text>
</Card>
  ))}
    </> 
      }
    }
    else {
      return (
        <div>Laster sak...</div>
      )
    }
  }

  mounted() {
    nyhetssakService
      .getSakKatId(this.props.match.params.kategori, this.props.match.params.id)
      .then(sak => {
        this.sak = sak;
        this.brukerId = this.sak.brukerId;
      })
      .catch((error: Error) => Alert.danger(error.message));
    
    kommentarService
      .getKommentarer(this.props.match.params.kategori, this.props.match.params.id)
      .then(kommentarer => (this.kommentarer = kommentarer))
      .catch((error: Error) => Alert.danger(error.message));
    
    this.inn_bruker = Navigation.instance().inn_bruker;
  }

  add_b() {
    kommentarService
      .postKommentarer(this.props.match.params.id, this.kommentar, this.inn_bruker.brukernavn)
      .then(this.mounted())
      .catch((error: Error) => Alert.danger(error.message));
    
    Sak.instance().mounted();
  }

  add() {
    kommentarService
      .postKommentarer(this.props.match.params.id, this.kommentar, this.nick)
      .then(this.mounted())
      .catch((error: Error) => Alert.danger(error.message));
    
    Sak.instance().mounted();
  }

  delete() {
    nyhetssakService
      .deleteSak(this.props.match.params.id)
      .then(() => {
        history.push("/");
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  upvote() {
    nyhetssakService
      .upvote(this.props.match.params.id)
      .then()
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class EditSak extends Component<{ match: { params: { id: number, kategori: string } } }> {
  sak = null;

  render() {
    if (this.sak) {
      console.log(this.sak);
    return <>
    <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Overskrift</Form.Label>
    <Form.Control 
    type="text" 
    value={this.sak.overskrift}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.overskrift = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlTextarea1">
    <Form.Label>Innhold</Form.Label>
    <Form.Control as="textarea" rows="9"
    type="text" 
    value={this.sak.innhold}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.innhold = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Bilde</Form.Label>
    <Form.Control
    type="text" 
    value={this.sak.bilde}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.bilde = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlSelect2">
    <Form.Label>Kategori</Form.Label>
    <br></br>
    <select
    type="text"
    value={this.sak.kategori}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.kategori = event.target.checked)}>
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
    checked={this.sak.viktighet}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.viktighet = event.target.checked)}
    />
  </Form.Group>
  <Button variant="success" onClick={this.save}>Endre nyhetsartikkel</Button>
</Form>
    </>
    }
    else {
      return (
        <div>Laster redigeringsskjema</div>
      )
    }
  }

  mounted() {
    nyhetssakService
      .getSakKatId(this.props.match.params.kategori, this.props.match.params.id)
      .then(sak => (this.sak = sak))
      .catch((error: Error) => Alert.danger(error.message));
  }

  save() {
    nyhetssakService
      .updateSak(this.props.match.params.id, this.sak.overskrift, this.sak.innhold, this.sak.bilde, this.sak.kategori, this.sak.viktighet)
      .then(() => {
        if (this.sak) {
          history.push("/kategorier/" + this.sak.kategori + "/" + this.sak.saksId);
          Sak.instance.mounted();
        }
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class AddSak extends Component {
  overskrift = '';
  innhold = '';
  bilde = '';
  kategori = kategorier[0];
  viktighet = false;
  sak = null;
  inn_bruker = null;

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
  <Button variant="success" onClick={this.add}>Legg til nyhetsartikkel</Button>
</Form>
    </>
  }

  add() {
    nyhetssakService
      .postSak(this.overskrift, this.innhold, this.bilde, this.kategori, this.viktighet, this.inn_bruker.brukerId)
      .then(() => {
        history.push("/");
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  mounted() {
    this.inn_bruker = Navigation.instance().inn_bruker;
  }
}

class Login extends Component {
  brukernavn = '';
  passord = '';
  inn_bruker = null;

  render() {
    return <>
    <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Brukernavn</Form.Label>
    <Form.Control 
    type="text" 
    value={this.brukernavn}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.brukernavn = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Passord</Form.Label>
    <Form.Control
    type="password" 
    value={this.passord}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.passord = event.target.value)}
    />
  </Form.Group>
  <Button variant="primary" onClick={this.logg_in}>Logg inn</Button>
</Form>
    </>
  }

  logg_in() {
    brukerService
      .login(this.brukernavn, this.passord)
      .then(json => {
    	  localStorage.token = json.jwt;
    	  console.log(JSON.stringify(json));
        brukerService
          .getOne(this.brukernavn)
          .then(json => {
            console.log(json.brukernavn);
            console.log(json.brukerId);
            //ny_bruker = new Bruker(json.br)
            let navigation = Navigation.instance();
            navigation.mounted(new Bruker(json.brukerId, json.brukernavn));
        })
          .catch((error: Error) => Alert.danger(error.message));
     })
     .then(history.push("/"))
     .catch((error: Error) => Alert.danger(error.message));
  } 
}

class Registrer extends Component {
  brukernavn = '';
  passord = '';

  render() {
    return <>
    <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Brukernavn</Form.Label>
    <Form.Control 
    type="text" 
    value={this.brukernavn}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.brukernavn = event.target.value)}
    />
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Passord</Form.Label>
    <Form.Control
    type="password" 
    value={this.passord}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.passord = event.target.value)}
    />
  </Form.Group>
  <Button variant="success" onClick={this.register}>Registrer bruker</Button>
</Form>
    </>
  }

  register() {
    brukerService
      .registrer(this.brukernavn, this.passord)
      .then(history.push("/"))
      .then(Alert.success("Brukeren er registrert!"))
      .catch((error: Error) => Alert.danger(error.message));
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
        <Route path="/login" component={Login}/>
        <Route path="/registrer" component={Registrer}/>
        <Route exact path="/kategori/MineSaker/:id" component={MineSaker}/>
      </div>
    </HashRouter>,
    root
  );