import React, { useEffect, useState } from 'react'
import axios from "axios";


const App = () => {
  const [users,setUsers] = useState([]);
  const [filterUser,setFilterUser] = useState([]);
  const [searchTerm,setSearchTerm] = useState("")
  const [selectedRow, setSelectedRow] = useState([]);
  const pageSize = 10;
  const [currentPage,setCurrentPage] = useState(1);
  const [count, setCount] = useState(0)

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

  const handleFilter = (e)=>{
    e.preventDefault();
    const filter = users.filter(user=>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilterUser(filter);
    setCurrentPage(1);
  }
 
  const handleSelectedRow = (id)=>{
    
    if(selectedRow.includes(id)){
      setSelectedRow(selectedRow.filter(rowId=>rowId!==id));
      setCount(count-1)
    }else{
      setSelectedRow([...selectedRow, id]);
      setCount(count+1)
    }
  }

  const totalPages = Math.ceil(filterUser.length/pageSize);
  const startIndex = (currentPage-1)*pageSize;
  const endIndex = Math.min(startIndex+pageSize, filterUser.length);

  console.log(searchTerm);
  return (
    <div className=''>
      <div className='flex mx-auto items-center max-w-7xl p-3 gap-2'>
        <input type='text' placeholder='Search by name, email, role...'
          value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}} 
          className='border border-gray-500 rounded-lg p-2' style={{width:"90%"}}/>
          <button onSubmit={handleFilter} className=' bg-blue-700 text-white p-2 rounded-lg w-20 sm:w-40 uppercase hover:opacity-90'>Search</button>
      </div>
      <div className='max-w-7xl mx-auto items-center'>
        <div className='w-full border border-slate-500 p-4'>
          {filterUser.slice(startIndex,endIndex).map(user=>(
            <div key={user.id} className='flex items-center justify-between'>
              <input type='checkbox' checked={selectedRow.includes(user.id)} onChange={()=>handleSelectedRow(user.id)}/>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <span className='flex gap-4'>
                <span >Edit</span>
                <span>Delete</span>
              </span>
            </div>
           ))}
          
        </div>
        
      </div>
    </div>
  )
}

export default App