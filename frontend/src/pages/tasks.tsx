import { useEffect, useReducer, useState } from "react"
import { ButtonEdit } from "../ButtonEdit"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Trash, Trash2, Plus, Check, CheckSquare } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../hooks/use-toast";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TaskChart } from "../components/TaskChart";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  const {user}:any = useUser();
  const { toast } = useToast();
  const getTasks = async () => {
    const response = await axios.get('http://localhost:8080/tasks', {params: {email: user.primaryEmailAddress}})
    const data = await response.data
    return data
  }

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'addtask':
        toast({
          title: "Task added",
          description: "Task has been added successfully",
        })
        console.log("from action.payload",action.payload);

        return [...action.payload.task]
      case 'deletetask':
        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully",
        })
        return state.filter((i: any) => !action.payload.ids.includes(i.id))
      case 'updatetask':
        console.log("done upda",action.payload);
        toast({
          title: "Task updated",
          description: "Task has been updated successfully",
        })
        return state.map((i: any) => i.id === action.payload.id ? action.payload : i)
      case 'gettask':
        return action.payload
      case 'markasdone':
        console.log("done mark",action.payload);
        toast({
          title: "Tasks marked as done",
          description: "Selected tasks have been marked as done",
        })
        // console.log("done mark from:",action.payload.count);
        return state.map((task: any) =>{
          if(action.payload.includes(task.id)){
            return {...task, completed: true}
          }
          return task
        })
      case 'reorder':
        return action.payload
      default:
        return state
    }
   }
   const [state, dispatch] = useReducer(reducer, [])
   const [selectedTasks, setSelectedTasks] = useState<any>([]);
   useEffect(() => {
    (async() => {
        const tasks = await getTasks()
        dispatch({type: 'gettask', payload: tasks});
    })()
   }, [])

  const [form, setForm] = useState({
    title: '',
    description: ''
  });

  const handleChange = (e: any) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleDelete = async(id: any) => {
    const response = await fetch(`http://localhost:8080/tasks/deleteselected`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ids: [id]})
    });
    const data = await response.json();
    dispatch({type: 'deletetask', payload: data});
  }

  const handleSubmit = async(e: any) => {
    e.preventDefault()
    const response = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...form, email: user.primaryEmailAddress })
    })
    const data = await response.json();
    console.log(data);
    dispatch({type: 'addtask', payload: data});
    setForm({title: '', description: ''})
  }

  const handleTaskSelection = (id: any) => {
    if(selectedTasks.includes(id)){
      setSelectedTasks(selectedTasks.filter((i: any) => i !== id));
    }else{
      setSelectedTasks([...selectedTasks, id]);
    }
  }

  const handleDeleteSelected = async() => {
    if(selectedTasks.length === 0){
      toast({
        title: "No tasks selected",
        description: "Please select tasks to delete",
      })
      return;
    }
    const response = await fetch('http://localhost:8080/tasks/deleteselected', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ids: selectedTasks})
    })
    const data = await response.json();
    console.log("done delete",data);
    dispatch({type: 'deletetask', payload: data});
    setSelectedTasks([]);
  }

  const handleMarkAsDone = async() => {
    if(selectedTasks.length === 0){
      toast({
        title: "No tasks selected",
        description: "Please select tasks to mark as done",
      })
      return;
    }
    const response = await fetch('http://localhost:8080/task/markdone', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ids: selectedTasks})
    })
    const data = await response.json();
    console.log("done mark from:",data);
    dispatch({type: 'markasdone', payload: selectedTasks});
    setSelectedTasks([]);
  }

  const onDragEnd = async(result: any) => {
    if (!result.destination) return;
    const items = Array.from(state);
    const reorderedItem:any = items.find((i: any) => i.id === result.draggableId);
    if (!reorderedItem) return;
    console.log("reorderedItem", result.source.index, result.destination.index);
    console.log(result);
    items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // dispatch({type: 'reorder', payload: items});
    if(!(result.destination.droppableId === "completedTasks")) return ;
    const response = await fetch('http://localhost:8080/task/markdone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ids: [reorderedItem.id]})
      })
      const data = await response.json();
      console.log("done mark from:",data);
      dispatch({type: 'markasdone', payload: [reorderedItem.id]});
  }

  const handleSelectAll = () => {
    setSelectedTasks(state.map((task: any) => task.id));
  }

  return (
    <div className="container flex flex-col gap-8 py-8 mx-auto">
        {/* <Nav /> */}
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input type="text" placeholder="Title" value={form.title} name="title" onChange={handleChange} required />
                <Input type="text" placeholder="Description" value={form.description} name="description" onChange={handleChange} required />
                <Button type="submit" className="bg-green-700 hover:bg-green-900">
                  <Plus className="w-4 h-4 mr-2" /> Add Task
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
            </CardHeader>
            <CardContent>
              {state && state.length > 0 ? (
                <>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <div className="overflow-x-auto">
                          <Droppable droppableId="tasks">
                            {(provided) => (
                              <Table {...provided.droppableProps} ref={provided.innerRef}>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[50px]">

                                        <CheckSquare className="w-4 h-4 mr-2" onClick={handleSelectAll}/>

                                    </TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {state.filter((i: any) => !i.completed).map((i: any, index: number) => (
                                    <Draggable key={i.id} draggableId={i.id} index={index}>
                                      {(provided) => (
                                        <TableRow
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={i.completed ? "line-through text-gray-500" : ""}
                                        >
                                          <TableCell>
                                            <Checkbox
                                              onClick={() => handleTaskSelection(i.id)}
                                              checked={selectedTasks?.includes(i.id)}
                                            />
                                          </TableCell>
                                          <TableCell className="max-w-[100px] truncate">{i.title}</TableCell>
                                          <TableCell className="max-w-[100px] truncate">{i.description}</TableCell>
                                          <TableCell>{i.completed ? 'Completed' : 'Pending'}</TableCell>
                                          <TableCell>
                                            <div className="flex gap-2">
                                              <Trash2 onClick={() => handleDelete(i.id)} className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"  />
                                              <ButtonEdit dispatch={dispatch} task={i} />
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </TableBody>
                              </Table>
                            )}
                          </Droppable>
                      </div>
                      <div className="mt-8 overflow-x-auto">
                        <h2 className="mb-4 text-xl font-bold">Completed Tasks</h2>
                          <Droppable droppableId="completedTasks">
                            {(provided) => (
                              <Table {...provided.droppableProps} ref={provided.innerRef}>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[50px]">
                                      <CheckSquare className="w-4 h-4 mr-2" onClick={handleSelectAll}/>
                                    </TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {state.filter((i: any) => i.completed).map((i: any, index: number) => (
                                    <Draggable key={i.id} draggableId={i.id} index={index}>
                                      {(provided) => (
                                        <TableRow
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={i.completed ? "line-through text-gray-500" : ""}
                                        >
                                          <TableCell>
                                            <Checkbox
                                              onClick={() => handleTaskSelection(i.id)}
                                              checked={selectedTasks?.includes(i.id)}
                                            />
                                          </TableCell>
                                          <TableCell className="max-w-[100px] truncate">{i.title}</TableCell>
                                          <TableCell className="max-w-[100px] truncate">{i.description}</TableCell>
                                          <TableCell>{i.completed ? 'Completed' : 'Pending'}</TableCell>
                                          <TableCell>
                                            <div className="flex gap-2">
                                              <Trash2 onClick={() => handleDelete(i.id)} className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"  />
                                              <ButtonEdit dispatch={dispatch} task={i} />
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </TableBody>
                              </Table>
                            )}
                          </Droppable>
                      </div>
                      {selectedTasks.length > 0 && (
                        <div className="flex flex-col gap-4 mt-4 sm:flex-row">
                          <Button variant="destructive" onClick={handleDeleteSelected} className="w-full sm:w-auto">
                            <Trash className="w-4 h-4 mr-2" /> Delete Selected
                          </Button>
                          <Button variant="default" onClick={handleMarkAsDone} className="w-full sm:w-auto">
                            <Check className="w-4 h-4 mr-2" /> Mark as Done
                          </Button>
                        </div>
                      )}
                      </DragDropContext>
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="mb-4 text-lg">You have no tasks. Create a new task to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <TaskChart tasksDone={state.filter((i: any) => i.completed).length} tasksPending={state.filter((i: any) => !i.completed).length} />
      </div>
    </div>
  )
}

export default App
