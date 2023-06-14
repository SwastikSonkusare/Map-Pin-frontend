import { useRef, useState } from "react";
import { CancelOutlined, RoomRounded } from "@material-ui/icons";
import axios from "axios";

import "./register.css";
import { validateEmail } from "../../utils";

const Register = ({ setShowAuthPop, showAuthPopUp }) => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState("");
  const initialState = {
    username: "",
    email: "",
    password: "",
  };

  const [formValidate, setFormValidate] = useState(initialState);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameRef.current.value) {
      setFormValidate({ ...formValidate, username: "Please enter a username" });
      return "";
    }

    if (!validateEmail(emailRef.current.value)) {
      setFormValidate({ ...formValidate, email: "Invalid email" });
      return "";
    }

    if (passwordRef.current.value.length < 6) {
      setFormValidate({
        ...formValidate,
        password: "Password should be greater than 6 characters",
      });
      return "";
    }

    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setFailure(false);
      setSuccess(true);
    } catch (error) {
      setFailure(error.response.data.message);
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
          />
          {formValidate.username.length ? (
            <div>{formValidate.username}</div>
          ) : (
            ""
          )}
        </div>
        <div className="login-input">
          <input name="email" type="text" placeholder="email" ref={emailRef} />
          {formValidate.email.length ? <div>{formValidate.email}</div> : ""}
        </div>
        <div className="login-input">
          <input
            name="password"
            type="password"
            placeholder="password"
            ref={passwordRef}
          />
          {formValidate.password.length ? (
            <div>{formValidate.password}</div>
          ) : (
            ""
          )}
        </div>
        <button className="authBtn register">Register</button>
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
