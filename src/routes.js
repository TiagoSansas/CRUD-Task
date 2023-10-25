import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-rout-path.js";

const database = new Database();
export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
            }
          : null
      );
      return response.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Titulo e obrigatorio" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Descrição e obrigatorio" }));
      }

      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        updated_at: new Date(),
        created_at: new Date(),
      };
      database.insert("tasks", newTask);
      return response.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      if (!title || !description) {
        return response
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Titulo e descrição são requeridas" })
          );
      }

      const [task] = database.select("tasks", { id });

      if (!task) {
        return response.writeHead(404).end();
      }

      database.update("tasks", id, {
        title,
        description,
        updated_at: new Date(),
      });

      return response.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      database.delete("tasks", id);
      return response.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return response.writeHead(404).end();
      }

      const isTaskCompleted = !!task.completed_at;
      const completed_at = isTaskCompleted ? null : new Date();

      database.update("tasks", id, { completed_at });

      return response.writeHead(204).end();
    },
  },
];
