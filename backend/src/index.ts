import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/tasks", async(req, res) => {
    const { email } = req.query;
    console.log("hi bro over here: ", email);

    const tasks = await prisma.task.findMany({
        where: {
            user: {
                email: email as string
            }
        }
    });
    res.json(tasks);
})

app.post("/newuser", async (req, res) => {
    const { name, email } = req.body;
    console.log(email.emailAddress);
    try {
        const user = await prisma.user.create({
            data: {
            name: name,
            email: email.emailAddress
        }
    })
    res.json(user);
    } catch (error) {
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email.emailAddress,
                tasks: {
                    create: {
                        title: "Welcome to the app",
                        description: "This is the first task"
                    }
                }
            }
        })
        res.json(newUser);

    }
})

app.post("/createuser", async (req, res) => {
    const user = await prisma.user.create({
        data: {
            name: "Spashwin",
            email: "spashwin.s.p3@gmail.com"
        }
    });

    return res.json({mes: "done"})
})

app.post("/tasks", async(req, res) => {
    const { title, description, email } = req.body;
    try {
        const task = await prisma.user.update({
        where: {
            email: email.emailAddress
        },
        data: {
            tasks: {
                create: { title, description}
            }
        },
        include: {
            tasks: true
        }
        })
        console.log(task);

        res.json({task: task.tasks});
    } catch (error) {
        const newUser = await prisma.user.create({
            data: {
                name: "someone",
                email: email.emailAddress,
                tasks: {
                    create: {
                        title: title,
                        description: description
                    }
                }
            },
            include: {
                tasks: true
            }
        })
        res.json({task: newUser.tasks});
    }
});

app.put("/tasks/:id", async(req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const task = await prisma.task.update({
        where: { id },
        data: {
            title,
            description
        }
    })
    res.json(task);
});

app.put("/task/markdone", async(req, res) => {
    const { ids } = req.body;
    console.log(ids);

    const tasks = await prisma.task.updateMany({
        where: { id: { in: ids } },
        data: { completed: true }
    });
    console.log(tasks);

    res.json(tasks);
});

app.delete("/tasks/deleteselected", async(req, res) => {
    const { ids } = req.body;
    console.log(ids);
    const deletedTasks = await prisma.task.deleteMany({
        where: {
            id: {
                in:ids
            }
        }
    })
    return res.json({ ids });

})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
