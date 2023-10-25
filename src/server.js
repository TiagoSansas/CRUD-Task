import http from "http";
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

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === "GET" && url === "/task") {
    return response.end(JSON.stringify(task));
  }
});

server.listen(3333);
