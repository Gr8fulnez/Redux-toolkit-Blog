import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewPost, fetchPosts } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { selectPostById, updatePost, deletePost } from "./postsSlice";

const AddPostForm = () => {
  const { postId } = useParams();
  console.log(postId, "here");

  const postEdit = useSelector((state) =>
    state.posts.posts.find((post) => post.id === Number(postId))
  );
  console.log(postEdit, "here3");

  // const [title, setTitle] = useState(postEdit?.title || '')
  // const [content, setContent] = useState(postEdit?.body || '')
  // debugger
  // const [userId, setUserId] = useState(postEdit?.userId || '')
  // const [requestStatus, setRequestStatus] = useState("idle");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [userId, setUserId] = useState("");
  const [requestStatus, setRequestStatus] = useState("idle");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (postId) {
      dispatch(fetchPosts(postId));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (postEdit) {
      setTitle(postEdit.title);
      setContent(postEdit.body);
      debugger;
      setUserId(postEdit.userId);
      console.log(postEdit.userId, "here set");
    }
  }, [postEdit]);

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave =
    ([title, content, userId].every(Boolean) && addRequestStatus) ||
    requestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        dispatch(addNewPost({ title, body: content, userId })).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const onUpdatePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(
          updatePost({
            id: postEdit.id,
            title,
            body: content,
            userId,
            reactions: postEdit.reactions,
          })
        ).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const onDeletePostClicked = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost({ id: postEdit.id })).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    } finally {
      setRequestStatus("idle");
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  console.log(usersOptions, "here option");

  return (
    <section>
      {postEdit ? <h2>Edit Post</h2> : <h2>Add a New Post</h2>}
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        {postEdit ? (
          <>
            <button
              type="button"
              onClick={onUpdatePostClicked}
              disabled={!canSave}
            >
              Update Post
            </button>
            <button
              className="deleteButton"
              type="button"
              onClick={onDeletePostClicked}
            >
              Delete Post
            </button>
          </>
        ) : (
          <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
            Save Post
          </button>
        )}
      </form>
    </section>
  );
};
export default AddPostForm;
