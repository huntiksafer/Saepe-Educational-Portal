import React, { useEffect, useState } from 'react';
import api from '../api'; // Використовуємо наш централізований API
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Carousel, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Стан модального вікна
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Більше не треба вручну додавати токен, api.js зробить це сам
                const response = await api.get('/api/events');

                setEvents(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    // Якщо токен протух - перекидаємо на вхід
                    localStorage.clear();
                    navigate('/login');
                } else {
                    setError('Не вдалося завантажити дані. Перевірте з\'єднання.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [navigate]);

    const handleShowDetails = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    // Фільтруємо події
    const topNews = events.filter(event => event.isTopNews);
    const regularNews = events.filter(event => !event.isTopNews);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" variant="secondary" />
            </Container>
        );
    }

    return (
        <Container className="pb-5">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Слайдер */}
            {topNews.length > 0 && (
                <section className="mb-5">
                    <h2 className="mb-3 border-bottom pb-2" style={{ color: '#4B5320' }}>Головні події</h2>
                    <Carousel className="shadow-sm rounded">
                        {topNews.map((news) => (
                            <Carousel.Item key={news._id} interval={5000}>
                                <img
                                    className="d-block w-100"
                                    src={news.image || 'https://placehold.co/1200x400?text=Event'}
                                    alt={news.title}
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                                <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-3">
                                    <h3>{news.title}</h3>
                                    <p>{news.description}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </section>
            )}

            {/* Сітка новин */}
            <section>
                <h2 className="mb-4" style={{ color: '#4B5320' }}>Останні новини</h2>
                {regularNews.length === 0 && !error ? (
                    <p className="text-muted">Новини відсутні.</p>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {regularNews.map((news) => (
                            <Col key={news._id}>
                                <Card className="h-100 shadow-sm military-card-border">
                                    <Card.Img
                                        variant="top"
                                        src={news.image || 'https://placehold.co/400x200?text=News'}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title style={{ color: '#4B5320', fontWeight: 'bold' }}>{news.title}</Card.Title>
                                        <Card.Text className="text-muted small">
                                            {new Date(news.date || Date.now()).toLocaleDateString('uk-UA')}
                                        </Card.Text>
                                        <Card.Text className="flex-grow-1">
                                            {news.description?.substring(0, 80)}...
                                        </Card.Text>
                                        <Button
                                            variant="outline-primary"
                                            className="mt-auto"
                                            style={{ borderColor: '#4B5320', color: '#4B5320' }}
                                            onClick={() => handleShowDetails(news)}
                                        >
                                            Детальніше
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </section>

            {/* Модальне вікно деталей */}
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="military-card-header text-white" style={{ backgroundColor: '#4B5320' }}>
                    <Modal.Title>{selectedEvent?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent?.image && (
                        <img
                            src={selectedEvent.image}
                            alt={selectedEvent.title}
                            className="img-fluid mb-3 rounded w-100"
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                    )}
                    <p className="text-muted mb-2">
                        <strong>Дата проведення:</strong> {new Date(selectedEvent?.date || Date.now()).toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                    <div className="mt-3">
                        {selectedEvent?.description}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрити
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Home;