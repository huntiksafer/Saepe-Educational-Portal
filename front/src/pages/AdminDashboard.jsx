import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        title: '', description: '', date: '', type: 'news', image: ''
    });
    const [eventsList, setEventsList] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Хелпер для заголовка авторизації
    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // --- БЕЗПЕКА І ЗАВАНТАЖЕННЯ ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        // 1. Перевірка авторизації
        if (!token) {
            navigate('/login');
            return;
        }

        // 2. Перевірка прав Адміністратора
        if (role !== 'admin') {
            console.warn('Access denied: User is not an admin.');
            navigate('/'); // Перенаправляємо звичайних користувачів на Головну
            return;
        }

        fetchEvents();
        // eslint-disable-next-line
    }, [navigate]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events', getAuthHeader());
            setEventsList(response.data);
        } catch (err) {
            console.error('Error fetching events:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    // --- ДОДАВАННЯ ПОДІЇ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await axios.post('http://localhost:5000/api/events', eventData, getAuthHeader());
            setMessage({ type: 'success', text: 'Подію успішно додано!' });
            setEventData({ title: '', description: '', date: '', type: 'news', image: '' });
            fetchEvents(); // Обновление списка
        } catch (err) {
            console.error('Error adding event:', err);
            setMessage({ type: 'danger', text: 'Помилка при збереженні.' });
        }
    };

    // --- ВИДАЛЕННЯ ПОДІЇ ---
    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей запис?')) return;

        try {
            // Надсилання DELETE запиту з токеном
            await axios.delete(`http://localhost:5000/api/events/${id}`, getAuthHeader());

            // Оновлення інтерфейсу
            setMessage({ type: 'success', text: 'Подію видалено.' });
            fetchEvents();
        } catch (err) {
            console.error('Error deleting:', err);
            setMessage({ type: 'danger', text: 'Не вдалося видалити подію. Спробуйте пізніше.' });
        }
    };

    return (
        <Container className="mb-5">
            <h2 className="mb-4 border-bottom pb-2">Адмін-панель</h2>

            {/* ФОРМА ДОДАВАННЯ */}
            <Row className="mb-5">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light text-military fw-bold">Додати нову подію</Card.Header>
                        <Card.Body>
                            {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Заголовок</Form.Label>
                                            <Form.Control type="text" name="title" value={eventData.title} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Тип</Form.Label>
                                            <Form.Select name="type" value={eventData.type} onChange={handleChange}>
                                                <option value="news">Новини</option>
                                                <option value="schedule">Розклад</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Опис</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="description" value={eventData.description} onChange={handleChange} required />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Дата</Form.Label>
                                            <Form.Control type="datetime-local" name="date" value={eventData.date} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Зображення URL</Form.Label>
                                            <Form.Control type="text" name="image" value={eventData.image} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">Зберегти</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* СПИСОК ПОДІЙ */}
            <Row>
                <Col>
                    <h4 className="mb-3 text-military">Список подій</h4>
                    <div className="table-responsive bg-white shadow-sm rounded">
                        <Table hover className="mb-0 align-middle">
                            <thead className="bg-light">
                            <tr>
                                <th>Дата</th>
                                <th>Заголовок</th>
                                <th>Тип</th>
                                <th className="text-end">Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {eventsList.map(event => (
                                <tr key={event.id || event._id}>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="fw-bold">{event.title}</td>
                                    <td><Badge bg="secondary">{event.type}</Badge></td>
                                    <td className="text-end">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(event.id || event._id)}
                                        >
                                            Видалити
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {eventsList.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-3">Подій не знайдено</td></tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;