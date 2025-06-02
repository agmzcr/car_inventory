import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface CarFormProps {
  initialData?: {
    brand: string;
    model: string;
    year: string;
    color: string;
    price: string;
    mileage: string;
    fuel_type: string;
    transmission: string;
    registration_number: string;
  };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const defaultData = {
  brand: "",
  model: "",
  year: "",
  color: "",
  price: "",
  mileage: "",
  fuel_type: "",
  transmission: "",
  registration_number: "",
};

const CarForm = ({
  initialData = defaultData,
  loading,
  onSubmit,
  onChange,
  onCancel,
  isEdit = false,
}: CarFormProps) => (
  <Card>
    <CardContent className="relative pt-6 pb-2">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marca */}
          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              value={initialData.brand}
              onChange={(e) => onChange("brand", e.target.value)}
              required
            />
          </div>
          {/* Modelo */}
          <div>
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={initialData.model}
              onChange={(e) => onChange("model", e.target.value)}
              required
            />
          </div>
          {/* Año */}
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              min={1900}
              max={2100}
              value={initialData.year}
              onChange={(e) => onChange("year", e.target.value)}
              required
            />
          </div>
          {/* Color */}
          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={initialData.color}
              onChange={(e) => onChange("color", e.target.value)}
              required
            />
          </div>
          {/* Precio */}
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={initialData.price}
              onChange={(e) => onChange("price", e.target.value)}
              required
            />
          </div>
          {/* Kilometraje */}
          <div>
            <Label htmlFor="mileage">Kilometraje</Label>
            <Input
              id="mileage"
              type="number"
              value={initialData.mileage}
              onChange={(e) => onChange("mileage", e.target.value)}
              required
            />
          </div>
          {/* Combustible */}
          <div>
            <Label htmlFor="fuel_type">Combustible</Label>
            <Input
              id="fuel_type"
              value={initialData.fuel_type}
              onChange={(e) => onChange("fuel_type", e.target.value)}
              required
            />
          </div>
          {/* Transmisión */}
          <div>
            <Label htmlFor="transmission">Transmisión</Label>
            <Input
              id="transmission"
              value={initialData.transmission}
              onChange={(e) => onChange("transmission", e.target.value)}
              required
            />
          </div>
          {/* Matrícula */}
          <div className="md:col-span-2">
            <Label htmlFor="registration_number">Matrícula</Label>
            <Input
              id="registration_number"
              value={initialData.registration_number}
              onChange={(e) => onChange("registration_number", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={loading}
          >
            {isEdit ? "Guardar cambios" : "Añadir"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default CarForm;