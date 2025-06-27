"use client";

import { useState } from "react";
import Link from "next/link";
import { FiLogIn, FiFileText, FiMail } from "react-icons/fi";

export default function Welcome() {
  const [isHovering, setIsHovering] = useState(false);

  const titulo = "BIENVENIDOS".split("");

  return (
    <div className="min-h-screen text-white flex flex-col justify-between overflow-hidden relative">
      {/* Fondo con imagen y overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://sedeorellana.espoch.edu.ec/wp-content/uploads/2022/03/Campus-Norte-1024x534.png')",
        }}
      ></div>

      {/* Barra superior */}
      <header className="relative z-10 flex justify-between items-center p-4 bg-[#c0392b]/90 backdrop-blur-sm border-b border-red-900">
        <div className="flex items-center space-x-2">
          <FiFileText className="text-white text-2xl" />
          <h1 className="text-2xl font-bold text-white">DocuGestión ESPOCH</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          {titulo.map((letra, index) => (
            <span
              key={index}
              className="inline-block animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letra}
            </span>
          ))}
        </h2>

        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed animate-fade-in-up mt-4">
          <FiFileText className="inline mr-2 mb-1" />
          Plataforma segura para la gestión y almacenamiento de documentos académicos
        </p>

        <div className="pt-8">
          <Link
            href="/docentes/login"
            className={`relative flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8 rounded-full text-lg font-medium transition-all duration-500 ${
              isHovering ? "shadow-2xl transform scale-105" : "shadow-lg"
            }`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <FiLogIn className="text-xl" />
            <span className="relative z-10">Iniciar Sesión</span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-full opacity-0 transition-opacity duration-300"
              style={{ opacity: isHovering ? 1 : 0 }}
            ></span>
          </Link>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="relative z-10 bg-gray-800/90 backdrop-blur-sm py-4 text-center text-gray-300 border-t border-gray-700">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <FiFileText className="text-cyan-400" />
            <span className="text-sm">Sistema de Documentación Docente</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiMail className="text-cyan-400" />
            <a
              href="mailto:soporte@espoch.edu.ec"
              className="text-sm hover:text-cyan-400 transition-colors"
            >
              soporte@espoch.edu.ec
            </a>
          </div>
        </div>
      </footer>

      {/* Animaciones CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
