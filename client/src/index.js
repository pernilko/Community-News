import {Component} from "react-simplified";
import ReactDOM from 'react-dom';
import { HashRouter, Route} from 'react-router-dom';
import * as React from "react";
import axios from 'axios';

export class home extends Component {

  input = "input";
  output = "output";

  render(){
      return(
        <div>
        <form>
          <textarea
          type="text"
          style={{width: '100%', height: '30vh'}}
          value={this.input}
          onChange={(event) => {
            this.input = event.target.value;;
          }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            style={{width: '100%', height: '5vh'}}
            onClick={() => this.run()}
          >Kompiler og kjør</button>
        </form>
        <textarea
        readonly
        style={{width: '100%', height: '65vh'}}
        value={this.output}
        />
      </div>
          
      );
  }

  run(){
      console.log(this.input);
      return axios.post('http://localhost:8080/code',
      {
          code: this.input
      }).then((response) => {
        let tempA = response.data.data.split('\n');
        let tempB = "";
        for(let i = 14; i < tempA.length; i++) {
          tempB = tempB + tempA[i] + "\n";
        }
        this.output = tempB;
  });

  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Route exact path="/" component={home}/>
      </div>
    </HashRouter>,
    root
  );