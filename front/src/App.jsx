import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

// Компоненты
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Страницы
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const NotFound = () => <div className="container mt-5 text-center"><h2>404 - Сторінку не знайдено</h2></div>;

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header />

                <main className="flex-grow-1">
                    <Routes>
                        {/* Публичный маршрут */}
                        <Route path="/login" element={<Login />} />

                        {/* Приватные (защищенные) маршруты */}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/schedule"
                            element={
                                <PrivateRoute>
                                    <Schedule />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/gallery"
                            element={
                                <PrivateRoute>
                                    <Gallery />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/contacts"
                            element={
                                <PrivateRoute>
                                    <Contacts />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;