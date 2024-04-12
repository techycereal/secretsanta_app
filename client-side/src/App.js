import './App.css';
import axios from 'axios'
import { useState } from 'react' 

import SignedInComponent from './SignedInComponent';
function App() {
  const [groupName, setGroupName] = useState('')
  const [groupCode, setGroupCode] = useState('')
  const [name, setName] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [myGroup, setMyGroup] = useState({})
  const [user, setUser] = useState('')
  const [item, setItem] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [createdNewGroup, setCreatedNewGroup] = useState({})
  const [errorMessage, setErrorMessage] = useState({'CreateGroup': null, 'SignIntoGroup': null, 'SignIn': null, 'AdminCode': null})
  const handleClose = () => {
    setSignedIn(false)
    setIsAdmin(false)
    setMyGroup({})
    setUser('')
    setGroupName('')
    setGroupCode('')
    setName('')
    setItem('')
    setAdminCode('')
    setCreatedNewGroup({})
  }
  
  async function startDB(){
    if (groupName){
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'CreateGroup': null}
        return newError
      })
      const body = {
        groupName: groupName
      }
      const request = await axios.post('http://localhost:5000/createGroup', body, {
        headers: {
          'Content-Type': 'application/json'
        } 
      }).catch(() => {
        setErrorMessage((prevMsg) => {
          const newError = {...prevMsg, 'CreateGroup': "We're having problems with our service"}
          return newError
        })
      });
      if(request){
        setCreatedNewGroup(request.data)
        setGroupCode(request.data['groupCode'])
      }
    } else {
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'CreateGroup': 'Please enter a name for your group'}
        return newError
      })
    }
  }
  async function addPerson(){
    if(name){
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'SignIn': null}
        return newError
      })
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'AdminCode': null}
        return newError
      })
      const body = {
        groupCode: groupCode,
        name: name
      }
      const request = await axios.post('http://localhost:5000/add', body, {
        headers: {
          'Content-Type': 'application/json'
        } 
      }).catch(() => {
        setErrorMessage((prevMsg) => {
          const newError = {...prevMsg, 'SignIn': "We're having problems with our service"}
          return newError
        })
      })
      if (request){
        setMyGroup((prevUsers) => {
          if (Object.keys(prevUsers).length >= 1){
            const newUser = [...prevUsers, request.data.person]
            return newUser 
          } else {
            return [request.data.person]
          }
        })
        setUser(request.data)
        console.log(request.data)
      }
    } else {
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'SignIn': 'Please enter a name'}
        return newError
      })
    }
  }

  async function adminSignIn(){
    if (adminCode){
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'AdminCode': null}
        return newError
      })
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'SignIn': null}
        return newError
      })
      const body = {
        groupCode: groupCode,
        adminCode: adminCode
      }
      const request = await axios.post('http://localhost:5000/adminsignin', body, {
        headers: {
          'Content-Type': 'application/json'
        } 
      }).catch(() => {
        setErrorMessage((prevMsg) => {
          const newError = {...prevMsg, 'AdminCode': "We're having problems with our service"}
          return newError
        })
      });
      if (request.data.length >= 1){
        setIsAdmin(true)
      }
    } else {
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'AdminCode': 'Please enter a code'}
        return newError
      })
    }
  }


   

  async function signin(){
    if (groupCode){
      const url = 'http://localhost:5000/signin/' + groupCode
      setCreatedNewGroup({})
      const request = await axios.get(url).catch(() => {
        setErrorMessage((prevMsg) => {
          const newError = {...prevMsg, 'SignIntoGroup': "We're having problems with our service"}
          return newError
        })
      });
      if (request){
        if (typeof(request.data) == 'object'){
          setSignedIn(true)
          console.log(request.data)
          setMyGroup(request.data)      
        } else if (request.data === 'No group by that code') {
          setErrorMessage((prevMsg) => {
            const newError = {...prevMsg, 'SignIntoGroup': request.data}
            return newError
          })
        }
      }
      
    } else {
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'SignIntoGroup': 'please enter a code'}
        console.log(newError)
        return newError
      })
    }
    
  }

  async function write_list(){
    const body = {
      groupCode: groupCode,
      user: user['person'],
      item: item
    }
    await axios.post('http://localhost:5000/write_list', body).catch(() => {
      setErrorMessage((prevMsg) => {
        const newError = {...prevMsg, 'List': "We're having problems with our service"}
        return newError
      })
    });
    setUser((prevUsers) => {
      const newItem = [...prevUsers['myself'], {personId: user['person'], item: item}]
      const newss = {'friend': prevUsers['friend'], 'myself':newItem}
      return newss
    })
  }
  async function signins(){
    const url = 'http://localhost:5000/signins/' + groupCode
    setCreatedNewGroup({})
    const request = await axios.get(url);
    console.log(request.data)
    if (typeof(request.data) == 'object'){
      setSignedIn(true)
      setMyGroup(request.data)      
    }
  }
  function NewGroup(){
    return(
      <div style={{marginTop: "50%"}}>
      <p className='pacifico'>This is your group code DO NOT LOSE IT! <span>{createdNewGroup['groupCode']}</span></p>
      <p className='pacifico'>This is your admin code DO NOT LOSE IT! <span>{createdNewGroup['adminCode']}</span></p>
      <button className='submit-button' onClick={signins}>Go To Group</button>
      </div>
    )
  }

  function changeName(e){
    setName(e.target.value)
  }

  function changeAdminCode(e){
    setAdminCode(e.target.value)
  }

  async function DeleteGroups(){
    handleClose()
    const url = 'http://localhost:5000/deletegroup/' + groupCode
    const request = await axios.get(url);
    console.log(request)
  }

  async function deletePerson(person){
    const body = {
      groupCode: person.groupCode,
      personId: person.personId
    }
    await axios.post('http://localhost:5000/deleteuser', body, {
      headers: {
        'Content-Type': 'application/json'
      } 
    })
    setMyGroup((prevUsers) => {
      // Find the index of the person in the array
      const index = prevUsers.indexOf(person);
  
      // If the person is not found, return the original array
      if (index === -1) {
          return prevUsers;
      }
  
      // Create a new array without the person
      const newUsers = [...prevUsers];
      newUsers.splice(index, 1);
  
      console.log(newUsers);
      return newUsers;
  });
  }
  const addItem = (
    <>
    <div>
      <input placeholder='Write Items For Your List' onChange={(e) => setItem(e.target.value)} className='input-bar'/>
      </div>
      <button onClick={write_list} className='submit-button'>Add</button>
      </>
  )
  return (
    <div className="App">
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Pacifico" />
      <div className="nav">
    <div id="text" style={{fontFamily: "pacifico"}}>
      Secret Santa
    </div>
  </div>
  <div style={{marginTop: "10%"}}>
    {Object.keys(createdNewGroup).length > 1 ?
    <NewGroup/>
    :
    <>
  {!signedIn && 
      <div className='center-container'>
        <div> 
        <input onChange={(e) => setGroupName(e.target.value)} placeholder='Create Group' className={`input-bar ${errorMessage['CreateGroup'] ? 'error' : ''}`}/>
        {errorMessage['CreateGroup'] && <p style={{color: "#800101"}}>{errorMessage['CreateGroup']}</p>}
        </div>
        <button onClick={startDB} className='submit-button'>Create</button>
        <div>
        <input placeholder='Sign Into Group' onChange={(e) => setGroupCode(e.target.value)} className={`input-bar ${errorMessage['SignIntoGroup'] ? 'error' : ''}`}/>
        </div>
        {errorMessage['SignIntoGroup'] && <p style={{color: "#800101"}}>{errorMessage['SignIntoGroup']}</p>}
        <button onClick={signin} className='submit-button'>Sign In</button>
      </div>
      }
      
      <SignedInComponent addItem={addItem} user={user} myGroup={myGroup} signedIn={signedIn} errorMessage={errorMessage} adminSignIn={adminSignIn} groupCode={groupCode} addPerson={addPerson} isAdmin={isAdmin} deletePerson={deletePerson} changeName={changeName} changeAdminCode={changeAdminCode} DeleteGroups={DeleteGroups}/>
      </>
    }

  </div>
    </div>
  );
}

export default App;
