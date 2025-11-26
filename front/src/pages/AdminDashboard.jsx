import React, { useState, useEffect } from 'react';
import api from '../api'; // Імпортуємо централізований API
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        title: '', description: '', date: '', type: 'news', image: '', isTopNews: false
    });
    const [eventsList, setEventsList] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

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
            // Тепер api.js сам додасть токен і базову адресу
            const response = await api.get('/api/events');
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
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setEventData({ ...eventData, [e.target.name]: value });
    };

    // --- ДОДАВАННЯ ПОДІЇ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            // Використовуємо api.post без ручних заголовків
            await api.post('/api/events', eventData);
            setMessage({ type: 'success', text: 'Подію успішно додано!' });
            // Очищаємо форму
            setEventData({ title: '', description: '', date: '', type: 'news', image: '', isTopNews: false });
            fetchEvents(); // Оновлення списку
        } catch (err) {
            console.error('Error adding event:', err);
            setMessage({ type: 'danger', text: 'Помилка при збереженні.' });
        }
    };

    // --- ВИДАЛЕННЯ ПОДІЇ ---
    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей запис?')) return;

        try {
            // Надсилання DELETE запиту через api
            await api.delete(`/api/events/${id}`);

            // Оновлення інтерфейсу
            setMessage({ type: 'success', text: 'Подію видалено.' });
            fetchEvents();
        } catch (err) {
            console.error('Error deleting:', err);
            setMessage({ type: 'danger', text: 'Не вдалося видалити подію. Можливо, у вас немає прав.' });
        }
    };

    return (
        <Container className="mb-5">
            <h2 className="mb-4 border-bottom pb-2" style={{ color: '#4B5320' }}>Адмін-панель</h2>

            {/* ФОРМА ДОДАВАННЯ */}
            <Row className="mb-5">
                <Col md={12}>
                    <Card className="shadow-sm military-card-border">
                        <Card.Header className="military-card-header text-white fw-bold" style={{ backgroundColor: '#4B5320' }}>
                            Додати нову подію
                        </Card.Header>
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
                                        <Form.Group className="mb-3" controlId="formImage">
                                            <Form.Label>Зображення URL</Form.Label>
                                            <Form.Control type="text" name="image" value={eventData.image} onChange={handleChange} placeholder="https://..." />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="formTopNews">
                                    <Form.Check
                                        type="checkbox"
                                        label="Важлива новина (для слайдера)"
                                        name="isTopNews"
                                        checked={eventData.isTopNews}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" style={{ backgroundColor: '#4B5320', borderColor: '#4B5320' }}>Зберегти</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* СПИСОК ПОДІЙ */}
            <Row>
                <Col>
                    <h4 className="mb-3" style={{ color: '#4B5320' }}>Список подій</h4>
                    <div className="table-responsive bg-white shadow-sm rounded military-card-border">
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
                                <tr key={event._id}>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="fw-bold">{event.title}</td>
                                    <td><Badge bg="secondary">{event.type === 'news' ? 'Новина' : 'Розклад'}</Badge></td>
                                    <td className="text-end">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(event._id)}
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