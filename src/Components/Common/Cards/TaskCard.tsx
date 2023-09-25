import React, { useState } from 'react'
import { Id, Task } from '../../../Utils'
import TrashIcon from '../Icons/TrashIcon'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface props {
    task:Task
    deleteTask:(id:Id)=>void
    updateTask:(id:Id , content:string)=>void 
}

function TaskCard({task ,deleteTask ,updateTask} :props) {

    const [mouseIsOver , setMouseIsOver] = useState(false)
    const [editMode ,setEditMode] = useState(false)

    const toggleEditMode=()=>{
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    const {
        setNodeRef ,
       attributes ,
       listeners ,
       transform , 
       transition , 
       isDragging
   
   } =  useSortable({
           id:task.id,
           data:{
               type:"Task",
               task
           },
           disabled:editMode
       })
   


       const style={
        transition,
        transform:CSS.Transform.toString(transform)
    }

    if(isDragging){
        <div 
        ref={setNodeRef}
        style={style}
        className=" bg-mainBackgroundColor
        p-2.5 h-[100px]
        min-h-[100px] flex  items-center text-left rounded-xl 
        hover:ring-2 
        hover:ring-inset
        hover:ring-rose-500
        cursor-grab relative task ">

        </div>
    }

    if(editMode ){
 return <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='
    bg-mainBackgroundColor
      p-2.5 h-[100px]
      min-h-[100px] flex  items-center text-left rounded-xl 
      hover:ring-2 
      hover:ring-inset
      hover:ring-rose-500
      cursor-grab relative task 
    '>
       <textarea 
       className='
       h-[90%]
       w-full resize-none border-none bg-transparent 
       text-white focus:outline-none
       '
       value={task.content}
        autoFocus
        placeholder='Task Content here...'
        onBlur={toggleEditMode}
        onKeyDown={e=>{
            if(e.key ==="Enter" && e.shiftKey ) toggleEditMode()
        }}
        onChange={(e) => updateTask(task.id , e.target.value)}
       />
    </div>
    }
  return (
    <div 
    ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
    onClick={toggleEditMode}
    onMouseEnter={()=> setMouseIsOver(true)}
    onMouseLeave={()=>setMouseIsOver(false)}
    className='
    bg-mainBackgroundColor
      p-2.5 h-[100px]
      min-h-[100px] flex  items-center text-left rounded-xl 
      hover:ring-2 
      hover:ring-inset
      hover:ring-rose-500
      cursor-grab relative task
    '>
        <p className='
            my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden
            whitespace-pre-wrap
        '>
        {task.content}

        </p>
       {mouseIsOver && 
        <button
        onClick={()=>{
            deleteTask(task.id)
        }}
        className='
            stroke-white absolute right-4 top-1/2 -translate-y-1/2 
            bg-columnBackgroundColor p-2 rounded
            opacity-60
            hover:opacity-100
        '><TrashIcon /></button>
       }
    </div>
  )
}

export default TaskCard