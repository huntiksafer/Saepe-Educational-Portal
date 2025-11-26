import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
                const token = localStorage.getItem('token');

                // Заголовок Authorization обов'язковий
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:5000/api/events', config);
                setEvents(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    // Токен недействителен
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
                    <h2 className="mb-3 border-bottom pb-2">Головні події</h2>
                    <Carousel className="shadow-sm rounded">
                        {topNews.map((news) => (
                            <Carousel.Item key={news.id} interval={5000}>
                                <img
                                    className="d-block w-100"
                                    src={news.image || 'https://via.placeholder.com/1200x400?text=Saepe+Event'}
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
                <h2 className="mb-4">Останні новини</h2>
                {regularNews.length === 0 && !error ? (
                    <p className="text-muted">Новини відсутні.</p>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {regularNews.map((news) => (
                            <Col key={news.id}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Img
                                        variant="top"
                                        src={news.image || 'https://via.placeholder.com/400x200?text=Новина'}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{news.title}</Card.Title>
                                        <Card.Text className="text-muted small">
                                            {new Date(news.date || Date.now()).toLocaleDateString('uk-UA')}
                                        </Card.Text>
                                        <Card.Text className="flex-grow-1">
                                            {news.description?.substring(0, 80)}...
                                        </Card.Text>
                                        <Button
                                            variant="outline-primary"
                                            className="mt-auto"
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
                <Modal.Header closeButton>
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
                        <strong>Дата:</strong> {new Date(selectedEvent?.date || Date.now()).toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' })}
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