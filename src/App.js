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
    console.log(filter);
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

  const handleDelete = (id)=>{
    const filter = filterUser.filter((user)=>user.id !== id)
    setFilterUser(filter)
  }

  const handleDeleteSelected = ()=>{
    const update = filterUser.filter(user=> !selectedRow.includes(user.id));
    setUsers(update)
    setFilterUser(update)
    setSelectedRow([])
    setCount(0)
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
          <button type="submit" onClick={handleFilter} className=' bg-blue-700 text-white p-2 rounded-lg w-20 sm:w-40 uppercase hover:opacity-90'>Search</button>
      </div>
      <div className='max-w-7xl mx-auto items-center shadow-lg p-2'>
        <div className='w-full border border-slate-500 '>
          <div className='flex items-center justify-between bg-slate-900 text-white uppercase'>
            <span className='p-2 w-40 text-center font-semibold'>{count>0?`Selected ${count}`:""}</span>
            <span className='p-2 w-40 text-left font-semibold'>Name</span>
            <span className='p-2 w-40 text-left font-semibold'>Email</span>
            <span className='p-2 w-40 text-left font-semibold'>Role</span>
            <span className='p-2 w-40 text-left font-semibold'>Action</span>
          </div>
          
          {filterUser.slice(startIndex,endIndex).map(user=>(
            <div key={user.id} className='flex items-center justify-between'>
              <input type='checkbox' checked={selectedRow.includes(user.id)} 
                onChange={()=>handleSelectedRow(user.id)} className='p-1 truncate w-40' />
              <span className='p-1 truncate sm:w-40'>{user.name}</span>
              <span className='p-1 truncate sm:w-40' >{user.email}</span>
              <span className='p-1 truncate sm:w-40' >{user.role}</span>
              <span className='p-1 flex sm:w-40 gap-2 cursor-pointer' >
                <span className='bg-orange-400 p-2 rounded-md text-white uppercase' >Edit</span>
                <span  className='bg-red-700 p-2 rounded-md text-white uppercase'
                 onClick={()=>handleDelete(user.id)}>Delete</span>
              </span>
            </div>
           ))}
        </div>
      </div>
      {count>0 && <button className='ml-11 mt-2 bg-red-700 text-white uppercase p-2 rounded'
        onClick={handleDeleteSelected}>Delete Selected</button>}
      <div className='flex gap-2 items-center justify-center mt-3'>
        <button onClick={()=>setCurrentPage(1)} className='bg-green-500 p-2 rounded-full'>First Page</button>
        <button onClick={()=>setCurrentPage(currentPage-1)} 
          className={`bg-green-500 p-2 rounded-full ${startIndex === 0?'cursor-not-allowed opacity-50' : ''}`}>Prev Page</button>
        {Array.from({length : totalPages}, (_,i)=>(
          <button key={i} onClick={()=>setCurrentPage(i+1)} className='bg-green-500 p-2 rounded-full'>{i+1}</button>
        ))}
        <button onClick={()=>setCurrentPage(currentPage+1)} 
          className={`bg-green-500 p-2 rounded-full ${endIndex === filterUser.length ? 'cursor-not-allowed opacity-50' : ''}`}>
            Next Page</button>
        <button onClick={()=>setCurrentPage(totalPages)} className='bg-green-500 p-2 rounded-full'>Last Page</button>
      </div>
      
    </div>
  )
}

export default App;