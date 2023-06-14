import { useRef, useState } from "react";
import axios from "axios";

import Loader from "../Loader/Loader";
import { validateEmail } from "../../utils";

import { CancelOutlined, RoomRounded } from "@material-ui/icons";

import "./register.css";

const Register = ({ setShowAuthPop, showAuthPopUp }) => {
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState(false);
  const initialState = {
    username: "",
    email: "",
    password: "",
  };

  const [formValidate, setFormValidate] = useState(initialState);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleChange = () => {
    setFormValidate({ ...formValidate, username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    if (!usernameRef.current.value) {
      setFormValidate({ ...formValidate, username: "Please enter a username" });
      setLoading(false);
      return "";
    }

    if (!validateEmail(emailRef.current.value)) {
      setFormValidate({ ...formValidate, email: "Invalid email" });
      setLoading(false);
      return "";
    }

    if (passwordRef.current.value.length < 6) {
      setFormValidate({
        ...formValidate,
        password: "Password should be greater than 6 characters",
      });
      setLoading(false);
      return "";
    }

    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post(
        "https://mappin-backend-k3ff.onrender.com/api/users/register",
        newUser
      );
      setFailure(false);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setFailure(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomRounded fontSize="large" />
        Map-Pin
      </div>
      <form onSubmit={handleSubmit}>
        <div className="login-input">
          <input
            name="username"
            type="text"
            placeholder="username"
            ref={usernameRef}
            onChange={handleChange}
          />
          {formValidate.username.length ? (
            <div>{formValidate.username}</div>
          ) : (
            ""
          )}
        </div>
        <div className="login-input">
          <input
            name="email"
            type="text"
            placeholder="email"
            ref={emailRef}
            onChange={handleChange}
          />
          {formValidate.email.length ? <div>{formValidate.email}</div> : ""}
        </div>
        <div className="login-input">
          <input
            name="password"
            type="password"
            placeholder="password"
            ref={passwordRef}
            onChange={handleChange}
          />
          {formValidate.password.length ? (
            <div>{formValidate.password}</div>
          ) : (
            ""
          )}
        </div>
        <button className="authBtn register">
          {loading ? <Loader /> : "Register"}
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {failure.length ? <span className="failure">{failure}</span> : ""}
      </form>
      <CancelOutlined
        fontSize="large"
        className="registerCancel"
        onClick={() => setShowAuthPop({ ...showAuthPopUp, register: false })}
      />
    </div>
  );
};

export default Register;
