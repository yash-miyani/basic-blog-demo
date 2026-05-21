"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import API from "@/services/api";
import { Eye, EyeOff, Pencil, Plus, Trash } from "lucide-react";

export interface Users {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function Users() {
  const router = useRouter();

  const [users, setUsers] = useState<Users[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [role,setRole] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role!!);
    if(role !== "Admin"){
        router.push("/posts")
    }
  }, [router]);


  // Fetch users
  const getUsers = async (currentPage = page) => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/auth/all?page=${currentPage}&limit=${limit}`);
      setUsers(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setUsers([]); // no data
        setTotalPages(1);
      } else {
        setError(err?.response?.data?.message || "Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page
  useEffect(() => {
    getUsers(page);
  }, [page]);

  // Save Product
  const handleSave = async () => {
    if (!form.name || !form.email  || !form.role) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editId) await API.put(`/auth/${editId}`, form);
      else await API.post("/auth/register", form);

      setShowForm(false);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      setEditId(null);
      getUsers(1);
      setPage(1);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save users");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (p: Users) => {
    setForm({
      name: p.name,
      email: p.email,
      password: p.password,
      role: p.role,
    });
    setEditId(p._id);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      await API.delete(`/auth/${deleteId}`);
      setShowDelete(false);
      getUsers(page);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const options = [
    { name: "User", value: "User" },
    { name: "Admin", value: "admin" },
  ];

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-7xl mx-auto bg-card border border-border p-6 shadow rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <div className="flex gap-2">
            {role  === "Admin" && <button
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                 setForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "",
                });
            }}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded flex items-center gap-2 "
            >
              <Plus size={16} />
              Add
            </button>}
            {role  === "Admin" &&<button
              onClick={() => {
                router.push("/posts");
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Posts
            </button>}
            <button
              onClick={logout}
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-danger mb-2 text-center">{error}</p>}

        {/* Table */}
        <table className="w-full border border-border">
          <thead className="bg-bg">
            <tr>
              <th className="p-2 border border-border">Title</th>
              <th className="p-2 border border-border">Email</th>
              <th className="p-2 border border-border">Role</th>
              {role  === "Admin" && <th className="p-2 border border-border">Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((p) => (
                <tr key={p._id}>
                  <td className="p-2 border border-border text-center">{p.name}</td>
                  <td className="p-2 border border-border text-center">{p.email}</td>
                  <td className="p-2 border border-border text-center">{p.role}</td>
                  {role === "Admin" && <td className="p-2 border border-border text-center ">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-warning px-1 py-1 mr-2 rounded text-white cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(p._id);
                          setShowDelete(true);
                        }}
                        className="bg-danger text-white px-1 py-1 rounded cursor-pointer"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? "Edit User" : "Add User"}
      >
        <input
          className="border border-border bg-bg text-text p-2 w-full mb-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border border-border bg-bg text-text p-2 w-full mb-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="relative my-1">
          <input
            type={showPassword ? "text" : "password"}
            className="border border-border bg-bg p-2 w-full rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-2 top-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <select
          value={form?.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border border-border bg-bg p-2 w-full rounded outline-none focus:ring-2 focus:ring-primary my-2"
        >
          <option value="">Choose a role</option>
          {options.map((option, index) => (
            <option key={index} value={option?.value}>
              {option?.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-white w-full p-2 rounded cursor-pointer"
          disabled={!form.name || !form.email || !form.role}
        >
          Save
        </button>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Confirm Delete"
      >
        <p className="mb-4">Are you sure?</p>
        <button
          onClick={handleDelete}
          className="bg-danger text-white w-full p-2 rounded cursor-pointer"
        >
          Delete
        </button>
      </Modal>
    </div>
  );
}
