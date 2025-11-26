import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Gallery = () => {
    const photos = [
        { id: 1, src: '/gallery/навч_стріл.jpg', caption: 'Вогнева підготовка на полігоні' },
        { id: 2, src: '/gallery/конф.jpg', caption: 'Лекція з кібербезпеки для курсантів' },
        { id: 3, src: '/gallery/стр_огл.jpg', caption: 'Шикування особового складу інституту' },
        { id: 4, src: '/gallery/лекц.jpeg', caption: 'Навчальний процес в аудиторії' },
        { id: 5, src: '/gallery/присяга.jpeg', caption: 'Урочисті заходи та присяга' },
        { id: 6, src: '/gallery/спорт.jpg', caption: 'Спортивні змагання' },
    ];

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 military-text-color fw-bold">Фотогалерея ВІТІ</h2>
            <p className="text-center text-muted mb-5">Миттєвості з життя та навчання наших курсантів.</p>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {photos.map(photo => (
                    <div key={photo.id} className="col">
                        <div className="card h-100 shadow-sm military-card-border">
                            <img
                                src={photo.src}
                                className="card-img-top"
                                alt={photo.caption}
                                style={{ height: '250px', objectFit: 'cover' }} // Щоб всі фото були однакового розміру
                            />
                            <div className="card-body military-card-header">
                                <p className="card-text text-center fw-bold mb-0">{photo.caption}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;