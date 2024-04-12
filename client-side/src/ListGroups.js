import { useEffect, useState } from 'react' 
import axios from 'axios'
import './App.css'
function ListGroups({isAdmin, myGroup, user, deletePerson, giftFor, groupCode}){
    const [showModal, setShowModal] = useState(false);
    const [deletedUser, setDeletedUser] = useState(null)
    const [pairs, setPairs] = useState([])
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [bigScreen, setBigScreen] = useState(true)
    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    useEffect(() => {
        const handleResize = () => {
            console.log(window.innerWidth)
            if (window.innerWidth >= 748) {
              setIsSidebarVisible(true);
              setBigScreen(true)
            } else {
              setIsSidebarVisible(false);
              setBigScreen(false)
            }
          };
      
          // Set state on initial render based on window width
          handleResize();
      
          // Add event listener
          window.addEventListener('resize', handleResize);
      
          // Cleanup
          
        const getAllPairs = async () => {
            if (groupCode){
              const url = 'http://localhost:5000/getallpairs/' + groupCode
              const request = await axios.get(url);
              setPairs(request.data)
            }
          }
        getAllPairs()
        return () => window.removeEventListener('resize', handleResize);
    }, [groupCode])
    const toggleModal = () => {
        console.log(showModal)
          setShowModal(!showModal);
      };
    return (
        <div style={{display: "flex"}}>
            <div>
              {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={toggleModal}>&times;</span>
                        <h2>Are you sure you want to remove {deletedUser.Person} from this group?</h2>
                        <button onClick={() => deletePerson(deletedUser)} style={{marginRight: "5%", width: "20%", backgroundColor: "#007600", color: "white"}} className='submit-button'>Yes</button>
                        <button onClick={toggleModal} className='submit-button' style={{width: "20%", backgroundColor: '#C4001A', color: 'white'}}>No</button>
                    </div>
                </div>
            )}
              </div>
              {
                !isSidebarVisible && <button onClick={toggleSidebar} className="toggle-sidebar-btn">&rarr;</button>
              }
  <div  className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
  {!bigScreen && <button onClick={toggleSidebar} className="sidebar-toggle">X</button>}
    <div> {/* Flex item for all content except the last <p> */}
        <p>Group Members</p>
        {Object.keys(myGroup).length >= 1 && 
        <>
        {myGroup.map((people) => (
            <div key={people.Person}>
                <p>{people.Person} {isAdmin && <span onClick={() => [toggleModal(), setDeletedUser(people)]} style={{cursor: 'pointer', color: 'red'}}>X</span>}</p>
            </div>
        ))}
        </>
        }
        {Object.keys(user).length > 1 && 
            <>
                <div style={{marginTop: "50px"}}>
                    {Object.keys(user['friend']).length >= 1 && <div>
                    <h4>{user['friend'][0]['Person']}'s List</h4>
                    {user['friend'].map((lists) => (
                        <li key={lists['item']}>{lists['item']}</li>
                    ))}
                        </div>}
                    
                </div>
                <div style={{marginTop: "50px"}}>
                    <h4>My List</h4>
                    {user['myself'].map((lists) => (
                        <li key={lists['item']}>{lists['item']}</li>
                    ))}
                </div>
            </>
        }
        {isAdmin && 
        <div style={{marginTop: "70px"}}>
            <h4>Gift Partners</h4>
            {console.log(pairs)}
            {Object.keys(pairs).map((people) => (
            <div>
                <p>{pairs[people]['PersonName1']}: {pairs[people]['PersonName2']}</p>
            </div>
            ))}
        </div>
        }
    </div>
    {giftFor && <p>You will get a gift for: {giftFor}</p>} {/* This will be pushed to the bottom */}
</div>

        </div>
    );
}

export default ListGroups