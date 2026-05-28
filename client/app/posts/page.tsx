"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import API from "@/services/api";
import { Pencil, Plus, Trash } from "lucide-react";
import AdComponent from "@/components/AdComponent";

export interface Product {
  _id: string;
  title: string;
  description: string;
}

export default function Posts() {
  const router = useRouter();

  const [posts, setPosts] = useState<Product[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  const [role, setRole] = useState("");
  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role!!);
  }, [router]);

  // Fetch posts
  const getPosts = async (currentPage = page) => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/posts?page=${currentPage}&limit=${limit}`);
      setPosts(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setPosts([]); // no data
        setTotalPages(1);
      } else {
        setError(err?.response?.data?.message || "Failed to load posts");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page
  useEffect(() => {
    getPosts(page);
  }, [page]);

  // Save Product
  const handleSave = async () => {
    if (!form.title || !form.description) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editId) await API.put(`/posts/${editId}`, form);
      else await API.post("/posts", form);

      setShowForm(false);
      setForm({ title: "", description: "" });
      setEditId(null);
      getPosts(1);
      setPage(1);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save posts");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (p: Product) => {
    setForm({ title: p.title, description: p.description });
    setEditId(p._id);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      await API.delete(`/posts/${deleteId}`);
      setShowDelete(false);
      getPosts(page);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete posts");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <AdComponent adSlot="1033173712" />
      <div className="max-w-7xl mx-auto bg-card border border-border p-6 shadow rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Posts</h2>
          <div className="flex gap-2">
            {role === "Admin" && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditId(null);
                  setForm({ title: "", description: "" });
                }}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded flex items-center gap-2 "
              >
                <Plus size={16} />
                Add
              </button>
            )}
            {role === "Admin" && (
              <button
                onClick={() => {
                  router.push("/users");
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Users
              </button>
            )}
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
              <th className="p-2 border border-border">description</th>
              {role === "Admin" && (
                <th className="p-2 border border-border">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No posts found
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p._id}>
                  <td className="p-2 border border-border">{p.title}</td>
                  <td className="p-2 border border-border">{p.description}</td>
                  {role === "Admin" && (
                    <td className="p-2 border border-border text-center ">
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
                    </td>
                  )}
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
        modelClassName="w-138"
      >
        <input
          className="border border-border bg-bg text-text p-2 w-full mb-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          rows={5}
          className="border border-border bg-bg text-text p-2 w-full mb-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-white w-full p-2 rounded cursor-pointer"
          disabled={!form.title || !form.description}
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
