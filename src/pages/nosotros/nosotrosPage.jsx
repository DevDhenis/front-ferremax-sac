import { useEffect } from "react";
import {
  Shield,
  Settings,
  CircleCheck,
  Users,
  Lock,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Wrench,
  Truck,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import heroImg from "../../assets/images/presentacionimg.png";
import confianzaImg from "../../assets/images/confianzaimg.png";

const VALUES = [
  { icon: Shield, label: "Confianza", desc: "Cumplimos lo que prometemos, en cada entrega." },
  { icon: Settings, label: "Innovación", desc: "Mejores herramientas, mejores procesos." },
  { icon: CircleCheck, label: "Calidad", desc: "Productos que resisten el trabajo real." },
  { icon: Users, label: "Compromiso", desc: "Acompañamos el proyecto de principio a fin." },
  { icon: Lock, label: "Seguridad", desc: "Estándares que protegen a quien construye." },
];

const HISTORY = [
  ["Fundación", "Iniciamos operaciones con la visión de transformar el sector ferretero y eléctrico."],
  ["Expansión estratégica", "Ampliamos el catálogo y llevamos nuestra cobertura a más regiones."],
  ["Transformación digital", "Integramos tecnología para hacer más simple la experiencia del cliente."],
];

const CONTACT = [
  { icon: MapPin, title: "Dirección", value: "Av. Los Constructores 245 — Chiclayo, Perú" },
  { icon: Phone, title: "Teléfono", value: "(074) 456789" },
  { icon: Mail, title: "Correo", value: "ferremaxsac2@gmail.com" },
  { icon: Clock, title: "Horario", value: "Lun a Sáb · 8:00 a.m. – 6:00 p.m." },
];

const HIGHLIGHTS = [
  { icon: Wrench, title: "Asesoría técnica", desc: "Te ayudamos a elegir el producto correcto para tu obra." },
  { icon: Truck, title: "Cobertura nacional", desc: "Llegamos a donde está tu proyecto." },
  { icon: Package, title: "Catálogo amplio", desc: "Miles de ítems, de la herramienta al material." },
];

function Eyebrow({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function NosotrosPage() {
  const { showSuccess } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    showSuccess("Gracias por escribirnos", "Nos pondremos en contacto contigo pronto.");
  };

  return (
    <div className="bg-background text-foreground">
      {/* ── Masthead ── */}
      <header className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Eyebrow>Ferretería &amp; suministros eléctricos</Eyebrow>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Todo para construir, en un solo lugar.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              FERREMAX S.A.C. abastece proyectos industriales, comerciales y
              residenciales con producto confiable y asesoría técnica real.
            </p>

            {/* Meta en voz-dato */}
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-border/60 pt-6">
              {[
                ["Rubro", "Ferretería / eléctrico"],
                ["Sede", "Chiclayo, Perú"],
                ["Cobertura", "Nacional"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="font-spec text-sm font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <img
              src={heroImg}
              alt="Operación de FERREMAX"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── Quiénes somos ── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <Eyebrow>Quiénes somos</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Un aliado, no solo un proveedor
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Somos una empresa peruana con un legado construido sobre calidad,
                innovación y servicio. Con los años nos consolidamos como aliado
                estratégico de proyectos de todo tamaño.
              </p>
              <p>
                Nuestro enfoque son soluciones reales, asesoría especializada y una
                experiencia centrada en la confianza. No solo vendemos productos:
                acompañamos a nuestros clientes en la construcción de sus metas.
              </p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border bg-card">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 p-5 sm:p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Propósito ── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <Eyebrow>Nuestro propósito</Eyebrow>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {[
              ["Misión", "Ofrecer soluciones integrales en materiales eléctricos y ferreteros, con excelencia, asesoría técnica y un servicio ágil que impulse los proyectos de nuestros clientes."],
              ["Visión", "Ser líderes en innovación y servicio, reconocidos a nivel nacional por la confianza, la calidad y la tecnología aplicada a cada solución."],
            ].map(([title, body]) => (
              <div key={title} className="bg-background p-8 sm:p-10">
                <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <Eyebrow>Nuestros valores</Eyebrow>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.label}
                className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <Icon className="size-6 text-primary" />
                <p className="mt-4 text-sm font-semibold text-foreground">{value.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Historia (secuencia real → numerada) ── */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <Eyebrow>Nuestra historia</Eyebrow>
          <ol className="mt-8 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
            {HISTORY.map(([title, body], i) => (
              <li
                key={title}
                className="flex gap-5 bg-background p-6 sm:gap-8 sm:p-8"
              >
                <span className="font-spec text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-base font-bold tracking-tight">{title}</h4>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA (único momento de color) ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20 md:flex-row md:items-center md:justify-between md:text-left">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Construimos confianza con cada proyecto.
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Estamos listos para acompañarte en tu siguiente desafío.
            </p>
          </div>
          <img
            src={confianzaImg}
            alt=""
            className="w-40 shrink-0 sm:w-48"
          />
        </div>
      </section>

      {/* ── Contacto ── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <Eyebrow>Contáctanos</Eyebrow>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Hablemos de tu proyecto
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Estamos aquí para ayudarte. Nuestro equipo te responderá a la brevedad.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Datos */}
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTACT.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <Icon className="size-5 text-primary" />
                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              );
            })}
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleContactSubmit}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-xs font-medium text-foreground">
                Nombre completo
              </label>
              <Input
                id="contact-name"
                name="name"
                required
                placeholder="Ingresa tu nombre"
                className="bg-background"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-xs font-medium text-foreground">
                Correo electrónico
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="Ingresa tu correo"
                className="bg-background"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-xs font-medium text-foreground">
                Mensaje
              </label>
              <Textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Cuéntanos en qué podemos ayudarte"
                className="bg-background"
              />
            </div>
            <Button type="submit" className="mt-1 w-full gap-1.5">
              Enviar mensaje
              <ArrowUpRight className="size-4" />
            </Button>
          </form>
        </div>

        {/* Mapa */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Ubicación de FERREMAX en Chiclayo"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5889475844057!2d-79.84655!3d-6.76304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904ce8fa8c319371%3A0x97ef9f95df833c38!2sChiclayo!5e0!3m2!1ses-419!2spe!4v1700000000000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[340px] w-full border-0"
          />
        </div>
      </section>
    </div>
  );
}
