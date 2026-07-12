import { useEffect } from "react";
import { Shield, Settings, CircleCheck, Users, Lock, MapPin, Phone, Mail, Clock } from "lucide-react";
import "./nosotros.css";
import heroImg from "../../assets/images/presentacionimg.png";
import confianzaImg from "../../assets/images/confianzaimg.png";

export default function NosotrosPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="nosotros-wrapper">

            {/* HERO ACTUALIZADO */}
            <section className="hero">
                <div className="hero-gradient"></div>
                <div className="hero-radial-light"></div>

                <div className="hero-content">
                    <h1 className="hero-title">FERREMAX S.A.C.</h1>
                    <p className="hero-subtitle">
                        Ingeniería, innovación y confianza para construir el futuro.
                    </p>
                    <div className="hero-divider"></div>
                </div>
            </section>

            <div className="wave-divider"></div>

            <section className="section">
                <div className="container">
                    <h2 className="section-title">Quiénes somos</h2>

                    <div className="intro-grid">
                        <div className="intro-text">
                            <p>
                                Somos una empresa peruana con un legado construido sobre
                                calidad, innovación y servicio. A lo largo de los años, FERREMAX
                                S.A.C. se ha consolidado como un aliado estratégico para
                                proyectos industriales, comerciales y residenciales.
                            </p>
                            <p>
                                Nuestro enfoque está orientado en brindar soluciones reales,
                                asesoría especializada y una experiencia centrada en la
                                confianza.
                            </p>
                            <p>
                                No solo vendemos productos: acompañamos a nuestros clientes en
                                la construcción de sus metas.
                            </p>
                        </div>

                        <div className="intro-image">
                            <img src={heroImg} alt="Nuestra empresa" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass-section">
                <div className="glass-inner">
                    <h2 className="section-title centered">Nuestro propósito</h2>

                    <div className="glass-grid">
                        <div className="glass-card">
                            <h3>Misión</h3>
                            <p>
                                Ofrecer soluciones integrales en materiales eléctricos y
                                ferreteros, garantizando excelencia, asesoría técnica y un
                                servicio ágil que impulse los proyectos de nuestros clientes.
                            </p>
                        </div>

                        <div className="glass-card">
                            <h3>Visión</h3>
                            <p>
                                Ser líderes en innovación y servicio, reconocidos a nivel
                                nacional por la confianza, calidad y tecnología aplicada a cada
                                solución.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title centered">Nuestros valores</h2>

                    <div className="valores-grid">
                        {[
                            [Shield, "Confianza"],
                            [Settings, "Innovación"],
                            [CircleCheck, "Calidad"],
                            [Users, "Compromiso"],
                            [Lock, "Seguridad"],
                        ].map(([Icon, label], idx) => (
                            <div key={idx} className="valor-card">
                                <Icon className="size-8 text-primary mb-2 mx-auto block" />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="timeline-section">
                <h2 className="section-title centered">Nuestra historia</h2>

                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <h4>Fundación</h4>
                            <p>
                                Iniciamos operaciones con la visión de transformar el sector
                                ferretero y eléctrico.
                            </p>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <h4>Expansión estratégica</h4>
                            <p>
                                Aumentamos nuestro catálogo y ampliamos la cobertura regional.
                            </p>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <h4>Transformación digital</h4>
                            <p>
                                Integramos soluciones tecnológicas para mejorar la experiencia
                                del cliente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <img src={confianzaImg} className="cta-img" alt="Confianza" />
                <h2 className="cta-title">Construimos confianza con cada proyecto.</h2>
                <p className="cta-sub">
                    Estamos listos para acompañarte en tu siguiente desafío.
                </p>
            </section>

            <section className="contact-section">
                <div className="contact-inner">
                    <h2 className="section-title centered">Contáctanos</h2>
                    <p className="contact-subtitle">
                        Estamos aquí para ayudarte. Nuestro equipo te responderá a la brevedad.
                    </p>

                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="info-card">
                                <MapPin className="size-6 text-primary mb-1" />
                                <h4>Dirección</h4>
                                <p>Av. Los Constructores 245 – Chiclayo, Perú</p>
                            </div>

                            <div className="info-card">
                                <Phone className="size-6 text-primary mb-1" />
                                <h4>Teléfono</h4>
                                <p>(074) 456789</p>
                            </div>

                            <div className="info-card">
                                <Mail className="size-6 text-primary mb-1" />
                                <h4>Correo</h4>
                                <p>ferremaxsac2@gmail.com</p>
                            </div>

                            <div className="info-card">
                                <Clock className="size-6 text-primary mb-1" />
                                <h4>Horario</h4>
                                <p>Lunes a sábado, 8:00 a.m. – 6:00 p.m.</p>
                            </div>
                        </div>

                        <form className="contact-form">
                            <div className="form-group">
                                <label>Nombre completo</label>
                                <input type="text" placeholder="Ingresa tu nombre" required />
                            </div>

                            <div className="form-group">
                                <label>Correo electrónico</label>
                                <input type="email" placeholder="Ingresa tu correo" required />
                            </div>

                            <div className="form-group">
                                <label>Mensaje</label>
                                <textarea placeholder="Cuéntanos en qué podemos ayudarte" rows="5" required />
                            </div>

                            <button type="submit" className="btn-contact">
                                Enviar mensaje
                            </button>
                        </form>
                    </div>
                </div>

                <div className="contact-map">
                    <iframe
                        title="mapa"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5889475844057!2d-79.84655!3d-6.76304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904ce8fa8c319371%3A0x97ef9f95df833c38!2sChiclayo!5e0!3m2!1ses-419!2spe!4v1700000000000"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>

        </div>
    );
}
