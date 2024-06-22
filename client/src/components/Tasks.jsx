import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';

const Tasks = () => {

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);


  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }


  return (
   <>
    <div className="bg-pink-50 min-h-screen">
      <div className="my-2 mx-20 max-w-screen-xl py-4">

        {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'><b>Your tasks</b> ({tasks.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (
                  
                  <div className="w-full md:w-[600px] max-h-[300px] h-screen flex flex-col items-center justify-center gap-4 p-4 bg-pink-200 rounded-md shadow-lg mx-auto mt-[calc(40vh-150px)] absolute left-1/2 transform -translate-x-1/2">
                  <span className="text-center text-gray-800 font-semibold text-xl">Task not found</span>
                  <a href="/tasks/add" className="bg-gray-400 text-white hover:bg-gray-600 font-medium rounded-md px-4 py-2">Add task</a>
                </div>

            ) : (
              tasks.map((task, index) => (
                <div key={task._id} className='bg-white my-4 p-4 text-yelow-600 rounded-xl shadow-md '>
                  <div className='flex justify-start'>
                    

                    <span style={{fontSize:"1.3rem",fontFamily:"monospace"}} className='font-large'><b>Task: {index + 1}</b></span>

                   
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-blue-400 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    

                  
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        Remove
                      </span>
                    

                  </div>
                  <div className='whitespace-pre'><i>Content: </i>{task.description}</div>
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </div>
    </>
  )

}

export default Tasks