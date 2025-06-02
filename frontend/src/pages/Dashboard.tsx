import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [mileage, setMileage] = useState<number | "">("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCars();
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
      console.log(data);
    } catch {
      alert("Error al cargar coches");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/cars/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand,
          model,
          year: Number(year),
          color,
          price: Number(price),
          mileage: Number(mileage),
          fuel_type: fuelType,
          transmission,
          registration_number: registrationNumber,
        }),
      });
      if (!response.ok) throw new Error("Error al crear coche");
      setBrand("");
      setModel("");
      setYear("");
      setColor("");
      setPrice("");
      setMileage("");
      setFuelType("");
      setTransmission("");
      setRegistrationNumber("");
      setOpen(false);
      fetchCars();
    } catch {
      alert("Error al crear coche");
    }
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
              <Button className="bg-gray-900 text-white hover:bg-gray-700">
                Añadir coche
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir coche</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCar} className="space-y-3">
                <Input placeholder="Marca" value={brand} onChange={e => setBrand(e.target.value)} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Modelo" value={model} onChange={e => setModel(e.target.value)} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Año" type="number" value={year} onChange={e => setYear(e.target.value ? Number(e.target.value) : "")} required min={1900} max={2100} className="bg-gray-100 text-gray-900" />
                <Input placeholder="Color" value={color} onChange={e => setColor(e.target.value)} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Precio" type="number" value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : "")} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Kilometraje" type="number" value={mileage} onChange={e => setMileage(e.target.value ? Number(e.target.value) : "")} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Combustible" value={fuelType} onChange={e => setFuelType(e.target.value)} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Transmisión" value={transmission} onChange={e => setTransmission(e.target.value)} required className="bg-gray-100 text-gray-900" />
                <Input placeholder="Matrícula" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required className="bg-gray-100 text-gray-900" />
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="border-gray-400 text-gray-700">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-700" disabled={loading}>
                    Añadir
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleLogout} className="bg-gray-900 text-white hover:bg-gray-700">
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="flex-1 px-8 py-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Cargando coches...</p>
          ) : cars.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay coches registrados.</p>
          ) : (
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
      <td className="p-3 text-right">
        <Button
          variant="destructive"
          size="sm"
          className="bg-gray-900 text-white hover:bg-gray-700"
          onClick={() => handleDeleteCar(car.id)}
        >
          Eliminar
        </Button>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;