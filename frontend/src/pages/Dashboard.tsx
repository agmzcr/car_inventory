import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CarForm from "../components/CarForm";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  registration_number: string;
}

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [formData, setFormData] = useState<Omit<Car, "id">>({
    brand: "",
    model: "",
    year: "",
    color: "",
    price: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    registration_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/cars/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCars(data);
    } catch {
      alert("Error al cargar coches");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenAdd = () => {
    setEditCar(null);
    setFormData({
      brand: "",
      model: "",
      year: "",
      color: "",
      price: "",
      mileage: "",
      fuel_type: "",
      transmission: "",
      registration_number: "",
    });
    setOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      price: car.price,
      mileage: car.mileage,
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      registration_number: car.registration_number,
    });
    setOpen(true);
  };

  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (editCar) {
        response = await fetch(`http://localhost:8000/api/cars/${editCar.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch("http://localhost:8000/api/cars/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) throw new Error("Error al guardar coche");
      setOpen(false);
      setEditCar(null);
      fetchCars();
    } catch {
      alert("Error al guardar coche");
    }
    setLoading(false);
  };

  const handleDeleteCar = async (id: number) => {
    if (!window.confirm("¿Eliminar este coche?")) return;
    try {
      await fetch(`http://localhost:8000/api/cars/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars((prev) => prev.filter((car) => car.id !== id));
    } catch {
      alert("Error al eliminar coche");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="flex justify-between items-center px-8 py-6 bg-white shadow">
        <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenAdd}
              >
                Añadir coche
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editCar ? "Editar coche" : "Añadir coche"}</DialogTitle>
              </DialogHeader>
              <CarForm
                initialData={formData}
                loading={loading}
                onSubmit={handleFormSubmit}
                onChange={handleFormChange}
                onCancel={() => setOpen(false)}
                isEdit={!!editCar}
              />
            </DialogContent>
          </Dialog>
          <Button variant="default" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="flex-1 px-8 py-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 font-semibold">Marca</th>
                <th className="p-3 font-semibold">Modelo</th>
                <th className="p-3 font-semibold">Año</th>
                <th className="p-3 font-semibold">Color</th>
                <th className="p-3 font-semibold">Precio</th>
                <th className="p-3 font-semibold">Kilometraje</th>
                <th className="p-3 font-semibold">Combustible</th>
                <th className="p-3 font-semibold">Transmisión</th>
                <th className="p-3 font-semibold">Matrícula</th>
                <th className="p-3 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-t border-gray-200">
                  <td className="p-3 text-gray-900">{car.brand}</td>
                  <td className="p-3 text-gray-900">{car.model}</td>
                  <td className="p-3 text-gray-900">{car.year}</td>
                  <td className="p-3 text-gray-900">{car.color}</td>
                  <td className="p-3 text-gray-900">
                    {car.price.toLocaleString("es-ES") + "€"}
                  </td>
                  <td className="p-3 text-gray-900">
                    {car.mileage.toLocaleString("es-ES") + " km"}
                  </td>
                  <td className="p-3 text-gray-900">{car.fuel_type}</td>
                  <td className="p-3 text-gray-900">{car.transmission}</td>
                  <td className="p-3 text-gray-900">{car.registration_number}</td>
                  <td className="p-3 text-right flex gap-2 justify-end">
                    <Button
                      size="sm"
                      className="bg-gray-700 text-white hover:bg-gray-900"
                      onClick={() => handleOpenEdit(car)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;