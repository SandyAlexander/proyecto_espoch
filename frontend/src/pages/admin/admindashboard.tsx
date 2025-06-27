"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FiFileText, FiUsers, FiLogOut, FiEdit2, FiTrash2,
  FiFolderPlus, FiFolder, FiFile, FiSearch, FiDownload
} from 'react-icons/fi';
import { FaUserCircle, FaPlus, FaSpinner } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import styles from './admindashboard.module.css';

// Verificar y validar la URL de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
if (!API_BASE_URL) {
  console.error('API_BASE_URL no está definido');
}

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Error de servidor (5xx)
      if (error.response.status >= 500) {
        console.error('Error del servidor:', error.response.status, error.response.data);
        return Promise.reject(new Error('Error interno del servidor. Por favor intente más tarde.'));
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      return Promise.reject(new Error('No se pudo conectar al servidor. Verifique su conexión.'));
    } else {
      // Error al configurar la petición
      console.error('Error al configurar la petición:', error.message);
      return Promise.reject(new Error('Error al configurar la petición.'));
    }
    return Promise.reject(error);
  }
);

const materias = [
  "PROGRAMACION", "CLOUD COMPUTING", "FUNDAMENTOS DE PROGRAMACION", "SISTEMAS DE COMUNICACION",
  "CONMUTACIÓN Y ENRUTAMIENTO", "COMUNICACION ORAL Y ESCRITA", "COMPUTACION MOVIL",
  "APLICACIONES PARA LA GESTION DE REDES", "TRABAJO DE TITULACIÓN", "INGLES III", "INGLES IV",
  "ADMINISTRACION DE SISTEMAS OPERATIVOS", "SISTEMAS INTERACTIVOS Y MULTIMEDIA",
  "INTERACCION HOMBRE MAQUINA", "FORMULACIÓN TRABAJO DE TITULACIÓN", "GESTION ADMINISTRATIVA",
  "REALIDAD SOCIOECONOMICA E INTERCULTURALIDAD", "EMPRENDIMIENTO", "ÉTICIA Y RELACIONES HUMANAS",
  "FISICA", "TECNOLOGÍA WEB", "INTEROPERABILIDAD DE PLATAFORMAS", "MINERIA DE DATOS",
  "SOSTENIBILIDAD AMBIENTAL", "INGLES I", "INGLES II", "EDUCACION FISICA", "CALCULO I", "CALCULO II",
  "FUNDAMENTOS DE REDES", "ESCALABILIDAD DE REDES", "SISTEMAS DE INFORMACION GEOGRAFICA",
  "DERECHO INFORMÁTICO", "PRÁCTICAS LABORALES", "SEGURIDAD TI", "AUDITORIA TI",
  "ARQUITECTURA DE LA INFORMACIÓN", "INTELIGENCIA DE NEGOCIOS", "METODOLOGIA DE LA INVESTIGACION CIENTIFICA",
  "VIRTUALIZACIÓN", "ESTRUCTURA DE DATOS", "ADMINISTRACION DE BASE DE DATOS", "OFIMATICA",
  "PRÁCTICAS DE SERVICIO COMUNITARIO", "GOBIERNO TI", "ESTADISTICA", "GESTION DE PROYECTOS TI",
  "FUNDAMENTOS DE BASE DE DATOS", "BASES DE DATOS AVANZADAS", "ALGEBRA LINEAL"
];

interface Teacher {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  materias: string[];
  rol: string;
  telefono: string;
  departamento: string;
}

interface Folder {
  id: string;
  name: string;
}

interface File {
  id: string;
  name: string;
  folderId: string;
}

const AdminDashboard = () => {
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    materias: [],
    telefono: '',
    departamento: '',
    rol: 'docente'
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [errorTeachers, setErrorTeachers] = useState('');
  const [errorFolders, setErrorFolders] = useState('');
  const [errorFiles, setErrorFiles] = useState('');
  
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  // Filtrado para búsqueda
  const filteredTeachers = teachers.filter(t => {
    const fullName = `${t.nombres} ${t.apellidos}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Función con reintentos para peticiones fallidas
  const fetchWithRetry = async (url: string, options = {}, maxRetries = 3) => {
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      if (maxRetries <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - maxRetries + 1)));
      return fetchWithRetry(url, options, maxRetries - 1);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      setErrorTeachers('');
      const data = await fetchWithRetry(`${API_BASE_URL}/docentes`);
      setTeachers(data || []);
    } catch (err: any) {
      console.error('Error al obtener docentes', err);
      setErrorTeachers(err.message || 'Error al cargar docentes');
      setApiStatus('offline');
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchFolders = async () => {
    try {
      setLoadingFolders(true);
      setErrorFolders('');
      const data = await fetchWithRetry(`${API_BASE_URL}/folders`);
      setFolders(data || []);
    } catch (err: any) {
      console.error('Error al obtener carpetas', err);
      setErrorFolders(err.message || 'Error al cargar carpetas');
      setApiStatus('offline');
    } finally {
      setLoadingFolders(false);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true);
      setErrorFiles('');
      const data = await fetchWithRetry(`${API_BASE_URL}/files`);
      setFiles(data || []);
    } catch (err: any) {
      console.error('Error al obtener archivos', err);
      setErrorFiles(err.message || 'Error al cargar archivos');
      setApiStatus('offline');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleAddTeacher = async () => {
    const { nombres, apellidos, correo, contrasena, materias } = newTeacher;
    if (!nombres || !apellidos || !correo || !contrasena || materias.length === 0) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/docentes`, newTeacher);
      setTeachers([...teachers, res.data]);
      setNewTeacher({
        nombres: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        materias: [],
        telefono: '',
        departamento: '',
        rol: 'docente'
      });
      setShowAddTeacherModal(false);
    } catch (err: any) {
      console.error('Error al registrar docente', err);
      alert(err.message || 'Error al registrar docente');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este docente? Todos sus archivos y carpetas también serán eliminados.')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/docentes/${id}`);
      setTeachers(teachers.filter(t => t.id !== id));
    } catch (err: any) {
      console.error('Error al eliminar docente', err);
      alert(err.message || 'Error al eliminar docente');
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Nombre de la nueva carpeta:');
    if (!folderName) return;
    
    try {
      const res = await axios.post(`${API_BASE_URL}/folders`, { name: folderName });
      setFolders([...folders, res.data]);
    } catch (err: any) {
      console.error('Error al crear carpeta', err);
      alert(err.message || 'Error al crear carpeta');
    }
  };

  const handleRenameFolder = async (id: string) => {
    const newName = prompt('Nuevo nombre de la carpeta:');
    if (!newName) return;
    
    try {
      await axios.put(`${API_BASE_URL}/folders/${id}`, { name: newName });
      setFolders(folders.map(f => (f.id === id ? { ...f, name: newName } : f)));
    } catch (err: any) {
      console.error('Error al renombrar carpeta', err);
      alert(err.message || 'Error al renombrar carpeta');
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta carpeta? Todos los archivos dentro también serán eliminados.')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/folders/${id}`);
      setFolders(folders.filter(f => f.id !== id));
      setFiles(files.filter(f => f.folderId !== id));
    } catch (err: any) {
      console.error('Error al eliminar carpeta', err);
      alert(err.message || 'Error al eliminar carpeta');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folderId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    try {
      const res = await axios.post(`${API_BASE_URL}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFiles([...files, res.data]);
    } catch (err: any) {
      console.error('Error al subir archivo', err);
      alert(err.message || 'Error al subir archivo');
    } finally {
      if (fileInputRefs.current[folderId]) {
        fileInputRefs.current[folderId]!.value = '';
      }
    }
  };

  // Carga inicial con manejo de reintentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setApiStatus('checking');
        await Promise.all([
          fetchTeachers(),
          fetchFolders(),
          fetchFiles()
        ]);
        setApiStatus('online');
      } catch (error) {
        console.error('Error loading data:', error);
        setApiStatus('offline');
        // Reintentar después de 5 segundos
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 5000);
      }
    };

    fetchData();
  }, [retryCount]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.profileMenu}`) && !target.closest(`.${styles.profileIcon}`)) {
        setProfileMenuVisible(false);
      }
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={styles.adminDashboard}>
      {apiStatus === 'offline' && (
        <div className={styles.apiStatusOffline}>
          Error: No se puede conectar al servidor. Verifica tu conexión.
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.logo}>
          <FiFileText size={28} />
          <span>Admin Dashboard</span>
        </div>

        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar docentes, carpetas o archivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.profileArea}>
          <div 
            className={styles.profileIcon} 
            onClick={() => setProfileMenuVisible(!profileMenuVisible)}
          >
            <FaUserCircle size={28} />
            <span>Administrador</span>
          </div>
          <div className={`${styles.profileMenu} ${profileMenuVisible ? styles.visible : ''}`}>
            <button onClick={() => signOut()}>
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={() => setShowAddTeacherModal(true)}
            disabled={apiStatus !== 'online'}
          >
            <FaPlus /> Agregar Docente
          </button>
          <button 
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleCreateFolder}
            disabled={apiStatus !== 'online'}
          >
            <FiFolderPlus /> Nueva Carpeta
          </button>
        </div>

        <section className={styles.section}>
          <h2>
            <FiUsers className={styles.sectionIcon} /> Docentes
          </h2>
          {loadingTeachers ? (
            <div className={styles.loading}>
              <FaSpinner className={styles.spinner} /> Cargando docentes...
            </div>
          ) : errorTeachers ? (
            <div className={styles.error}>
              {errorTeachers}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <p className={styles.emptyMessage}>No hay docentes registrados</p>
          ) : (
            <ul className={styles.list}>
              {filteredTeachers.map(t => (
                <li key={t.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <span className={styles.itemTitle}>{t.nombres} {t.apellidos}</span>
                    <div className={styles.tagsContainer}>
                      <span className={styles.tag}>{t.rol}</span>
                      <span className={styles.tagMateria}>{t.materias.join(', ') || 'Sin materia'}</span>
                    </div>
                  </div>
                  <div className={styles.actionsItem}>
                    <button 
                      onClick={() => handleDeleteTeacher(t.id)} 
                      title="Eliminar docente" 
                      className={styles.deleteButton}
                      disabled={apiStatus !== 'online'}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2>
            <FiFolder className={styles.sectionIcon} /> Carpetas
          </h2>
          {loadingFolders ? (
            <div className={styles.loading}>
              <FaSpinner className={styles.spinner} /> Cargando carpetas...
            </div>
          ) : errorFolders ? (
            <div className={styles.error}>
              {errorFolders}
            </div>
          ) : filteredFolders.length === 0 ? (
            <p className={styles.emptyMessage}>No hay carpetas creadas</p>
          ) : (
            <ul className={styles.list}>
              {filteredFolders.map(folder => (
                <li key={folder.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <FiFolder className={styles.folderIcon} />
                    <span className={styles.itemTitle}>{folder.name}</span>
                  </div>
                  <div className={styles.actionsItem}>
                    <button 
                      onClick={() => handleRenameFolder(folder.id)} 
                      title="Renombrar carpeta"
                      disabled={apiStatus !== 'online'}
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDeleteFolder(folder.id)} 
                      title="Eliminar carpeta" 
                      className={styles.deleteButton}
                      disabled={apiStatus !== 'online'}
                    >
                      <FiTrash2 />
                    </button>
                    <label 
                      htmlFor={`file-upload-${folder.id}`} 
                      className={styles.uploadLabel} 
                      title="Subir archivo"
                    >
                      <FiFile />
                      <input
                        id={`file-upload-${folder.id}`}
                        type="file"
                        className={styles.fileInput}
                        onChange={(e) => handleFileUpload(e, folder.id)}
                        ref={el => fileInputRefs.current[folder.id] = el}
                        disabled={apiStatus !== 'online'}
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2>
            <FiFile className={styles.sectionIcon} /> Archivos
          </h2>
          {loadingFiles ? (
            <div className={styles.loading}>
              <FaSpinner className={styles.spinner} /> Cargando archivos...
            </div>
          ) : errorFiles ? (
            <div className={styles.error}>
              {errorFiles}
            </div>
          ) : filteredFiles.length === 0 ? (
            <p className={styles.emptyMessage}>No hay archivos subidos</p>
          ) : (
            <ul className={styles.list}>
              {filteredFiles.map(file => (
                <li key={file.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <FiFile className={styles.fileIcon} />
                    <span className={styles.itemTitle}>{file.name}</span>
                  </div>
                  <a 
                    href={`${API_BASE_URL}/files/download/${file.id}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.downloadLink}
                  >
                    <FiDownload /> Descargar
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {showAddTeacherModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              <FaUserCircle className={styles.modalIcon} /> Registrar nuevo docente
            </h2>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombres*</label>
              <input
                type="text"
                className={styles.formInput}
                value={newTeacher.nombres}
                onChange={(e) => setNewTeacher({ ...newTeacher, nombres: e.target.value })}
                required
                autoFocus
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Apellidos*</label>
              <input
                type="text"
                className={styles.formInput}
                value={newTeacher.apellidos}
                onChange={(e) => setNewTeacher({ ...newTeacher, apellidos: e.target.value })}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Correo Electrónico*</label>
              <input
                type="email"
                className={styles.formInput}
                value={newTeacher.correo}
                onChange={(e) => setNewTeacher({ ...newTeacher, correo: e.target.value })}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contraseña*</label>
              <input
                type="password"
                className={styles.formInput}
                value={newTeacher.contrasena}
                onChange={(e) => setNewTeacher({ ...newTeacher, contrasena: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Teléfono*</label>
              <input
                type="tel"
                className={styles.formInput}
                value={newTeacher.telefono}
                onChange={(e) => setNewTeacher({ ...newTeacher, telefono: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Departamento*</label>
              <input
                type="text"
                className={styles.formInput}
                value={newTeacher.departamento}
                onChange={(e) => setNewTeacher({ ...newTeacher, departamento: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Materias (máximo 4)*</label>
              <select
                multiple
                className={styles.formInput}
                value={newTeacher.materias}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  if (selected.length <= 4) {
                    setNewTeacher({ ...newTeacher, materias: selected });
                  } else {
                    alert("Solo puedes seleccionar hasta 4 materias");
                  }
                }}
                required
              >
                {materias.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rol</label>
              <select
                className={styles.formInput}
                value={newTeacher.rol}
                onChange={(e) => setNewTeacher({ ...newTeacher, rol: e.target.value })}
              >
                <option value="docente">Docente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className={styles.formActions}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setShowAddTeacherModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleAddTeacher}
                disabled={loading || apiStatus !== 'online'}
              >
                {loading ? <FaSpinner className={styles.spinner} /> : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;