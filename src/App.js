import { API, Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import './App.css'

import awsExports from './aws-exports';
import { useState } from 'react';
Amplify.configure(awsExports);
const App = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [DOB, setDOB] = useState('')
  const [avatar, setAvatar] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('')

  async function addContact(event) {
    event.preventDefault();
    const myInit = {
      body: {
        name: name,
        email: email,
        phone: phone,
        gender: gender,
        dob: DOB,
        avatar: avatar,
        address: address
      },
    };

    API.post('testApi', '/users', myInit)
      .then((response) => {
        console.log(response);
        console.log("Sucessfully Added");
      })
      .catch((error) => {
        console.log(error.response);
      });

    /*
    const data = {
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      dob: DOB,
      avatar: avatar,
      address: address
    }
    console.log(data );
    */

  }

  return (
    <div className="App">
      <form>
        <input type="text" name='Name' placeholder='Name' onChange={(e) => setName(e.target.value)} />
        <input type="text" name='Email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type="number" name='Phone' placeholder='Phone' onChange={(e) => setPhone(e.target.value)} />
        <select name="Gender" defaultValue={''} onChange={(e) => setGender(e.target.value)}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="date" name="DOB" onChange={(e) => setDOB(e.target.value)} />
        <input type="text" name='Avatar' placeholder='Avatar' onChange={(e) => setAvatar(e.target.value)} />
        <input type="text" name='Address' placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
        <button type="button" onClick={addContact}>Submit</button>
      </form>
    </div>
  )
}

export default App