import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data.complaints);
    } catch (err) {
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/complaints", { title, description, category });
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      setError("Failed to create complaint");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      setError("Failed to delete complaint");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const statusStyle = (status) => {
    if (status === "Escalated") return { border: "#B3543E", text: "#B3543E", dot: "#B3543E" };
    if (status === "Open") return { border: "#B08D57", text: "#8A6D3F", dot: "#B08D57" };
    if (status === "In Progress") return { border: "#64748B", text: "#475569", dot: "#64748B" };
    if (status === "Resolved") return { border: "#5F7A5E", text: "#4A6049", dot: "#5F7A5E" };
    return { border: "#E5E0D5", text: "#64748B", dot: "#64748B" };
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <nav className="bg-[#16233B] px-8 py-5 flex justify-between items-center">
        <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-xl font-semibold text-[#F7F4EE]">
          CampusFix
        </h1>
        <div className="flex items-center gap-5">
          <span className="text-sm text-[#F7F4EE]/70 font-mono">{user?.name} · {user?.role}</span>
          <button onClick={handleLogout} className="text-sm text-[#F7F4EE]/70 hover:text-[#F7F4EE] transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <p className="font-mono text-xs tracking-widest text-[#B08D57] uppercase mb-1">Registry</p>
            <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-2xl font-semibold text-[#16233B]">
              All Complaints
            </h2>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-[#16233B] text-[#F7F4EE] text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-[#1F3050] transition">
            {showForm ? "Cancel" : "+ New Entry"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border border-[#E5E0D5] rounded-sm p-6 mb-8">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#E5E0D5] rounded-sm px-3 py-2.5 mb-3 focus:outline-none focus:border-[#B08D57] transition"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#E5E0D5] rounded-sm px-3 py-2.5 mb-3 focus:outline-none focus:border-[#B08D57] transition"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#E5E0D5] rounded-sm px-3 py-2.5 mb-4 focus:outline-none focus:border-[#B08D57] transition"
            >
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>Wifi</option>
              <option>Furniture</option>
              <option>Cleanliness</option>
              <option>Other</option>
            </select>
            <button type="submit" className="bg-[#5F7A5E] text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-[#4A6049] transition">
              Submit Complaint
            </button>
          </form>
        )}

        {loading && <p className="text-[#64748B] text-sm">Loading...</p>}
        {error && <p className="text-[#B3543E] text-sm">{error}</p>}

        <div className="space-y-3">
          {complaints.map((c) => {
            const s = statusStyle(c.displayStatus);
            return (
              <div
                key={c.id}
                className="bg-white border border-[#E5E0D5] rounded-sm pl-5 pr-5 py-4 flex justify-between items-start"
                style={{ borderLeft: `3px solid ${s.border}` }}
              >
                <div>
                  <h3 className="font-medium text-[#16233B] mb-1">{c.title}</h3>
                  <p className="text-sm text-[#64748B] mb-2">{c.description}</p>
                  <p className="text-xs text-[#64748B] font-mono">
                    {c.category} · reported by {c.reported_by}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }}></span>
                    <span className="text-xs font-medium" style={{ color: s.text }}>{c.displayStatus}</span>
                  </div>

                  {user?.role === "admin" && (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleStatusChange(c.id, "Open")} className="text-xs px-2 py-1 border border-[#E5E0D5] rounded-sm hover:bg-[#F7F4EE] transition">Open</button>
                      <button onClick={() => handleStatusChange(c.id, "In Progress")} className="text-xs px-2 py-1 border border-[#E5E0D5] rounded-sm hover:bg-[#F7F4EE] transition">In Progress</button>
                      <button onClick={() => handleStatusChange(c.id, "Resolved")} className="text-xs px-2 py-1 border border-[#E5E0D5] rounded-sm hover:bg-[#F7F4EE] transition">Resolved</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs px-2 py-1 border border-[#B3543E] text-[#B3543E] rounded-sm hover:bg-[#B3543E]/10 transition">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {!loading && complaints.length === 0 && (
            <p className="text-[#64748B] text-sm">No complaints yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;