import React from "react";
import { json } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  function logout()
  {
    localStorage.removeItem('currentUser');
    window.location.href='/login';
  }
  return (
    <div>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="/home">
            Travellers Rooms
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" ><i class="fa-solid fa-bars" style={{color:'white'}}></i></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-5">
              {user ? (
                <>
                  <h1 style={{ color: "white" }}>
                    <div class="dropdown">
                      <button
                        class="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                       <i class="fa-solid fa-user"></i> {user.name}
                      </button>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a class="dropdown-item" href="/profile">
                          Profile
                        </a>
                        <a class="dropdown-item" href="#" onClick={logout}>
                          Logout
                        </a>
                      </div>
                    </div>
                  </h1>
                </>
              ) : (
                <>
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      aria-current="page"
                      href="/register"
                    >
                      Register
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/login">
                      Login
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;