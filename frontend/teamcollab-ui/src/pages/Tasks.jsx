import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../layouts/Sidebar";

function Tasks() {

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchMembers = async (id) => {
    const res = await API.get(`/projects/${id}`);
    setMembers(res.data.members);
  };

  const fetchTasks = async (id) => {
    const res = await API.get(`/tasks/project/${id}`);
    setTasks(res.data);
  };

  const createTask = async (e) => {
    e.preventDefault();

    await API.post(
      `/tasks?projectId=${projectId}&userId=${userId}`,
      {
        title,
        description
      }
    );

    fetchTasks(projectId);

    setTitle("");
    setDescription("");
  };

  return (

    <div className="flex">

      <Sidebar />

      <div className="p-6 w-full bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-4">
          Tasks
        </h1>

        <form
          onSubmit={createTask}
          className="bg-white p-6 rounded shadow mb-6"
        >

          <select
            className="w-full p-2 border mb-3"
            onChange={(e) => {
              setProjectId(e.target.value);
              fetchMembers(e.target.value);
              fetchTasks(e.target.value);
            }}
          >

            <option>Select Project</option>

            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}

          </select>

          <select
            className="w-full p-2 border mb-3"
            onChange={(e) => setUserId(e.target.value)}
          >

            <option>Select Team Member</option>

            {members?.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}

          </select>

          <input
            placeholder="Task Title"
            className="w-full p-2 border mb-3"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full p-2 border mb-3"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Task
          </button>

        </form>

        <div className="grid grid-cols-3 gap-4">

          {tasks.map(task => (

            <div
              key={task.id}
              className="bg-white p-4 shadow rounded"
            >

              <h3 className="font-bold">
                {task.title}
              </h3>

              <p>{task.description}</p>

              <p className="mt-2 text-sm">
                Status: {task.status}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default Tasks;