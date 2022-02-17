import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { fetchPost } from "../action/postAction";
import CommentLIst from "../components/CommentLIst";
import { db } from "../config/firebase";
import userState from "../stored/userState";
import { fetchComments } from "../action/postAction";
import { updateDoc, doc } from "firebase/firestore";
import { createDoc } from "../action/firebaseAction";

const DetailPost = () => {
  const { id } = useParams();
  const location = useLocation();

  const [postDetails, setPostDetails] = useState({});
  const curentUser = userState((state) => state.curentUser);
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    async function getDetailsPost() {
      try {
        const data = await fetchPost(id);
        setPostDetails(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    setLoading(true);
    getDetailsPost();
  }, [id]);

  useEffect(() => {
    async function getComment(id) {
      const data = await fetchComments(id);
      setCommentList(data);
    }

    getComment(id);
  }, [id]);

  const navigate = useNavigate();

  if (!curentUser)
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      />
    );

  const handleAddComment = async (e) => {
    e.preventDefault();

    // check value comment trước khi post
    if (!comment.trim()) return;

    setLoadingComment(true);

    // Khởi tạo obj new comment
    const newComment = {
      postId: postDetails.id,
      photoURL: curentUser.photoURL,
      content: comment,
      displayName: curentUser.displayName,
      userId: curentUser.uid,
    };

    try {
      // thêm comment vào db
      const res = await createDoc("comments", newComment);

      // cập nhật lại tổng comment ở bảng posts
      updateDoc(doc(db, `posts/${id}`), {
        comment: postDetails.comment + 1,
      });

      // cập nhật lại tổng comment của post ở ui
      setPostDetails({ ...postDetails, comment: postDetails.comment + 1 });

      // reset form comment
      setCommentList([...commentList, res]);
      setComment("");

      setLoadingComment(false);
    } catch (error) {
      setLoadingComment(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="dashed-loading"></div>
      </div>
    );

  return (
    <div>
      <>
        <div>
          <div className="px-4 py-2 fixed top-0 bg-slate-800 w-full opacity-[0.5]">
            <button onClick={() => navigate("/")}>
              <i className="text-2xl text-white bx bx-arrow-back"></i>
            </button>
          </div>
          <img
            className="object-cover w-full"
            src={postDetails?.image}
            alt=""
          />
          <div className="w-full px-4 flex items-center justify-between pt-4">
            <div className="flex items-center">
              <img
                src={postDetails?.photoURL}
                className="w-[50px] rounded-full object-cover"
                alt=""
              />
              <p className="text-xl ml-3">{postDetails?.displayName}</p>
            </div>
            <div>
              <i
                className={`text-2xl bx bxs-heart ${
                  postDetails.like &&
                  postDetails.like.some((p) => p === curentUser.uid)
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              ></i>
              <i className="text-slate-500 text-2xl bx bx-share ml-6"></i>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <p className="text-sm">{postDetails?.title}</p>
        </div>

        <form
          onSubmit={handleAddComment}
          className="bg-white py-3 px-4 flex items-center bottom-0 fixed left-0 w-full"
        >
          <img
            className="w-[40px] rounded-full object-cover"
            src={curentUser?.photoURL}
            alt=""
          />
          <input
            placeholder="Write comment here..."
            className="rounded-full w-[80%] ml-4 px-6 py-1 bg-slate-300 outline-none"
            type={"text"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="ml-3">
            {loadingComment ? (
              <h3 className="text-xs text-slate-400">Loading...</h3>
            ) : (
              <i className="text-slate-400 text-2xl bx bx-send"></i>
            )}
          </button>
        </form>
      </>

      <CommentLIst commentList={commentList} />
    </div>
  );
};

export default DetailPost;
