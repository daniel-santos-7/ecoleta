import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
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
  const [initialMapPosition, setInitialMapPosition] = useState<[number,number]>([0,0]);
  const [selectedMapPosition, setSelectedMapPosition] = useState<[number,number]>([0,0]);
  const [inputData, setInputData] = useState({
    name:'',
    email:'',
    whatsapp:''
  });
  const [selectedItems, setSelectItems] = useState<number[]>([]);

  const history = useHistory();

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

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition(position=> {
      const { latitude, longitude } = position.coords;
      setInitialMapPosition([latitude,longitude]);
    });
  },[]);

  function handleSelectUF(event:ChangeEvent<HTMLSelectElement>):void {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  function handleSelectCity(event:ChangeEvent<HTMLSelectElement>):void {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleInputChange(event:ChangeEvent<HTMLInputElement>):void {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]:value });
  }

  function handleMapClick(event: LeafletMouseEvent):void {
    const { lat, lng } = event.latlng;
    setSelectedMapPosition([lat,lng]);
  }

  function handleSelectItem(id:number):void {
  
    if(selectedItems.includes(id)) {
  
      setSelectItems(selectedItems.filter(item=> item !== id));
  
    } else {
  
      setSelectItems([...selectedItems,id])
  
    }
  
  }

  function handleSubmit(event:FormEvent) {

    event.preventDefault();

    const { name, email, whatsapp } = inputData;

    const [latitude, longitude] = selectedMapPosition;

    const uf = selectedUF;

    const city = selectedCity;

    const items = selectedItems;

    const data = { name, email, whatsapp, latitude, longitude, uf, city, items };

    api.post('point',data).then(resp=> { 
    
      alert('dados enviados!');

      history.push('/');
    
    });

  }

  return (
    <div id="page-create-point">
      <header>
          <img src={logo} alt="Ecoleta"/>
          <Link to="/"><FiArrowLeft/>Voltar para home</Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>
        <fieldset>
          <legend><h2>Dados</h2></legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade:</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
              value={inputData.name}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
                value={inputData.email}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp:</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
                value={inputData.whatsapp}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereços</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={initialMapPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={selectedMapPosition}/>
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
              <li 
                key={item.id}
                onClick={()=> handleSelectItem(item.id)}
                className={selectedItems.includes(item.id)?'selected':''}
              >
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