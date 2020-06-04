import React, { useEffect, useState, ChangeEvent } from 'react';
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

interface Item {
  id:number;
  title:string;
  image_url:string;
}

interface UF {
  sigla:string;
}

interface City {
  nome:string;
}

const CreatePoint: React.FC = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [UFs, setUFs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUF, setSelectedUF] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  useEffect(()=> {

    api.get('/item').then(resp=> { 
    
      setItems(resp.data) 
    
    });

  },[]);

  useEffect(()=> {

    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(resp=> {

      const ufInitials = resp.data.map(uf=> uf.sigla);

      setUFs(ufInitials);

    });

  },[]);

  useEffect(()=> {

    if(selectedUF === '0') return;

    axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(resp=> {

      const cities = resp.data.map(city=> city.nome);

      setCities(cities);

    });

  },[selectedUF])

  function handleSelectUF(event:ChangeEvent<HTMLSelectElement>):void {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  function handleSelectCity(event:ChangeEvent<HTMLSelectElement>):void {
    const city = event.target.value;
    setSelectedCity(city);
  }

  return (
    <div id="page-create-point">
      <header>
          <img src={logo} alt="Ecoleta"/>
          <Link to="/"><FiArrowLeft/>Voltar para home</Link>
      </header>
      <form>
        <h1>Cadastro do <br/> ponto de coleta</h1>
        <fieldset>
          <legend><h2>Dados</h2></legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade:</label>
            <input
              type="text"
              name="name"
              id="name"
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp:</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereços</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={[-27, -49]} zoom={15}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[-27, -49]}/>
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado:</label>
              <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUF}>
              <option value="0">Selecione uma uf</option>
              { UFs.map(uf => (<option value={uf} key={uf}>{uf}</option>)) }
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade:</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                { cities.map(city => (<option value={city} key={city}>{city}</option>)) }
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            { items.map(item=> (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            )) }
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;