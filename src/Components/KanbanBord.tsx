/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useState } from 'react'
import PlusIcon from './Common/Icons/PlusIcon'
import { Column, Id, Task } from '../Utils'
import ColumnContainer from './Common/Cards/ColumnContainer'
import {DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import {SortableContext, arrayMove} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from './Common/Cards/TaskCard'

function KanbanBord() {
    const [columns , setColumns] = useState<Column[]>([])
    const columnsId = useMemo(()=>columns.map(col=>col.id) ,[columns])
    const [activeColumn , setActiveColumn] = useState<Column | null>(null)
    const [ activetask ,setActiveTask] = useState<Task | null>(null)
    const [tasks , setTasks ] = useState<Task[] | null>([])
    const generateId=useCallback(()=>{
        //Generate a random number between  0 and 10000
        return Math.floor(Math.random() * 10001)
      } , [])
    const createNewColums = useCallback(()=>{
    
        const columnToAdd:Column = {
            id:generateId(),
            title:`Column ${columns.length + 1}`
        }
    
        setColumns( [...columns,columnToAdd])
    
      }, [columns ,generateId])
    const deleteColumn = useCallback((id:Id)=>{
        const filteredColumn= columns.filter(col => col.id != id)
        setColumns(filteredColumn)
    } ,[columns ])

    const createTask = useCallback((columnId:Id)=>{
        const newTask : Task = {
            id:generateId(),
            columnId,
            content:`Task ${tasks.length + 1}`
        }
        setTasks([ ...tasks,newTask ])
    },[generateId , tasks])


    const updateTask= useCallback((id:Id , content:string)=>{
        const newTask = tasks?.map(task =>{
            if(task.id != id ) return task 
            return {...task , content}
        })
        setTasks(newTask)
    } , [tasks])
    const deleteTask = useCallback((id:Id)=>{
        const newTasks = tasks.filter(task => task.id != id)
        setTasks(newTasks)
    },[tasks])

    console.log("tasks" ,tasks)
    const updateColumn=(id:Id , title:string)=>{
        const newColumn = columns.map((col) => {
            
            if( col.id !== id  ) return col
            return {...col , title};
        }
    )
    setColumns(newColumn)
    } 

    const onDragStart =useCallback((event:DragStartEvent)=>{
        console.log(event)
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column)
            return
        }

        if(event.active.data.current?.type === "Task"){
            setActiveTask(event.active.data.current.task)
            return
        }
    },[])

    const onDragEnd=useCallback((event : DragEndEvent)=>{
        setActiveColumn(null)
        setActiveTask(null)
        const {active , over } = event
        if(!over) return 
        const activeColumnId = active.id
        const overColumnId = over.id
        if(activeColumnId === overColumnId) return
        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(col => col.id ===activeColumnId)
            const overColumnIndex = columns.findIndex(col=> col.id === overColumnId)

            return arrayMove(columns,activeColumnIndex ,overColumnIndex
                )
        })
        
    },[])
    const sensors = useSensors(
        useSensor(PointerSensor,{activationConstraint:{
            distance:3
        }})
    ) 


    const onDragOver =(event:DragOverEvent) => {
       const {active , over } = event
        if(!over) return 
        const activeId = active.id
        const overId = over.id
        if(activeId === overId) return
        
        const isActiveTask = active.data.current?.type ==="Task"
        const isOverATask = over.data.current?.type ==="Task"

        //Deroping A Task OVer another task 
        if(isActiveTask && isOverATask){
            setTasks(tasks => {
                const activeIndex = tasks?.findIndex(t => t.id === activeId)
                const overIndex = tasks?.findIndex(t=> t.id ===overId)

                // if(tasks[activeIndex].columnId !== tasks[overIndex].columnId){
                    tasks[activeIndex].columnId = tasks[overIndex].columnId
                // }

                return arrayMove(tasks , activeIndex , overIndex)
            })
        }
        
        //Dropoing A task over Another COlumn 


    }

  return (
    <div className="
        m-auto
        flex
        min-h-screen
        w-full 
        items-center
        justify-c
        overflow-x-auto
        overflow-y-hidden
        px-[40px]

    ">
        <DndContext
        sensors={sensors}
        onDragStart={onDragStart} onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        >
<div className="
            m-auto
            flex
            gap-4
        ">
            <div className="
            flex
            gap-4
            ">
                <SortableContext items={columnsId}>

                 {columns?.map(column => <ColumnContainer 
                 key={column.id} 
                 column={column} 
                 deleteColumn={deleteColumn}
                 updateColumn={updateColumn}
                 createTask={createTask}
                 tasks={tasks?.filter(task => task.columnId === column.id)}
                 deleteTask={deleteTask}

                 updateTask={updateTask}
                 />
                 )}
                 </SortableContext>
            </div>
           
            <button 
            onClick={()=>createNewColums()}
    className='
    h-[60px] 
    w-[350px]
    min-w-[350px]
    cursor-pointer
    rounded-lg
    bg-mainBackgroundColor
    border-2
    border-columnBackgroundColor
    p-4
    ring-rose-500
    hover:ring-2
    flex
    gap-2
    '
    >
        <PlusIcon />
        Add Coulmn</button>
        </div>
        {
            createPortal(
                 <DragOverlay>
                {activeColumn && 
                    <ColumnContainer 
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                 createTask={createTask}
                 tasks={tasks?.filter(task => task.columnId === activeColumn.id)}
                 deleteTask={deleteTask}
                 updateTask={updateTask}
                 

                    />}

                    {activetask && <TaskCard  task={activetask}  deleteTask={deleteTask} updateTask={updateTask}/>}
            </DragOverlay>,document.body
            )
        }
           
        </DndContext>
        
     
    </div>
  )


}

export default KanbanBord