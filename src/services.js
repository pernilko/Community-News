// @flow
import axios from 'axios';

export class Nyhetssak {
  saksId: number;
  overskrift: string;
  innhold: string;
  tidspunkt: string;
  bilde: string;
  kategori: string;
  viktighet: Boolean;
  rating: number;
  brukerId: number;
}

class NyhetssakService {
    getSaker() {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker').then(response => response.data);
    }

    getSakKat(kategori: string) {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker/' + kategori).then(response => response.data);
    }

    getSakKatId(kategori: string, id: number) {
        return axios.get<Nyhetssak>('http://localhost:8080/nyhetssaker/' + kategori + "/" + id).then(response => response.data[0]);
    }

    postSak(overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: Boolean, brukerId: number) {
        return axios.post<Nyhetssak, void>('http://localhost:8080/nyhetssaker', {
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
        return axios.put<Nyhetssak, void>('http://localhost:8080/nyhetssaker/' + id).then(response => response.data);
    }

    livefeed() {
        return axios.get<Nyhetssak[]>('http://localhost:8080/nyhetssaker').then(response => response.data);
    }

    updateSak(id: number, overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: Boolean) {
        return axios.put<Nyhetssak, void>('http://localhost:8080/nyhetssaker/rediger/' + id, {
            "overskrift": overskrift,
            "innhold": innhold,
            "bilde": bilde,
            "kategori": kategori,
            "viktighet": viktighet,

        }).then(response => response.data);
    }
}

export let nyhetssakService = new NyhetssakService();

export class Kommentar {
  id: number;
  nick: string;
  kommentar: string;
  saksId: number;
}

class KommentarService {
    getKommentarer(kategori: string, id: number) {
        return axios.get<Kommentar[]>('http://localhost:8080/nyhetssaker/' + kategori + "/" + id + "/kommentarer").then(response => response.data);
    }

    postKommentarer(id: number, kommentar: string, nick: string) {
        return axios.post<void>('http://localhost:8080/nyhetssaker/' + id, {
            "kommentar": kommentar,
            "nick": nick
        }).then(response => response.data);
    }
}

export let kommentarService = new KommentarService();