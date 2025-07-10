"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, UpdateUser } from "@/store/slices/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";

export default function UpdateProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    parentEmail: "",
    phone: "",
    experienceYears: "",
    id: "",
  });

  const [parentName, setParentName] = useState("");

  useEffect(() => {
    if (user && user.id !== userId) {
      toast.error("You are not authorized to edit this profile");
      router.replace("/home");
    } else {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "",
        parentEmail: user?.parentDetail?.user?.email || user?.parentEmail || "",
        phone: user?.phone || "",
        experienceYears: user?.experienceYears?.toString() || "",
      });

      if (user?.role === "STUDENT" && user?.parent?.email) {
        setParentName(user?.parentDetail?.user?.name || "No-Parent");
      }
    }
  }, [user, userId]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setFormData({ ...formData, ["id"]: user.id });
      const res = await dispatch(UpdateUser(formData));
      // console.log(res);
      if (res && res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <HeaderBar />
      <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 max-w-md w-full shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Update Profile
        </h1>

        {user?.role === "STUDENT" && (
          <p className="text-white text-sm mb-4 text-center">
            Parent: <span className="font-semibold">{parentName || "N/A"}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none"
              placeholder="Your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 cursor-not-allowed"
            />
          </div>

          {/* Conditional Fields */}
          {formData.role === "STUDENT" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Parent Email
              </label>
              <input
                type="text"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none"
                placeholder="Parent Email ID"
              />
            </div>
          )}

          {(formData.role === "TEACHER" || formData.role === "PARENT") && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none"
                placeholder="Phone number"
              />
            </div>
          )}

          {formData.role === "TEACHER" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none"
                placeholder="e.g. 5"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" /> Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
