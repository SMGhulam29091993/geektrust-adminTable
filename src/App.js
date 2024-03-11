import React, { useEffect, useState } from 'react'
import axios from "axios";


const App = () => {
  const [users,setUsers] = useState([]);
  const [filterUser,setFilterUser] = useState([]);

  const fetchUser = async ()=>{
    try {
      const res = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
      const responseData = res.data;
      console.log(responseData);
      setUsers(responseData);
      setFilterUser(responseData);
    } catch (error) {
      console.log(`Error in fetching the users ${error}`);
    }
  }
  useEffect(()=>{
    fetchUser();
  },[]);

  console.log(users);
  return (
    <div>

    </div>
  )
}

export default App