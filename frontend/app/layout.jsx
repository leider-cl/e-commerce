export const metadata = {
  title: "LEIDER Shop | Equipamiento IoT industrial",
  description: "Catálogo ecommerce de LEIDER para controladores, sensores, comunicación LoRaWAN y soluciones IoT industriales.",
  keywords: ["LEIDER", "IoT", "LoRaWAN", "sensores", "controladores", "telemetría", "Chile"],
  openGraph: {
    title: "LEIDER Shop",
    description: "Equipamiento IoT industrial para terreno, sensores y comunicación LoRaWAN.",
    type: "website",
    locale: "es_CL",
  },
};

import "../src/index.css";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
