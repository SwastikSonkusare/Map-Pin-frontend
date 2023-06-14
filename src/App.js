import React, { useEffect, useState } from "react";
import axios from "axios";

import Map, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import { format } from "timeago.js";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

import { toast } from "react-toastify";
import "mapbox-gl/dist/mapbox-gl.css";
import Loader from "./components/Loader/Loader";

const App = () => {
  const notify = () => toast("Added a new pin!");

  const initialState = {
    title: "",
    review: "",
    rating: "",
  };

  const [viewport, setViewPort] = useState({
    latitude: 19.038028540186808,
    longitude: 72.89504195198305,
    zoom: 14,
    width: "100vw",
    height: "100vh",
  });

  const [currentUser, setCurrentUser] = useState("");
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showPopup, setShowPopup] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthPopUp, setShowAuthPop] = useState({
    login: false,
    register: false,
  });
  const [formData, setFormData] = useState(initialState);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id.toString());

    setViewPort({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    if (currentUser === null) {
      toast("You need to login first to add a new pin");
      return "";
    }

    const longitude = e.lngLat.lng;
    const latitude = e.lngLat.lat;
    setNewPlace({
      lat: latitude,
      lng: longitude,
    });
    setShowPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const newPin = {
      username: currentUser,
      title: formData.title,
      description: formData.review,
      rating: formData.rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      const {
        data: { result },
      } = await axios.post(
        "https://mappin-backend-k3ff.onrender.com/api/pins",
        newPin
      );
      setPins([...pins, result]);
      setNewPlace(null);
      setFormData(initialState);
      setShowPopup(false);
      notify();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("Username");
    setCurrentUser(null);
    toast("You are logged out succesfully!");
  };

  useEffect(() => {
    setCurrentUser(window.localStorage.getItem("Username"));
  }, []);

  useEffect(() => {
    const getPins = async () => {
      try {
        const {
          data: { result },
        } = await axios.get(
          "https://mappin-backend-k3ff.onrender.com/api/pins"
        );

        setPins(result);
      } catch (error) {
        console.log(error);
      }
    };

    getPins();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", zIndex: 9999 }}>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={(e) =>
          setViewPort({
            longitude: e.viewState.longitude,
            latitude: e.viewState.latitude,
            zoom: e.viewState.zoom,
          })
        }
        onDblClick={handleAddClick}
      >
        {pins?.length &&
          pins.map((p, id) => (
            <div key={id}>
              <Marker
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              >
                <Room
                  style={{
                    fontSize: 5 * viewport.zoom,
                    color: p.username === currentUser ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                />
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  longitude={p.long}
                  latitude={p.lat}
                  anchor="bottom"
                  onClose={() => setCurrentPlaceId("")}
                  closeOnClick={false}
                >
                  <div className="card">
                    <label>Title</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p>{p.description}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(p.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </div>
          ))}
        {showPopup && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            closeOnClick={true}
          >
            <form>
              <label>Title</label>
              <input
                name="title"
                type="text"
                placeholder="Enter a title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <label>Review</label>
              <textarea
                name="review"
                type="text"
                placeholder="Enter a review"
                onChange={(e) =>
                  setFormData({ ...formData, review: e.target.value })
                }
              />
              <label>Rating</label>
              <select
                name="rating"
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <button
                className="submitButton"
                type="submit"
                onClick={handleSubmit}
              >
                {loading ? <Loader /> : "Add Pin"}
              </button>
            </form>
          </Popup>
        )}
        <div className="buttons">
          {currentUser ? (
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <button
                className="button login"
                onClick={() =>
                  setShowAuthPop({
                    ...showAuthPopUp,
                    login: true,
                    register: false,
                  })
                }
              >
                Login
              </button>
              <button
                className="button register"
                onClick={() =>
                  setShowAuthPop({
                    ...showAuthPopUp,
                    login: false,
                    register: true,
                  })
                }
              >
                Register
              </button>
            </>
          )}
        </div>
        {showAuthPopUp.register && (
          <Register
            setShowAuthPop={setShowAuthPop}
            showAuthPopUp={showAuthPopUp}
          />
        )}
        {showAuthPopUp.login && (
          <Login
            setShowAuthPop={setShowAuthPop}
            showAuthPopUp={showAuthPopUp}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  );
};

export default App;
