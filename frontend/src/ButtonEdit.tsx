import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Edit } from "lucide-react"
import { useState } from "react"
import { useToast } from "./hooks/use-toast"

export function ButtonEdit({task, dispatch}: {task: any, dispatch: any}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState(task);

  const handleEdit = async() => {
    if(form.title && form.description){
      const response = await fetch(`http://localhost:8080/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const data = await response.json();
      dispatch({type: 'updatetask', payload: data})
      toast({
        title: 'Task updated',
        description: 'Your task has been updated',
        variant: 'default'
      })
      setOpen(false); // Close the dialog after saving changes
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="h-6 w-6 cursor-pointer text-primary" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Task
            </Label>
            <Input
              id="name"
              defaultValue={task.title}
              className="col-span-3"
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="username"
              defaultValue={task.description}
              className="col-span-3"
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEdit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
