import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }
    const data = await response.json();
    login(data.access_token);
    console.log("Respuesta del backend:", data);
    console.log("Login exitoso, navegando al dashboard");
    setTimeout(() => {
  navigate("/dashboard");
}, 0);
  } catch (err: any) {
    alert("Error al iniciar sesión");
    console.log(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/register" className="text-blue-600 hover:underline text-sm">
              ¿No tienes cuenta? Regístrate
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;