import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Collapse } from "react-bootstrap";
import "./addpost.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/userContext";

export default function AddPost() {
  const context = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postItems, setPostItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [updatePostTitle, setUpdatePostTitle] = useState("");
  const [updatePostText, setUpdatePostText] = useState("");

  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          alert("You must login!");
        }
        return error;
      }
    );
    event.preventDefault();
    const post = {
      title: postTitle?.toString().trim() ?? "",
      text: postText?.toString().trim() ?? "",
    };
    const addPostform = event.currentTarget;
    console.log(addPostform.checkValidity());

    setValidated(true); // Aktivera felmeddelanden

    if (addPostform.checkValidity() === false) {
      // Inte valid, avbryt
      event.stopPropagation();
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/post/", post, {
        withCredentials: true,
      });

      if (res.error?.title) {
        throw new Error(res.error.title.message);
      }

      if (res.error?.text) {
        throw new Error(res.error.text.message);
      }

      if (!res.data) {
        throw new Error("No data in response");
      }

      setPostItems((prev) => [...prev, res.data]);
      setPostTitle("");
      setPostText("");
      getPosts();
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const deletePostRes = async (id) => {
    const res = await axios
      .delete(`http://localhost:4000/post/${id}`, {
        withCredentials: true,
      })
      .then((response) => response)
      .catch(function (error) {
        if (error.response.status === 401) {
          toast.warn("That is not your post!");
        }
      });
    return res.data;
  };
  const deletePost = async (id) => {
    try {
      const response = await deletePostRes(id);
      console.log(response.status);
      const newPostItems = postItems.filter((item) => item._id !== id);
      setPostItems(newPostItems);
      toast.success("Post deleted!");
    } catch (err) {
      console.log(err);
    }
  };

  const updatedPost = {
    title: updatePostTitle,
    text: updatePostText,
  };

  const updatePostRes = async (e) => {
    const res = await axios
      .put(`http://localhost:4000/post/${isUpdating}`, updatedPost, {
        withCredentials: true,
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          toast.warn("That is not your post!");
        }
      });
    return res.data;
  };
  const updatePost = async (e) => {
    e.preventDefault();
    try {
      await updatePostRes();
      setUpdatePostText("");
      setUpdatePostTitle("");
      setIsUpdating("");
      getPosts();

      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const getPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/post/all/", {
        withCredentials: true,
      });
      setPostItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  // Form that updates the posts
  const renderUpdateForm = () => (
    <Form
      className="formAddPost"
      noValidate
      validated={validated}
      onSubmit={updatePost}
    >
      <Row className="md-3">
        <Form.Group as={Col} md="12" controlId="validation1">
          <Form.Label className="fs-5">Title</Form.Label>
          <Form.Control
            size="lg"
            required
            type="text"
            placeholder="New title"
            onChange={(e) => {
              setUpdatePostTitle(e.target.value);
            }}
            value={updatePostTitle}
          />
          <Form.Control.Feedback type="invalid">
            write a title
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="md-3">
        <Form.Group as={Col} md="12" controlId="validation2">
          <Form.Label className="fs-5">
            Update your post with new title and text.
          </Form.Label>
          <Form.Control
            size="lg"
            required
            as="textarea"
            placeholder="New text"
            type="text"
            onChange={(e) => {
              setUpdatePostText(e.target.value);
            }}
            value={updatePostText}
          />
          <Form.Control.Feedback type="invalid">
            Missing information
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button className="addBtn" variant="success" type="submit">
        Edit
      </Button>
    </Form>
  );
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="success"
        className="newBtn"
      >
        New ad
      </Button>
      <Collapse in={open}>
        {/* Form for add a post */}
        <div id="example-collapse-text" className="addPostContainer">
          <Form
            className="formAddPost"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Row className="md-3">
              <Form.Group as={Col} md="12" controlId="validation1">
                <Form.Label className="fs-5">Title</Form.Label>
                <Form.Control
                  size="lg"
                  required
                  type="text"
                  placeholder="Titel"
                  onChange={(e) => {
                    setPostTitle(e.target.value);
                  }}
                  value={postTitle}
                />
                <Form.Control.Feedback type="invalid">
                  Write a title
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="md-3">
              <Form.Group as={Col} md="12" controlId="validation2">
                <Form.Label className="fs-5">
                  Looking for new car? please provide information what you
                  looking for
                </Form.Label>
                <Form.Control
                  size="lg"
                  required
                  as="textarea"
                  placeholder="Information..."
                  type="text"
                  onChange={(e) => {
                    setPostText(e.target.value);
                  }}
                  value={postText}
                />
                <Form.Control.Feedback type="invalid">
                  Missing information
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button className="addBtn" variant="success" type="submit">
              Add
            </Button>
          </Form>
        </div>
      </Collapse>
      <div>
        {postItems
          .filter((post) => post)
          .map((post) => (
            <div className="postContainer">
              {isUpdating === post._id ? (
                renderUpdateForm()
              ) : (
                <>
                  <div className="posts">
                    {context.isLoggedIn &&
                    post.user?._id === context.isLoggedIn._id ? (
                      <div className="interactIcons">
                        <p
                          onClick={() => {
                            setIsUpdating(post._id);
                          }}
                          className="remove-btn"
                        >
                          🖊
                        </p>
                        <p
                          onClick={() => {
                            deletePost(post._id);
                          }}
                          className="remove-btn"
                        >
                          ❌
                        </p>
                      </div>
                    ) : undefined}
                    <h5>Username: {post.user?.username}</h5>
                    <h4>{post.title}</h4>
                    <p>{post.text}</p>
                    <p className="postDate">{today.toLocaleDateString()}</p>
                    <h6>Contact: {post.user?.email}</h6>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
