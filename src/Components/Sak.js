import * as React from 'react';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Component } from 'react-simplified';
import {Alert} from '../widgets';
import {nyhetssakService, kommentarService} from '../services';
import {Navigation} from './staticComponents';
import { createHashHistory } from 'history';
import socketIOClient from 'socket.io-client';

const history = createHashHistory();

export class Sak extends Component<{ match: { params: { id: number, kategori: string } } }> {
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
        <div></div>
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
      .catch((error: Error) => console.log(""));
    
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
        Alert.danger("Sak slettet!");
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  upvote() {
    nyhetssakService
      .upvote(this.props.match.params.id)
      .then(Alert.info("Saken er upvotet!"))
      .catch((error: Error) => Alert.danger(error.message));
  }
}
