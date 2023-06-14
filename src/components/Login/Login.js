import { useRef, useState } from "react";
import { CancelOutlined, RoomRounded } from "@material-ui/icons";
import "./login.css";
import axios from "axios";
import { validateEmail } from "../../utils";

import { toast } from "react-toastify";

const Login = ({ setShowAuthPop, showAuthPopUp, setCurrentUser }) => {
  const initialState = {
    email: "",
    password: "",
  };

  const [formValidate, setFormValidate] = useState(initialState);
  const [failure, setFailure] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();

  const notify = () => toast("You are successfully signed in!");

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const {
        data: { result },
      } = await axios.post("/users/login", user);
      window.localStorage.setItem("Username", result.username);
      setCurrentUser(result.username);
      setFailure(false);
      notify();
      setShowAuthPop({ ...showAuthPopUp, login: false, register: false });
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
        <button className="authBtn">Login</button>

        {failure.length ? <span className="failure">{failure}</span> : ""}
      </form>
      <CancelOutlined
        fontSize="large"
        className="loginCancel"
        onClick={() => setShowAuthPop({ ...showAuthPopUp, login: false })}
      />
    </div>
  );
};

export default Login;
