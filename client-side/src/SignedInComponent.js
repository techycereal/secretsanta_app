import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react' 
import ListGroups from './ListGroups'
function SignedInComponent({addItem,user, myGroup, signedIn, errorMessage, adminSignIn, groupCode, addPerson, isAdmin, deletePerson, changeName, changeAdminCode, DeleteGroups}){
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [didRandom, setDidRandom] = useState(false)
    
    const [giftFor, setGiftFor] = useState('')
    useEffect(() => {
        const getPairs = async () => {
          console.log(myGroup)
          console.log('myGroupsssssssssssssssssss')
          if (user['person']){
            const url = 'http://localhost:5000/getpairs/' + user['person'] + '/' + groupCode
            const request = await axios.get(url);
            console.log(request.data)
            if (request.data){
              setGiftFor(request.data[0]['Person'])
            }
          }
        }
        getPairs()
    }, [user['person']])
    console.log(myGroup)
    async function Randomize(){
        const url = 'http://localhost:5000/random/' + groupCode
        const request = await axios.get(url);
        if (request){
          setDidRandom(true)
          setShowModal(false)
        }
        setDidRandom(false)
      }
    
      const toggleModal = () => { 
        setShowModal(!showModal);
      };
      const showDeleteModal = () => {
        setDeleteModal(!deleteModal)
      }
    return (
        <>
        {signedIn && 
            <div className='center-container'>
              {Object.keys(user).length >= 1 && 
              <>
      {addItem}
      </>
      }
            <div>
            <input onChange={(e) => changeName(e)} placeholder='Who Are You?' className={`input-bar ${errorMessage['SignIn'] ? 'error' : ''}`}/>
            {errorMessage['SignIn'] && <p style={{color: "#800101"}}>{errorMessage['SignIn']}</p>}
            </div>
            <button onClick={addPerson} className='submit-button'>Submit</button>
            <div>
            <input onChange={(e) => changeAdminCode(e)} placeholder='Admin Code' className={`input-bar ${errorMessage['AdminCode'] ? 'error' : ''}`}/>
            {errorMessage['AdminCode'] && <p style={{color: "#800101"}}>{errorMessage['AdminCode']}</p>}
            </div>
            <button onClick={adminSignIn}  className={`submit-button`}>Admin Sign In</button>
            {isAdmin && (
                  <>
                    <button onClick={toggleModal} className='submit-button' style={{marginLeft: '1%'}}>Random</button>
                    <div className="delete-group-container">
                        <button className="delete-group-button" onClick={showDeleteModal}>Delete Group</button>
                    </div>
                  </>
                )}
            <div>
              {deleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={showDeleteModal}>&times;</span>
                        <h2>Are you sure you want to delete this group?</h2>
                        <button onClick={() => [DeleteGroups(), showDeleteModal()]} className='submit-button' style={{marginRight: "5%", width: "20%", backgroundColor: "#007600", color: "white"}}>Yes</button>
                        <button onClick={showDeleteModal} className='submit-button' style={{width: "20%", backgroundColor: '#C4001A', color: 'white'}}>No</button>
                    </div>
                </div>
            )}
              </div>
            <div>
              {showModal && didRandom === false && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={toggleModal}>&times;</span>
                        <h2>Are you sure you want to start</h2>
                        <button onClick={Randomize} className='submit-button' style={{marginRight: "5%", width: "20%", backgroundColor: "#007600", color: "white"}}>Yes</button>
                        <button onClick={toggleModal} className='submit-button' style={{width: "20%", backgroundColor: '#C4001A', color: 'white'}}>No</button>
                    </div>
                </div>
            )}
              </div>
            <ListGroups isAdmin={isAdmin} myGroup={myGroup} user={user} deletePerson={deletePerson} giftFor={giftFor} groupCode={groupCode}/>
            </div>
            }
            
        </>
    )
}

export default SignedInComponent