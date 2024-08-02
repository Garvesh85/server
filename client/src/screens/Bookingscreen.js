import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import moment from "moment";
import Error from "../components/Error";
import StripeCheckout from 'react-stripe-checkout';
import swal from 'sweetalert2';

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        if(!localStorage.getItem('currentUser'))
        {
            window.location.reload='/login'
        }
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });
        setRoom(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [roomid]);

  if (loading) {
    return <h1><HashLoader /></h1>;
  }

  if (error) {
    return <h2><Error /></h2>;
  }

  const fromDateFormatted = moment(fromdate, "DD-MM-YYYY").format('DD-MM-YYYY');
  const toDateFormatted = moment(todate, "DD-MM-YYYY").format('DD-MM-YYYY');
  const totalDays = moment(todate, "DD-MM-YYYY").diff(moment(fromdate, "DD-MM-YYYY"), 'days');
  const totalamount = totalDays * room.rentperday;
  

  async function onToken(token) {
    console.log('Stripe Token:', token);
    
    try {
      const bookingDetails = {
        room,
        userid: JSON.parse(localStorage.getItem('currentUser'))._id,
        fromDate: fromDateFormatted, 
        toDate: toDateFormatted,
        totalAmount: totalamount,
        totalDays,
        token
      };
  
      setLoading(true);
      
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      console.log('Booking Response:', result.data); // Log response data
      setLoading(false);
      
      swal.fire('Congratulations', 'Your Room Booked Successfully', 'success').then(() => {
        window.location.href = '/profile';
      });
    } catch (error) {
      console.error('Error booking room:', error.response ? error.response.data : error.message);
      setLoading(false);
      swal.fire('OOPS!', error.response?.data?.error || 'Something went wrong', 'error');
    }
  }

  return (
    <div className="m-5">
      <div className="row justify-content-center mt-5 bs">
        <div className="col-md-5">
          <h1>{room.name}</h1>
          <img src={room.imageurls[0]} className="bigimg" alt="Room" />
        </div>
        <div className="col-md-5">
          <div style={{ textAlign: 'right' }}>
            <h1>Booking Details</h1>
            <hr />
            <div>
              <b>
                <p>Name: {room.name}</p>
                <p>From Date: {fromDateFormatted}</p>
                <p>To Date: {toDateFormatted}</p>
                <p>Max Count: {room.maxcount}</p>
              </b>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <b>
              <h1>Amount</h1>
              <hr />
              <p>Total Days: {totalDays}</p>
              <p>Rent per day: {room.rentperday}</p>
              <p>Total Amount: {totalDays * room.rentperday}</p>
            </b>
          </div>
          <div style={{ float: 'right' }}>

            <StripeCheckout
        amount={totalamount*100}
        token={onToken}
        currency="INR"
        stripeKey="pk_test_51PFsZDAdrK081GNjqtC0jB23uBRX18CQkGWhTd99fgeDEjrLXF8ilscsExoANgPrFEssxt0UmF1gUExFzsZBks4100mNlQieGn"
      >
        <button className="btn btn-primary">Pay Now</button>
      </StripeCheckout>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;