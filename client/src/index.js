// @flow

import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom';
import * as React from 'react';
import { HashRouter, Route} from 'react-router-dom';
import {LiveFeed, Navigation} from './Components/staticComponents';
import {Forside, Sakliste, MineSaker, SokeSaker} from './Components/Views';
import {EditSak, AddSak} from './Components/Forms';
import {Login, Registrer} from './Components/Bruker';
import {Sak} from './Components/Sak';
import {Alert} from './widgets';
import './index.css';
import axios from 'axios';

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Navigation />
        <Alert/>
        <LiveFeed />
        <Route exact path="/" component={Forside}/>
        <Route exact path="/kategori/:kategori" component={Sakliste}/>
        <Route exact path="/kategori/:kategori/:id" component={Sak}/>
        <Route path="/addNews" component={AddSak}/>
        <Route exact path="/rediger/:kategori/:id" component={EditSak}/>
        <Route path="/login" component={Login}/>
        <Route path="/registrer" component={Registrer}/>
        <Route exact path="/kategori/MineSaker/:id" component={MineSaker}/>
        <Route exact path="/søkeSak/:soketekst" component={SokeSaker}/>
      </div>
    </HashRouter>,
    root
  );
