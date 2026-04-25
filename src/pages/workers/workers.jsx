import { useAuth } from "@/services/auth/authContext";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import CompactTable from "@/components/common/CompactTable";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import Section from "@/components/layout/Section";
import CreateOrEditWorker from "@/components/workers/createWorker";
import { useToast } from "@/context/ToastContext";

export default function Workers() {
  const { http } = useAuth();
  const { showToast } = useToast();

  const [workers, setWorkers] = useState([]);
  const [reload, setReload] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editWorker, setEditWorker] = useState(null);

  const getWorkers = async () => {
    try {
      const response = await http.get("employees");
      setWorkers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteWorker = async (id) => {
    try {
      const response = await http.delete(`employees/${id}`);
      setReload(!reload);
      showToast("success", "Éxito", response.data.message);
    } catch (err) {
      showToast("error", "Error", "No se pudo eliminar el trabajador.");
    }
  };

  useEffect(() => {
    getWorkers();
  }, [reload]);

  const Actions = ({ rowData }) => (
    <div className="flex justify-content-start gap-2">
      <ActionButton
        icon="pi-pencil"
        color="warning"
        onClick={() => {
          setEditWorker(rowData);
          setIsOpen(true);
        }}
      />
      <ActionButton
        icon="pi-trash"
        color="danger"
        onClick={() => deleteWorker(rowData.id)}
      />
    </div>
  );

  return (
    <Container>
      <Header
        title="Colaboradores"
        subtitle="A continuación, se visualizará los colaboradores registrados en el sistema."
      />
      <Section className="flex justify-content-end align-items-center my-3">
        <ActionButton
          icon="pi-plus"
          tooltip="Crear trabajador"
          onClick={() => {
            setEditWorker(null);
            setIsOpen(true);
          }}
        />
      </Section>

      <CompactTable value={workers}>
        <Column header="Nombre" field="person.nombres" />
        <Column header="Horario laboral" field="horario_laboral" />
        <Column header="Sueldo" body={(rowData) => `S/. ${rowData.sueldo}`} />
        <Column header="Acciones" body={(rowData) => <Actions rowData={rowData} />} />
      </CompactTable>

      <CreateOrEditWorker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reload={reload}
        setReload={setReload}
        editData={editWorker}
      />
    </Container>
  );
}
