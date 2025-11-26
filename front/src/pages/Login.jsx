import React, { useState } from 'react';
import api from '../api'; // Використовуємо наш налаштований інстанс
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Визначаємо короткий шлях (без localhost)
        const endpoint = isRegister ? '/api/register' : '/api/login';

        try {
            // Використовуємо api замість axios
            const response = await api.post(endpoint, formData);

            const { token, role } = response.data;

            // 1. Зберігаємо Токен
            localStorage.setItem('token', token);

            // 2. Зберігаємо Роль
            localStorage.setItem('role', role || 'user');

            // 3. Перенаправлення
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('Auth error:', err);
            const msg = err.response?.data?.message || 'Помилка авторизації. Перевірте дані.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-primary text-white text-center py-3" style={{ backgroundColor: '#4B5320' }}>
                            <h4 className="mb-0 text-white">
                                {isRegister ? 'Реєстрація' : 'Вхід до системи'}
                            </h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Логін</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        placeholder="Введіть логін"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Введіть пароль"
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" disabled={loading} size="lg">
                                        {loading ? 'Зачекайте...' : (isRegister ? 'Зареєструватися' : 'Увійти')}
                                    </Button>
                                </div>

                                <div className="text-center mt-3">
                                    <Button
                                        variant="link"
                                        className="text-decoration-none"
                                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                                    >
                                        {isRegister
                                            ? 'Вже є акаунт? Увійти'
                                            : 'Немає акаунту? Зареєструватися'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;