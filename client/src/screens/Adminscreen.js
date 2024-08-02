import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
const { TabPane } = Tabs;

function Adminscreen() {

  useEffect(()=>{
      if(!JSON.parse(localStorage.getItem("currentUser")).isAdmin)
      {
        window.location.href='/home'
      }
  },[])
  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h2 className="text-center" style={{ fontSize: "30px" }}>
        <b>Admin Panel</b>
      </h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <h1 className="text-left">
            <Bookings />
          </h1>
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <h1 className="text-left"><Rooms/></h1>
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <h1 className="text-left"><Addroom/></h1>
        </TabPane>
        <TabPane tab="UserList" key="4">
          <h1 className="text-left"><Users/></h1>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

// Bookings List Component

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/bookings/getallbookings");
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error message="Failed to load bookings" />
        ) : (
          <>
            <h1>Bookings</h1>
            {bookings.length ? (
              <h2 className="text-left">
                There are a total of {bookings.length} bookings
              </h2>
            ) : (
              <h2>No bookings found</h2>
            )}
          </>
        )}
        <table className="table table-bordered table-striped table-dark">
          <thead className="bs thead-dark">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//Rooms List Component

export function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const response = await axios.get("/api/rooms/getallrooms");
          setRooms(response.data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError(err);
          setLoading(false);
        }
      };
  
      fetchRooms();
    }, []);
  
    return (
      <div className='row'>
        <div className='col-md-12'>
          {loading ? (
            <Loader />
          ) : error ? (
            <Error message="Failed to load bookings" />
          ) : (
            <>
              <h1>Rooms</h1>
              {rooms.length ? (
                <h2 className='text-left'>There are a total of {rooms.length} rooms</h2>
              ) : (
                <h2>No Rooms found</h2>
              )}
            </>
          )}
          <table className='table table-bordered table-striped table-dark'>
              <thead className='bs thead-dark'>
                  <tr>
                      <th>Room Id</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Rent Per Day</th>
                      <th>Max Count</th>
                      <th>Phone Number</th>
                  </tr>
              </thead>
              <tbody>
                  {rooms.length && (rooms.map(room=>{
                      return <tr>
                          <td>{room._id}</td>
                          <td>{room.name}</td>
                          <td>{room.type}</td>
                          <td>{room.rentperday}</td>
                          <td>{room.maxcount}</td>
                          <td>{room.phonenumber}</td>
                      </tr>
                  }))}
              </tbody>
          </table>
        </div>
      </div>
    );
  }

  //User List Component
  export function Users()
  {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get("/api/users/getallusers");
            setUsers(response.data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError(err);
            setLoading(false);
          }
        };
    
        fetchUsers();
      }, []);
      
      return(
        <div className="row">
              <div className="col-md-12">
                    <h1>Users</h1>
                    <table className="table table-bordered table-dark">
                         <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Is Admin</th>
                            </tr>
                         </thead>
                         <tbody>
                            {users && (users.map(user=>{
                                return <tr>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? 'Yes':'No'}</td>
                                </tr>
                            }))}
                         </tbody>
                    </table>
              </div>
        </div>
      )
  }

  //Add Room Component


export function Addroom()
{
    const[name,setname]=useState('')
    const[rentperday,setrentperday]=useState();
    const[maxcount,setmaxcount]=useState();
    const[description,setdescription]=useState();
    const[phonenumber,setphonenumber]=useState();
    const[type,settype]=useState();
    const[imageurl1,setimageurl1]=useState();
    const[imageurl2,setimageurl2]=useState();
    const[imageurl3,setimageurl3]=useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    async function addRoom()
    {
        const newroom={
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls:[imageurl1,imageurl2,imageurl3]
        }
        try {
            setLoading(true)
            const result=(await axios.post('/api/rooms/addroom',newroom)).data
            console.log(result)
            setLoading(false)
            Swal.fire('Congrats',"Your New Room Added Successfully",'success').then(result=>{
                window.location.href='/home'
            })
        } 
        catch (error) {
            console.log(error)
            setLoading(false)
            Swal.fire('OOPS!!','Something went wrong','error')
        }
        
    }
    return(
        <div className="row">
             <div className="col-md-5">
             {loading && <Loader/>}
                <input type="text" value={name} onChange={(e)=>{setname(e.target.value)}} className="form-control" placeholder="room name"/>
                <input type="text" value={rentperday} onChange={(e)=>{setrentperday(e.target.value)}} className="form-control" placeholder="rent per day"/>
                <input type="text" value={maxcount} onChange={(e)=>{setmaxcount(e.target.value)}} className="form-control" placeholder="max count"/>
                <input type="text" value={description} onChange={(e)=>{setdescription(e.target.value)}} className="form-control" placeholder="decription"/>
                <input type="text" value={phonenumber} onChange={(e)=>{setphonenumber(e.target.value)}} className="form-control" placeholder="phonenumber"/>
             </div>
             <div className="col-md-5">
                <input type="text" value={type} onChange={(e)=>{settype(e.target.value)}} className="form-control" placeholder="type"/>
                <input type="text" value={imageurl1} onChange={(e)=>{setimageurl1(e.target.value)}} className="form-control" placeholder="Image URL 1"/>
                <input type="text" value={imageurl2} onChange={(e)=>{setimageurl2(e.target.value)}} className="form-control" placeholder="Image URL 2"/>
                <input type="text" value={imageurl3} onChange={(e)=>{setimageurl3(e.target.value)}} className="form-control" placeholder="Image URL 3"/>

                <div className="text-right">
                     <button className="btn btn-primary mt-2" onClick={addRoom}>Add Room</button>
                </div>
             </div>
        </div>
    )
}
