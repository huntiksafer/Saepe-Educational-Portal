import React from 'react';
import { Container, Table, Badge } from 'react-bootstrap';

const Schedule = () => {
    // Мокові дані розкладу на Листопад 2025
    const scheduleData = [
        {
            time: '08:30 - 09:50',
            mon: 'Вища математика (Лекція)',
            tue: 'Фізична підготовка',
            wed: 'Програмування (Лаб)',
            thu: 'Іноземна мова',
            fri: 'Військова топографія'
        },
        {
            time: '10:00 - 11:20',
            mon: 'Фізика (Практика)',
            tue: 'Тактична підготовка',
            wed: 'Програмування (Лекція)',
            thu: 'Історія України',
            fri: 'Самостійна робота'
        },
        {
            time: '11:40 - 13:00',
            mon: 'Схемотехніка',
            tue: 'Стройова підготовка',
            wed: 'Основи кібербезпеки',
            thu: 'Філософія',
            fri: 'Підбиття підсумків'
        }
    ];

    return (
        <Container className="mb-5">
            <h2 className="mb-4 text-uppercase border-bottom pb-2">
                Розклад занять на тиждень (Листопад 2025)
            </h2>

            <div className="table-responsive shadow-sm">
                <Table bordered hover striped className="mb-0 bg-white">
                    <thead className="bg-success text-white">
                    <tr style={{ backgroundColor: '#4B5320', color: 'white' }}>
                        <th style={{ width: '15%' }}>Час</th>
                        <th style={{ width: '17%' }}>Понеділок</th>
                        <th style={{ width: '17%' }}>Вівторок</th>
                        <th style={{ width: '17%' }}>Середа</th>
                        <th style={{ width: '17%' }}>Четвер</th>
                        <th style={{ width: '17%' }}>П'ятниця</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scheduleData.map((slot, index) => (
                        <tr key={index}>
                            <td className="fw-bold text-center align-middle bg-light">{slot.time}</td>
                            <td><Badge bg="secondary" className="d-block text-wrap py-2">{slot.mon}</Badge></td>
                            <td><Badge bg="secondary" className="d-block text-wrap py-2">{slot.tue}</Badge></td>
                            <td><Badge bg="secondary" className="d-block text-wrap py-2">{slot.wed}</Badge></td>
                            <td><Badge bg="secondary" className="d-block text-wrap py-2">{slot.thu}</Badge></td>
                            <td><Badge bg="secondary" className="d-block text-wrap py-2">{slot.fri}</Badge></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <p className="mt-3 text-muted small">
                * Розклад може змінюватися згідно розпоряджень навчального відділу.
            </p>
        </Container>
    );
};

export default Schedule;