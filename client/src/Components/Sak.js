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
    <Form.Row>
    <Button variant="danger" onClick={this.delete}>Slett nyhetsartikkel</Button>
    <Nav.Link href={"#/rediger/"+this.props.match.params.kategori+"/"+this.props.match.params.id}>
    <Button variant="success" onClick={this.edit}>Rediger nyhetsartikkel</Button>
    </Nav.Link>
    </Form.Row>
    <Card className="bg-light text-black" className="mx-auto w-75">
        <Card.Img src={this.sak.bilde} width="945" height="400"/>
           <Card.Title><h1>{this.sak.overskrift}</h1></Card.Title>
           <Card.Text>{this.sak.innhold}</Card.Text>
      <Card.Text id="tid">Sist oppdatert: {this.sak.tidspunkt.substring(0, 10) + " " + this.sak.tidspunkt.substring(11, 16)}</Card.Text>
      <Form.Row>
      <Button id="upvote" variant="warning" onClick={this.upvote} style={{width: "100px"}}>Upvote</Button>
      <Button id="downvote" variant="danger" onClick={this.downvote} style={{width: "100px"}}>Downvote</Button>
      </Form.Row>
</Card>
    <Form className="mx-auto w-75">
    <Card.Title><h2>Kommentarer</h2></Card.Title>
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
  <Button id="comment-button" variant="primary" onClick={this.add_b}>Kommenter</Button>
</Form>
  {this.kommentarer.map(kommentar => (
    <Card id="comment" className="bd-callout bd-callout-info mx-auto w-75">
           <Card.Title id="nick">{kommentar.nick}</Card.Title>
           <Card.Text>{kommentar.kommentar}</Card.Text>
           <Button variant="danger" onClick={ () => this.del_comment(kommentar.kommId) } style={{width: "150px"}}>Slett kommentar</Button> 
</Card>
  ))}
    </> 
        }
        else {
          return <>
    <Card className="bg-light text-black" className="mx-auto w-75">
        <Card.Img src={this.sak.bilde} width="945" height="400"/>
           <Card.Title><h1>{this.sak.overskrift}</h1></Card.Title>
           <Card.Text>{this.sak.innhold}</Card.Text>
      <Card.Text id="tid">Sist oppdatert: {this.sak.tidspunkt.substring(0, 10) + " " + this.sak.tidspunkt.substring(11, 16)}</Card.Text>
      <Form.Row>
      <Button id="upvote" variant="warning" onClick={this.upvote} style={{width: "100px"}}>Upvote</Button>
      <Button id="downvote" variant="danger" onClick={this.downvote} style={{width: "100px"}}>Downvote</Button>
      </Form.Row>
</Card>
    <Form className="mx-auto w-75">
    <Card.Title><h2>Kommentarer</h2></Card.Title>
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
  <Button id="comment-button" variant="primary" onClick={this.add_b}>Kommenter</Button>
</Form>

  {this.kommentarer.map(kommentar => (
    <Card id="comment" className="bd-callout bd-callout-info mx-auto w-75">
           <Card.Title id="nick">{kommentar.nick}</Card.Title>
           <Card.Text>{kommentar.kommentar}</Card.Text>
</Card>
  ))}
    </> 
        }
      }
      else {
        return <>
    <Card className="bg-light text-black" className="mx-auto w-75">
        <Card.Img src={this.sak.bilde} width="945" height="400"/>
           <Card.Title><h1>{this.sak.overskrift}</h1></Card.Title>
           <Card.Text>{this.sak.innhold}</Card.Text>
      <Card.Text id="tid">Sist oppdatert: {this.sak.tidspunkt.substring(0, 10) + " " + this.sak.tidspunkt.substring(11, 16)}</Card.Text>
      <Form.Row>
      <Button id="upvote" variant="warning" onClick={this.upvote} style={{width: "100px"}}>Upvote</Button>
      <Button id="downvote" variant="danger" onClick={this.downvote} style={{width: "100px"}}>Downvote</Button>
      </Form.Row>
</Card>
    <Form className="mx-auto w-75">
    <Card.Title><h2>Kommentarer</h2></Card.Title>
  <Form.Row>
  <Col>
      <Form.Control
      placeholder="Nick"
      type="text"
      value = {this.nick}
      onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.nick = event.target.value)} 
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
  <Button id="comment-button" variant="primary" onClick={this.add}>Kommenter</Button>
</Form>

  {this.kommentarer.map(kommentar => (
    <Card id="comment" className="bd-callout bd-callout-info mx-auto w-75">
           <Card.Title id="nick">{kommentar.nick}</Card.Title>
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
    
    this.kommentar = "";
    Sak.instance().mounted();
  }

  add() {
    kommentarService
      .postKommentarer(this.props.match.params.id, this.kommentar, this.nick)
      .then(this.mounted())
      .catch((error: Error) => Alert.danger(error.message));
    
    this.nick = "";
    this.kommentar = "";
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
    
    document.getElementById('upvote').disabled = 'disabled';
  }

  downvote() {
    nyhetssakService
      .downvote(this.props.match.params.id)
      .then(Alert.info("Saken er downvotet!"))
      .catch((error: Error) => Alert.danger(error.message));
    
    document.getElementById('downvote').disabled = 'disabled';
  }

  del_comment(kommId) {
    kommentarService 
      .deleteKommentar(kommId)
      .then(this.mounted())
      .then(Alert.danger("Kommentar slettet"))
      .catch((error: Error) => Alert.danger(error.message));
    
    Sak.instance().mounted();
  }
}
