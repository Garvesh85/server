import React, { useEffect, useState } from 'react'
import { Tabs, Tag } from 'antd';
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Swal from 'sweetalert2';
const{TabPane}=Tabs;
function Profilescreen() {

    const user=JSON.parse(localStorage.getItem("currentUser"))

    useEffect(()=>{
        if(!user)
        {
            window.location.href="/login"
        }
    },[])
  return (
    <div className='ml-3 mt-3'>
      <Tabs defaultActiveKey='1'>
         <TabPane tab='Profile' key='1'>
             <h1>My Profile</h1>

             <br/>

             <h1>Name: {user.name}</h1>
             <h1>Email: {user.email}</h1>
             <h1>isAdmin: {user.isAdmin ? 'Yes' : 'No'}</h1>
         </TabPane>
         <TabPane tab='Bookings' key='2'>
             <MyBookings/>
         </TabPane>
      </Tabs>
    </div>
  )
}

export default Profilescreen


export function MyBookings() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [rooms, setRooms] = useState([]);
     const[bookings,setbookings]=useState([]);
     const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
    useEffect(() => {
        const getBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.post("/api/bookings/getbookingsbyuserid", { userid: user._id });
                setbookings(response.data);
                setRooms(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.log(error);
                setLoading(false)
                setError(error)
            }
        };

        getBookings();
    }, [user._id]);

    async function cancelBooking(bookingid, roomid) {
        try {
            setLoading(true);
            const response = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
            const result = response.data;
            console.log(result);
            setLoading(false);
            Swal.fire('Congrats','Your Booking has been Cancelled' , 'success').then(result=>{
                window.location.reload()
            }

            )
        } catch (error) {
            console.error('Error cancelling booking:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    }
    return(
        <div>
            <div className='row'>
               <div className='col-md-6'>
                    {loading && (<Loader/>)}
                    {bookings && (bookings.map(booking=>{
                        return <div className='bs'>
                            <h1>{booking.room}</h1>
                            <p><b>BookingId:</b> {booking._id}</p>
                            <p>TransactionId: 1234</p>
                            <p><b>CheckIn:</b> {booking.fromDate}</p>
                            <p><b>CheckOut:</b> {booking.toDate}</p>
                            <p><b>Amount:</b> {booking.totalAmount}</p>
                            <p>
                                <b>Status:</b> : {""}
                                {booking.status=='cancelled'? (<Tag color="red">CANCELLED</Tag>):(<Tag color="green">CONFIRMED</Tag>)}
                            </p>
                            {booking.status !=='cancelled' &&(
                            <div className='text-right'>
                                <button className='btn btn-primary' onClick={()=>{cancelBooking(booking._id,booking.roomid)}}>
                                     CANCEL BOOKING
                                </button>
                            </div>)}
                        </div>
                    }))}
               </div>
            </div>
        </div>
    )
}