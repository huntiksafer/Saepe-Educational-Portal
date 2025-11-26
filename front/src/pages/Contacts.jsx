import React from 'react';

const Contacts = () => {
    return (
        <div className="container my-5">
            <h2 className="text-center mb-5 military-text-color fw-bold">Контакти Інституту</h2>

            <div className="row g-4">
                {/* Ліва колонка: Телефони та посадові особи */}
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm military-card-border">
                        <div className="card-header military-card-header text-white fw-bold">
                            <i className="bi bi-telephone-fill me-2"></i> Ключові телефони
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item bg-transparent">
                                <strong>Черговий інституту (цілодобово):</strong><br />
                                <a href="tel:+380449876543" className="text-decoration-none military-text-color">+380 44 987 65 43</a>
                            </li>
                            <li className="list-group-item bg-transparent">
                                <strong>Навчальний відділ:</strong><br />
                                <a href="tel:+380441234567" className="text-decoration-none military-text-color">+380 44 123 45 67</a>
                            </li>
                            <li className="list-group-item bg-transparent">
                                <strong>Приймальна комісія:</strong><br />
                                <a href="tel:+380445550011" className="text-decoration-none military-text-color">+380 44 555 00 11</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Права колонка: Адреса та Керівництво */}
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm military-card-border mb-4">
                        <div className="card-header military-card-header text-white fw-bold">
                            <i className="bi bi-geo-alt-fill me-2"></i> Адреса та Керівництво
                        </div>
                        <div className="card-body">
                            <h5 className="card-title military-text-color fw-bold">Поштова адреса:</h5>
                            <p className="card-text">
                                01010, м. Київ, <br />
                                {}
                                вул. Польова, 45/1 <br />
                                Військовий інститут телекомунікацій та інформатизації
                            </p>

                            <hr className="my-4" style={{ borderColor: '#4B5320' }} />

                            <h5 className="card-title military-text-color fw-bold">Керівництво:</h5>
                            <p className="card-text mb-1">
                                <strong>Заступник начальника інституту з НР:</strong>
                            </p>
                            <p className="card-text fst-italic">полковник Іваненко Іван Іванович</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;