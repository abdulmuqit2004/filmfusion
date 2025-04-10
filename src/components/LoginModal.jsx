/**
 * LoginModal Component
 * ---------------------
 * Handles user authentication via Firebase.
 * Displays a modal with login form and error handling.
 *
 * Props:
 * - setShowLogin: Function to toggle modal visibility
 * - setLoggedInUser: Function to update parent with the authenticated user
 */

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginModal = ({ setShowLogin, setLoggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * handleLogin
   * ------------
   * Authenticates user with Firebase.
   * On success: updates parent with user object and closes modal.
   * On failure: shows error message.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoggedInUser(user);
      setShowLogin(false);
    } catch (error) {
      setError(error.message || 'Invalid credentials or user does not exist');
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => setShowLogin(false)}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Login</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => setShowLogin(false)}
          ></button>
        </header>

        <section className="modal-card-body">
          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
              />
            </div>

            <div className="field">
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>

            {error && <p className="has-text-danger">{error}</p>}

            <button
              className="button is-primary"
              type="submit"
              style={{
                backgroundColor: '#E1544B',
                borderColor: '#E1544B',
                color: 'white',
              }}
            >
              Login
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginModal;
