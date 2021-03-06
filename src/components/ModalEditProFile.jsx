import { updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import userState from "../stored/userState";
import themeStore from "../stored/themeStore";

const ModalEditProFile = ({ profile, setProfile, setShowModal }) => {
  const [data, setData] = useState(profile);
  const [loading, setLoading] = useState(false);
  const { curentUser, setUser } = userState((state) => state);
  const theme = themeStore((state) => state.theme);

  const changeProfile = async (e) => {
    e.preventDefault();

    if (!data.displayName.trim()) return;

    setLoading(true);

    try {
      updateDoc(doc(db, `users/${profile.uid}`), {
        displayName: data.displayName,
      });

      await updateProfile(curentUser, {
        displayName: data.displayName,
      });

      setProfile(data);
      setUser({ ...curentUser, displayName: data.displayName });
      setLoading(false);
      setShowModal(false);
      toast.success("Updated profile success !");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed w-full left-0 right-0 top-0 bottom-0 flex items-center justify-center modal-edit-profile px-3"
      onClick={() => setShowModal(false)}
    >
      <div
        style={{
          backgroundColor: theme.bg_post,
          color: theme.text_color,
        }}
        className="opacity-100 w-full pb-6 max-w-[100%]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={changeProfile} className="px-3">
          <h1 className="w-full text-center mt-4 text-xl font-semibold">
            Edit profile
          </h1>
          <div className="w-full mt-4">
            <label className="text-md mb-3 block">Display Name</label>
            <input
              value={data.displayName}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              name="displayName"
              className="w-full rounded-sm p-2"
              style={{
                backgroundColor: theme.bg_color,
                color: theme.text_color,
              }}
            />
          </div>

          <div className="w-full text-center">
            <button
              disabled={loading}
              className="px-3 py-1 rounded-sm text-md mt-3"
              style={{
                backgroundColor: theme.bg_color,
                color: theme.text_color,
              }}
            >
              {loading ? "Loading..." : "Updated profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditProFile;
