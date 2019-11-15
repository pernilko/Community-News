import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import {Alert} from '../widgets';
import {Nyhetssak, nyhetssakService, Kommentar, kommentarService, Bruker, brukerService} from '../services';
import {Navigation} from './staticComponents';
import socketIOClient from 'socket.io-client';

export class Forside extends Component {
  saker: Nyhetssak[] = [];

  render() {
    //let nysaker = saker.filter(sak => sak.viktighet == true);
    if (this.saker) {
      return <div class="grid-container">
      {this.saker.map(sak => (
        <div className="mx-auto w-75">
          <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.saksId}>
            <Card id="article">
            <Card.Img src={sak.bilde} width="945" height="400"/>
            <Card.Body>
              <Card.Title><h2 id="overskrift">{sak.overskrift}</h2></Card.Title>
              <Card.Text><p id="tid">Sist oppdatert: {sak.tidspunkt.substring(0,10) + " " + sak.tidspunkt.substring(11, 16)}</p></Card.Text>
            </Card.Body>
          </Card>
          </a>
        </div>
      ))}
    </div>
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
  }
}

export class Sakliste extends Component<{ match: { params: { kategori: string } } }> {
  saker: Nyhetssak[] = [];
  render() {
    if (this.saker) {
      return <div class="grid-container">
      {this.saker.map(sak => (
        <div className="mx-auto w-75">
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.saksId}>
  <Card id="article">
  <Card.Img src={sak.bilde} width="945" height="400"/>
  <Card.Body>
    <Card.Title><h2 id="overskrift">{sak.overskrift}</h2></Card.Title>
    <Card.Text><p id="tid">Sist oppdatert: {sak.tidspunkt.substring(0,10) + " " + sak.tidspunkt.substring(11, 16)}</p></Card.Text>
  </Card.Body>
</Card>
</a>
</div>
      ))}
    </div>
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

export class MineSaker extends Component<{ match: { params: { id: number } } }> {
  saker: Nyhetssak[] = [];

  render() {
    console.log(this.saker);
    if (this.saker) {
      return <div class="grid-container">
      {this.saker.map(sak => (
        <div className="mx-auto w-75">
        <a href={"#/kategori"+"/"+sak.kategori+"/"+sak.saksId}>
  <Card id="article">
  <Card.Img src={sak.bilde} width="945" height="400"/>
  <Card.Body>
    <Card.Title><h2 id="overskrift">{sak.overskrift}</h2></Card.Title>
    <Card.Text><p id="tid">Sist oppdatert: {sak.tidspunkt.substring(0,10) + " " + sak.tidspunkt.substring(11, 16)}</p></Card.Text>
  </Card.Body>
</Card>
</a>
</div>
      ))}
      </div>
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