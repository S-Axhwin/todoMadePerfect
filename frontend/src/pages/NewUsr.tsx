import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

const NewUsr = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: '',
    email: user?.primaryEmailAddress || ''
  });

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/newuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
  }
  return (
    <form onSubmit={handleSubmit}>
        <Input onChange={(e) => setForm({...form, name: e.target.value})}/>
        <Button type="submit">Submit</Button>
    </form>
  )
}

export default NewUsr
