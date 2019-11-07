import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Component } from 'react-simplified';
import {Alert} from '../widgets';
import {Bruker, brukerService} from '../services';
import {Navigation} from './staticComponents';
import { createHashHistory } from 'history';

const history = createHashHistory();

export class Login extends Component {
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
          .then(() => {
            brukerService
              .postToken(localStorage.token)
              .then(console.log("token posted"))
              .catch((error: Error) => Alert.danger(error.message));
          })
          .catch((error: Error) => Alert.danger(error.message));
     })
     .then(history.push("/"))
     .then(Alert.success("Nå er du logget inn!"))
     .catch((error: Error) => Alert.danger(error.message));
  } 
}

export class Registrer extends Component {
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
      .then(Alert.success("Brukeren er registrert! Du kan logge inn nå."))
      .catch((error: Error) => console.log("")); 
  }
}