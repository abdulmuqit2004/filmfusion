/**
 * SystemsFlow.test.jsx
 * ---------------------
 * Full system test for user flow across the entire app.
 *
 * Simulates:
 * 1. User login via Firebase Auth
 * 2. Navigation to Favorites page
 * 3. Fetching and displaying a favorited movie
 * 4. Opening the movie details modal and verifying its content
 */

import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App.jsx';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

// Mock Firebase Authentication
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
  };
});

// Mock Firebase Firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn(),
  };
});

// Fake user session
const mockUser = {
  uid: '123',
  email: 'testuser@example.com',
  displayName: 'Test User',
};

// Fake favorited movie
const mockMovie = {
  id: '1',
  title: 'Test Movie',
  year: '2020',
  plot: 'Test Plot',
  rating: 5,
  poster: 'testposter.jpg',
};

// Simulate Firestore movie document snapshot
const mockDocSnap = {
  id: mockMovie.id,
  data: () => mockMovie,
};

describe('SystemsFlow: Login and view favorited movies', () => {
  /**
   * Setup mocks before each test
   */
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful login
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
 
    // Mock Firestore movie fetch
    collection.mockReturnValue('moviesCollection');
    getDocs.mockResolvedValue({ docs: [mockDocSnap] });

    // Mock doc ref & setDoc for favorites
    doc.mockReturnValue('mockDocRef');
    setDoc.mockResolvedValue();
  });

  test('logs in, view favorited movies, and view movie details', async () => {
    render(<App />);

    // Open login modal
    fireEvent.click(screen.getByText('Log in'));

    // Fill login form and submit
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for login to complete (checks dropdown)
    await waitFor(() => screen.getByText(/Test User/i));

    // Navigate to Favorite Movies
    fireEvent.click(screen.getByText('Favorite Movies'));

    // Wait for movie to load
    await waitFor(() => screen.getByText('Test Movie'));

    // Open movie modal
    fireEvent.click(screen.getByRole('button', { name: /Show Details/i }));

    // Confirm modal shows expected content
    expect(screen.getByText(/Test Plot/)).toBeInTheDocument();
  });
});
    // Auth: successful login mock
    signInWithEmailAndPassword