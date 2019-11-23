// @flow
import axios from 'axios';

export class Nyhetssak {
  saksId: number;
  overskrift: string;
  innhold: string;
  tidspunkt: string;
  bilde: string;
  kategori: string;
  viktighet: boolean;
  rating: number;
  brukerId: number;

  constructor(saksId: number, overskrift: string, innhold: string, tidspunkt: string, bilde: string, kategori: string, viktighet: boolean, rating: number, brukerId: number) {
      this.saksId = saksId;
      this.overskrift = overskrift;
      this.innhold = innhold;
      this.tidspunkt = tidspunkt;
      this.bilde = bilde;
      this.kategori = kategori;
      this.viktighet = viktighet;
      this.rating = rating;
      this.brukerId = brukerId;
  }
}

class NyhetssakService {
    getSaker() {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker').then(response => response.data);
    }

    getSakKat(kategori: string) {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker/' + kategori).then(response => response.data);
    }

    getSakKatId(kategori: string, id: number) {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker/' + kategori + "/" + id).then(response => response.data[0]);
    }

    postSak(overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: boolean, brukerId: number) {
        return axios.post<{}, Nyhetssak>('http://localhost:8080/nyhetssaker', {
            "overskrift": overskrift,
            "innhold": innhold,
            "bilde": bilde,
            "kategori": kategori,
            "viktighet": viktighet,
            "brukerId": brukerId
        }).then(response => response.data);
    }

    deleteSak(id: number) {
        return axios.delete<Nyhetssak, void>('http://localhost:8080/nyhetssaker/' + id).then(response => response.data);
    }

    upvote(id: number) {
        return axios.put<Nyhetssak, void>('http://localhost:8080/nyhetssaker/' + id + "/upvote").then(response => response.data);
    }

    downvote(id: number) {
        return axios.put<Nyhetssak, void>('http://localhost:8080/nyhetssaker/' + id + "/downvote").then(response => response.data);
    }

    livefeed() {
        return axios.get<Nyhetssak[]>('http://localhost:8080/livefeed').then(response => response.data);
    }

    updateSak(id: number, overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: boolean) {
        return axios.put<{}, Nyhetssak>('http://localhost:8080/nyhetssaker/rediger/' + id, {
            "overskrift": overskrift,
            "innhold": innhold,
            "bilde": bilde,
            "kategori": kategori,
            "viktighet": viktighet,

        }).then(response => response.data);
    }

    getSakBruker(id: number) {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker/kategorier/MineSaker/' + id).then(response => response.data);
    }

    getForfatter(id: number) {
        return axios.get<{brukernavn: string}>('http://localhost:8080/nyhetssaker/kategori/brukernavn/' + id).then(response => response.data);
    }

    getSokSak(soketekst: string) {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker/kategori/sokeSak/' + soketekst).then(response => response.data);   
    }
}

export let nyhetssakService = new NyhetssakService();

export class Kommentar {
  kommId: number;
  nick: string;
  kommentar: string;
  saksId: number;
  tidspunkt: string;
}

class KommentarService {
    getKommentarer(kategori: string, id: number) {
        return axios.get<Kommentar[]>('http://localhost:8080/nyhetssaker/' + kategori + "/" + id + "/kommentarer").then(response => response.data);
    }

    postKommentarer(id: number, kommentar: string, nick: string) {
        return axios.post<{}, Kommentar>('http://localhost:8080/nyhetssaker/' + id, {
            "kommentar": kommentar,
            "nick": nick
        }).then(response => response.data);
    }

    deleteKommentar(id: number) {
        return axios.delete<Kommentar, void>('http://localhost:8080/nyhetssaker/kommentarer/' + id).then(response => response.data);
    }
}

export let kommentarService = new KommentarService();

export class Bruker {
    brukerId: number;
    brukernavn: string;

    constructor(brukerId: number, brukernavn: string) {
        this.brukerId = brukerId;
        this.brukernavn = brukernavn;
    }
}

class BrukerService {
    getOne(brukernavn: string) {
        return axios.get<Bruker[]>('http://localhost:8080/brukere/' + brukernavn).then(response => response.data[0]);
    }

    login(brukernavn: string, passord: string) {
        return axios.post<{}, {jwt: string}>('http://localhost:8080/login', {
            "brukernavn": brukernavn,
            "passord": passord
        }).then(response => response.data);
    }

    registrer(brukernavn: string, passord: string) {
        return axios.post<{}, Bruker>('http://localhost:8080/registrer', {
            "brukernavn": brukernavn,
            "passord": passord
        }).then(response => response.data)
    }

    postToken(brukernavn: string, token: string) {
        return fetch("http://localhost:8080/token",
  	    {
        method: "POST",
        headers: {
    	    "Content-Type": "application/json; charset=utf-8",
    	    "x-access-token": token
	    },
        body: JSON.stringify({"brukernavn": brukernavn})
        })
        .then(response => response.json())
    }
}

export let brukerService = new BrukerService();
