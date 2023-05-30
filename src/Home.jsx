import { API, Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const Home = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [married, setMarried] = useState(false);
  const [data, setData] = useState([]);
  const [trigger, setTrigger] = useState(false); // New trigger state
  const [editItemId, setEditItemId] = useState(null); // Track the edited item ID

  async function addContact(event) {
    event.preventDefault();
    const myInit = {
      body: {
        name: name,
        email: email,
        phone: phone,
        married: married,
      },
    };

    try {
      await API.post('testApi', '/items', myInit);
      console.log("Successfully Added");
      setTrigger(!trigger);
    } catch (error) {
      console.log(error.response);
    }
  }

  async function updateContact(itemId) {
    const myInit = {
      body: {
        name: name,
        email: email,
        phone: phone,
        married: married,
      },
    };

    try {
      await API.put('testApi', `/items/${itemId}`, myInit);
      console.log("Successfully Updated");
      setEditItemId(null); // Reset edit item ID
      setTrigger(!trigger);
    } catch (error) {
      console.log(error.response);
    }
  }

  const getData = async () => {
    try {
      const response = await API.get('testApi', '/items');
      setData(response);
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [trigger]); // Listen to trigger changes

  const handleEdit = (itemId) => {
    console.log('Edit Item ID:', itemId);
    const selectedItem = data.find(item => item.id === itemId);
    if (selectedItem) {
      setName(selectedItem.name);
      setEmail(selectedItem.email);
      setPhone(selectedItem.phone);
      setMarried(selectedItem.married);
      setEditItemId(itemId);
    }
  };

  const handleDelete = async (itemId) => {
    console.log('Delete Item ID:', itemId);
    try {
      await API.del('testApi', `/items/${itemId}`);
      console.log('Successfully deleted');
      setTrigger(!trigger);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="App">
      <form>
        <span>TEST FORM</span>
        <input type="text" name='Name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" name='Email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="number" name='Phone' placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select name="Married" defaultValue={married} onChange={(e) => setMarried(e.target.value)}>
          <option value="" disabled>Married</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {editItemId ? (
          <button type="button" onClick={() => updateContact(editItemId)}>Update</button>
        ) : (
          <button type="button" onClick={addContact}>Submit</button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Married</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{editItemId === item.id ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                item.name
              )}</td>
              <td>{editItemId === item.id ? (
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              ) : (
                item.email
              )}</td>
              <td>{editItemId === item.id ? (
                <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              ) : (
                item.phone
              )}</td>
              <td>{editItemId === item.id ? (
                <select value={married} onChange={(e) => setMarried(e.target.value)}>
                  <option value="" disabled>Married</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                item.married.toString()
              )}</td>
              <td>
                {editItemId === item.id ? (
                  <button onClick={() => updateContact(item.id)}>Update</button>
                ) : (
                  <button onClick={() => handleEdit(item.id)}>Edit</button>
                )}
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Home;
