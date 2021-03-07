import './App.css';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      apiResponse: null, 
      apiResponseParsed: "",
      name: "", 
      lastName: "",
    });

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  
    /*
      - constructor() funkcija je funkcija koja se prva poziva, kada je potrebno renderovati Component. Parametar "props" koji prima jesu podaci koji su joj poslani od strane
      parent-a, koji poziva ovaj component-a.
      - this.state = ... je kolekcija vrijednosti, koje pomažu pri renderovanju stranice. Ukoliko se jedna izmijeni, stranica se opet učitava (ili samo Component).
      - bind-eovi ispod ne znam sta rade, jednostavno sam kopirao sa neta :)
    */
  }

  callAPI = () => {
      const formData = {
        name: this.state.name, 
        lastName: this.state.lastName
      };
      axios
      .post('http://localhost:5000/api', formData)
      .then((response) => {
        this.setState((state) => {
          return {apiResponse: response.data.accountsInformation}}
        ); 
        this.parseAPIResponse();
      })
      .then(() => console.log('POST Request sent'))
      .catch(err => {
        console.error(err);
      }); 
    
      /*
        - formData jeste kolekcija koja čuva podatke ("mapirane"), kakve ćemo slati serveru.
        - axios.post(lokacija, podaci) šalje podatke na određenu web lokaciju -> u našem slučaju, šalje ih na server koji handleujemo routes/api.js fileom
        - .then((response) => ...) koristi response poslan od strane servera. Jako je bitno da ovaj promise stoji ovde.
          - funkcija u ovome promise-u prvo postavlja vrijednost statea "apiResponse" na sav response koji smo dobili sa servera, kako bismo ga koristili kasnije
          - this.parseAPIResponse() je opisan zasebno u svojoj funkciji
        - .then(() => ...) ispisuje, jednostavno, u konzolu, da je POST Request poslan
        - .catch(err => ...) ispisuje sve errore vezane za axios.post pa nadalje. Ukoliko se nešto ispiše - bome, nije dobro.
      */
  } 

  parseAPIResponse = () => {
    let parsedResponse = JSON.parse(JSON.stringify(this.state.apiResponse));
    var parsedResponseString="";
    for(var i=0;i<parsedResponse.length;i++) {
      parsedResponseString+=parsedResponse[i].name+" "+parsedResponse[i].lastName+'\n';
    } 
    console.log(parsedResponseString);
    this.setState({apiResponseParsed: parsedResponseString});
    
    /*
      - let parsedResponse = ... parsuje JSON koji smo primili kao response, gore u callAPI() arrow funkciji.
        - parsuje ga tako da ga pretvori u niz kolekcija.
      - prelazimo for petljom preko tog niza kolekcija i za svaku kolekciju (koja predstavlja jedan dokument u našoj bazi, tj. kolekciji u bazi), uzimamo .name i .lastname
        vrijednosti i dodajemo je u ukupni string, koji će biti ispisan. 
        - kako sve ne bi bilo jedno uz drugo, nakon svakog dokumenta dodaje se '\n', što predstavlja prelazak u novi red.
      = postojao je bolji način da se ovo odradi, samo on meni, u momentu pisanja ovoga, nije bio poznat.
      - console.log(parsedResponseString) samo ispisuje završni string. Ovo je korišteno za testiranje da vidim je li sve u redu. Nije potrebno u pravom programu.
      - this.setState(...) postavlja vrijednost apiResponseParsed na parsedResponseString. 
        - jednostavno rečeno -> apiResponseParsed je state vrijednost koju ćemo koristiti kasnije za ispisivanje svega iz baze. Čuvamo je ovako samo da bismo je kasnije mogli 
          opet koristiti, jer je parsedResponse varijabla lokalna, iako smo je mogli deklarisati kao globalnu (no onda bismo morali koristiti .forceUpdate()).
    */
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleLastNameChange(event) {
    this.setState({lastName: event.target.value});
  }

  /*
    U suštini, potrebne su nam dvije state vrijednosti - name i lastName, da čuvaju trenutnu vrijednost textInputa u formi.
    Kako su state vrijednosti, nakon bilo kakve promjene u textInputima, one će biti pozvane i refreshovaće stranicu.
    Koristimo ih kasnije, takođe, da pošaljemo te informacije API-u.
  */

  handleSubmit(event) {
    this.setState((state) => {
      return {name: state.name.trim(), lastName: state.lastName.trim()};
    });
    if(this.state.name.length==0 || this.state.lastName.length==0) {
      alert("Please fill in the credentials!");
      return;
    }
    alert("Name " + this.state.name + " and last name " + this.state.lastName + " are going to be sent!");
    event.preventDefault();
    this.callAPI(); 
    
    /*
      - this.setState(...) state vrijednosti "name" i "lastName" (koje sada imaju ime i prezime, koje šaljemo API-u) "trimmuje", tj. briše im početne i završne suvišne spaceove.
        - Ovo je isključivo sigurnosno, kako neko ne bi poslao "space" (ako je to uopšte moguće) bazi i tako je punio bez razloga.
      - if(...) provjerava da li su dužine imena i prezimena veće od nule -> ukoliko nisu, iskače popup koji kaže da je potrebno popuniti podatke i prekida funkciju, kako se
        ništa ne bi poslalo API-u.
      - ukoliko je sve u redu, iskače popup koji kaže da će unešeno ime i prezime biti poslano API-u i jednostavno se poziva funkcija .callAPI(), koja je gore opisana.
    */
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Name: 
            <input type="text" value={this.state.name} onChange={this.handleNameChange}/><br/> 
            Last name:
            <input type="text" value={this.state.value} onChange={this.handleLastNameChange}/><br/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        {this.state.apiResponseParsed.split('\n').map(
          function(item, key) {
          return (
            <span key={key}>
              {item}
              <br/>
            </span>
          )
          })
        }
      </div>
    );
  }
  
  /*
    Gornja funkcija je render() funkcija, koja renderuje stranicu da bismo je mogli vidjeti. 
    U form tag-u vidimo da imamo onSubmit atribut, koji kaže da kada submit dugme bude stisnuto, treba pozvati handleSubmit() funkciju.
    Text inputi imaju onChange atribut, koji poziva handleNameChange() funkciju, koja mijenja njihovu prikazanu vrijednost, koja je zapravo sadržana u value atributu.
    this.state.apiResponseParsed.split(...) je funkcija koja ispisuje apiResponseParsed. Ona mijenja svaki '\n' sa <br> tagom. Kopirao sam je sa interneta :3
  */
}

export default App;
