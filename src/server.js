import http from "node:http";
import { randomUUID } from "node:crypto";
import { json } from "../middlewares/json.js";
const task = [
  {
    title: "Task 01",
    description: "Descrição da Task 01",
  },
  {
    title: "Task 02",
    description: "Descrição da Task 02",
  },
];

const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  await json(request, response);

  if (method === "GET" && url === "/task") {
    return response.end(JSON.stringify(task));
  }
  if (method === "POST" && url === "/task") {
    const { title, description } = request.body;
    const newTask = {
      id: randomUUID(),
      title,
      description,
    };
    task.push(newTask);
    return response.writeHead(201).end();
  }
});

server.listen(3333);
