import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    // useLocation гарантує перемальовування компонента при зміні маршруту
    const location = useLocation();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const isLoggedIn = !!token;
    const isAdmin = role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <Navbar expand="lg" variant="dark" sticky="top" className="navbar-military mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img
                        src="/viti.png"
                        alt="VITI Logo"
                        height="40"
                        className="me-2"
                    />
                    <span>Saepe Portal</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to="/" end>
                            Головна
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/schedule">
                            Розклад
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/gallery">
                            Галерея
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/contacts">
                            Контакти
                        </Nav.Link>

                        <div className="vr mx-2 d-none d-lg-block text-white opacity-50"></div>

                        {isLoggedIn ? (
                            <>
                                {/* Показуємо адмінку тільки якщо роль admin */}
                                {isAdmin && (
                                    <Nav.Link as={NavLink} to="/admin" className="text-warning fw-bold">
                                        Адмін-панель
                                    </Nav.Link>
                                )}

                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="ms-lg-2 mt-2 mt-lg-0"
                                    onClick={handleLogout}
                                >
                                    Вихід
                                </Button>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login" className="ms-lg-2">
                                Вхід
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;