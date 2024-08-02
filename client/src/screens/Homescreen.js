import React, { useEffect, useState } from "react";
import axios from "axios";
import Rooms from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const[searchkey,setsearchkey]=useState();
  const[type,settype]=useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setRooms(data);
        setDuplicateRooms(data); // Set duplicate rooms for initial filtering
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates) {
    if (dates && dates.length === 2) {
      const fromDate = dates[0].format("DD-MM-YYYY");
      const toDate = dates[1].format("DD-MM-YYYY");

      // Filter rooms based on selected date range
      const filteredRooms = duplicateRooms.filter((room) => {
        let isAvailable = true;
        for (const booking of room.currentbookings) {
          const bookingFromDate = booking.fromdate;
          const bookingToDate = booking.todate;

          // Check if selected range overlaps with any existing booking
          if (
            moment(fromDate, "DD-MM-YYYY").isBetween(
              bookingFromDate,
              bookingToDate,
              null,
              "[]"
            ) ||
            moment(toDate, "DD-MM-YYYY").isBetween(
              bookingFromDate,
              bookingToDate,
              null,
              "[]"
            ) ||
            moment(bookingFromDate, "DD-MM-YYYY").isBetween(
              fromDate,
              toDate,
              null,
              "[]"
            ) ||
            moment(bookingToDate, "DD-MM-YYYY").isBetween(
              fromDate,
              toDate,
              null,
              "[]"
            )
          ) {
            isAvailable = false;
            break;
          }
        }
        return isAvailable;
      });

      // Update state with filtered rooms and selected dates
      setRooms(filteredRooms);
      setFromDate(fromDate);
      setToDate(toDate);
    } else {
      // Handle case where dates are not properly selected
      setRooms(duplicateRooms); // Reset to original list if no valid dates
      setFromDate(null);
      setToDate(null);
    }
  }
  function filterBySearch()
  {
     const temprooms=duplicateRooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()))
     setRooms(temprooms)
  }
  function filterByType(e)
  {
    settype(e)
     if(e!=='all')
     {
      const temprooms=duplicateRooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
      setRooms(temprooms)
     }
     else
     {
       setRooms(duplicateRooms)
     }
  }
  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search Rooms"
            value={searchkey} onChange={(e)=>{setsearchkey(e.target.value)}} onKeyUp={filterBySearch}
          />
        </div>

        <div className="col-md-3">
          <select className="form-control" value={type} onChange={(e)=>{filterByType(e.target.value)}}>
            <option value="all">All</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="executive">Executive</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : error ? (
          <h1>
            <Error />
          </h1>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="col-md-9 mt-2">
              <Rooms room={room} fromdate={fromDate} todate={toDate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;