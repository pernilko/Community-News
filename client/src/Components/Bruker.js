// @flow

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
  brukernavn: string = '';
  passord: string = '';
  inn_bruker: Bruker | any = null;

  render() {
    return <>
    <div className="mx-auto w-75">
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
    id ="password"
    type="password" 
    value={this.passord}
    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.passord = event.target.value)}
    />
  </Form.Group>
  <Button variant="primary" onClick={this.logg_in}>Logg inn</Button>
</Form>
</div>
    </>
  }

  logg_in() {
    if (this.brukernavn == "") {
      Alert.danger("Ugyldig brukernavn");
      return;
    }
    if (this.passord == "") {
      Alert.danger("Ugyldig passord");
      return;
    }

    let token: string;
    brukerService
      .login(this.brukernavn, this.passord)
      .then(json => {
        token = json.jwt;
        localStorage.setItem("token", json.jwt);
    	  //console.log(JSON.stringify(json));
        brukerService
          .getOne(this.brukernavn)
          .then(json => {
            let nav: any = Navigation.instance();
            nav.mounted(new Bruker(json.brukerId, json.brukernavn))
          })
          .catch((error: Error) => Alert.danger(error.message));
      })
      .then(() => {
        brukerService
          .postToken(this.brukernavn, token)
          .then(json => localStorage.setItem("token", json.jwt))
          .catch((error: Error) => Alert.danger(error.message));
     })
     .then(history.push("/"))
     .catch((error: Error) => Alert.danger(error.message));
  }
}

export class Registrer extends Component {
  brukernavn = '';
  passord = '';

  render() {
    return <>
    <div className="mx-auto w-75">
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
</div>
    </>
  }

  register() {
    if (this.brukernavn == "") {
      Alert.danger("Ugyldig brukernavn");
      return;
    }
    if (this.passord == "") {
      Alert.danger("Ugyldig passord");
      return;
    }

    brukerService
      .registrer(this.brukernavn, this.passord)
      .then(history.push("/"))
      .then(Alert.success("Brukeren er registrert! Du kan logge inn nå."))
      .catch((error: Error) => console.log("")); 
  }
}