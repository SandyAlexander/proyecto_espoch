'use client';

import { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiUpload, FiDownload, FiTrash2, FiArrowLeft, FiUser, FiLogOut, FiMoreVertical, FiSearch } from 'react-icons/fi';
import { FaRegFilePdf, FaRegFileWord, FaRegFileExcel, FaRegFileImage, FaUserShield } from 'react-icons/fa';
import { RiFolderZipFill } from 'react-icons/ri';
import styles from './Home.module.css';

type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: string;
  modified: string;
  owner: string;
  icon?: JSX.Element;
  fileType?: 'pdf' | 'doc' | 'xls' | 'img' | 'zip' | 'other';
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export default function DocenteHome() {
  const [currentPath, setCurrentPath] = useState<string>('root');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: "Profesor Ejemplo",
    email: "profesor@espoch.edu.ec"
  });

  // Mock data con las carpetas y archivos específicos
  const mockFiles: FileItem[] = [
    // CARPETA: PLAN ANALITICO
    {
      id: '1',
      name: 'PLAN ANALITICO',
      type: 'folder',
      path: 'root/PLAN ANALITICO',
      modified: '2023-06-15',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de PLAN ANALITICO
    {
      id: '1-1',
      name: 'Plan Analítico Matemáticas.pdf',
      type: 'file',
      path: 'root/PLAN ANALITICO/Plan Analítico Matemáticas.pdf',
      size: '2.4 MB',
      modified: '2023-06-14',
      owner: 'Prof. Juan Pérez',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },
    {
      id: '1-2',
      name: 'Plan Analítico Física.docx',
      type: 'file',
      path: 'root/PLAN ANALITICO/Plan Analítico Física.docx',
      size: '1.8 MB',
      modified: '2023-06-13',
      owner: 'Prof. María Gómez',
      icon: <FaRegFileWord className={styles.fileIconDoc} />,
      fileType: 'doc'
    },

    // CARPETA: SILABO
    {
      id: '2',
      name: 'SILABO',
      type: 'folder',
      path: 'root/SILABO',
      modified: '2023-06-12',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de SILABO
    {
      id: '2-1',
      name: 'Sílabo Química General.pdf',
      type: 'file',
      path: 'root/SILABO/Sílabo Química General.pdf',
      size: '3.2 MB',
      modified: '2023-06-11',
      owner: 'Prof. Carlos Ruiz',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },
    {
      id: '2-2',
      name: 'Sílabo Programación.xlsx',
      type: 'file',
      path: 'root/SILABO/Sílabo Programación.xlsx',
      size: '1.5 MB',
      modified: '2023-06-10',
      owner: 'Prof. Ana López',
      icon: <FaRegFileExcel className={styles.fileIconXls} />,
      fileType: 'xls'
    },

    // CARPETA: PLANIFICACIÓN Y SEGUIMIENTO ACADÉMICO
    {
      id: '3',
      name: 'PLANIFICACIÓN Y SEGUIMIENTO ACADÉMICO',
      type: 'folder',
      path: 'root/PLANIFICACIÓN Y SEGUIMIENTO ACADÉMICO',
      modified: '2023-06-10',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de PLANIFICACIÓN Y SEGUIMIENTO ACADÉMICO
    {
      id: '3-1',
      name: 'Seguimiento Matemáticas.xlsx',
      type: 'file',
      path: 'root/PLANIFICACIÓN Y SEGUIMIENTO ACADÉMICO/Seguimiento Matemáticas.xlsx',
      size: '1.2 MB',
      modified: '2023-06-09',
      owner: 'Prof. Juan Pérez',
      icon: <FaRegFileExcel className={styles.fileIconXls} />,
      fileType: 'xls'
    },
    {
      id: '3-2',
      name: 'Planificación Física.docx',
      type: 'file',
      path: 'root/PLANIFICACIÓN Y SEGUIMIENTO ACADÉMICO/Planificación Física.docx',
      size: '0.8 MB',
      modified: '2023-06-08',
      owner: 'Prof. María Gómez',
      icon: <FaRegFileWord className={styles.fileIconDoc} />,
      fileType: 'doc'
    },

    // CARPETA: INFORME DE PRUEBA DE DIAGNOSTICO
    {
      id: '4',
      name: 'INFORME DE PRUEBA DE DIAGNOSTICO',
      type: 'folder',
      path: 'root/INFORME DE PRUEBA DE DIAGNOSTICO',
      modified: '2023-06-05',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de INFORME DE PRUEBA DE DIAGNOSTICO
    {
      id: '4-1',
      name: 'Resultados Diagnóstico Matemáticas.pdf',
      type: 'file',
      path: 'root/INFORME DE PRUEBA DE DIAGNOSTICO/Resultados Diagnóstico Matemáticas.pdf',
      size: '4.5 MB',
      modified: '2023-06-04',
      owner: 'Prof. Juan Pérez',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },
    {
      id: '4-2',
      name: 'Resultados Diagnóstico Física.pdf',
      type: 'file',
      path: 'root/INFORME DE PRUEBA DE DIAGNOSTICO/Resultados Diagnóstico Física.pdf',
      size: '3.8 MB',
      modified: '2023-06-03',
      owner: 'Prof. María Gómez',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },

    // CARPETA: GUIAS DE PRACTICAS DE LABORATORIO
    {
      id: '5',
      name: 'GUIAS DE PRACTICAS DE LABORATORIO',
      type: 'folder',
      path: 'root/GUIAS DE PRACTICAS DE LABORATORIO',
      modified: '2023-05-30',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de GUIAS DE PRACTICAS DE LABORATORIO
    {
      id: '5-1',
      name: 'Guía Laboratorio Química.pdf',
      type: 'file',
      path: 'root/GUIAS DE PRACTICAS DE LABORATORIO/Guía Laboratorio Química.pdf',
      size: '5.2 MB',
      modified: '2023-05-29',
      owner: 'Prof. Carlos Ruiz',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },
    {
      id: '5-2',
      name: 'Guía Laboratorio Física.docx',
      type: 'file',
      path: 'root/GUIAS DE PRACTICAS DE LABORATORIO/Guía Laboratorio Física.docx',
      size: '2.7 MB',
      modified: '2023-05-28',
      owner: 'Prof. María Gómez',
      icon: <FaRegFileWord className={styles.fileIconDoc} />,
      fileType: 'doc'
    },

    // CARPETA: DISTRIBUTIVO DE LA JORNADA LABORAL
    {
      id: '6',
      name: 'DISTRIBUTIVO DE LA JORNADA LABORAL',
      type: 'folder',
      path: 'root/DISTRIBUTIVO DE LA JORNADA LABORAL',
      modified: '2023-05-25',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de DISTRIBUTIVO DE LA JORNADA LABORAL
    {
      id: '6-1',
      name: 'Distributivo Horario.xlsx',
      type: 'file',
      path: 'root/DISTRIBUTIVO DE LA JORNADA LABORAL/Distributivo Horario.xlsx',
      size: '0.9 MB',
      modified: '2023-05-24',
      owner: 'Coordinación',
      icon: <FaRegFileExcel className={styles.fileIconXls} />,
      fileType: 'xls'
    },
    {
      id: '6-2',
      name: 'Asignación Aulas.pdf',
      type: 'file',
      path: 'root/DISTRIBUTIVO DE LA JORNADA LABORAL/Asignación Aulas.pdf',
      size: '1.1 MB',
      modified: '2023-05-23',
      owner: 'Coordinación',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },

    // CARPETA: INFORMES DE PRACTICAS DE LABORATORIO
    {
      id: '7',
      name: 'INFORMES DE PRACTICAS DE LABORATORIO',
      type: 'folder',
      path: 'root/INFORMES DE PRACTICAS DE LABORATORIO',
      modified: '2023-05-20',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de INFORMES DE PRACTICAS DE LABORATORIO
    {
      id: '7-1',
      name: 'Informe Lab. Química Grupo A.pdf',
      type: 'file',
      path: 'root/INFORMES DE PRACTICAS DE LABORATORIO/Informe Lab. Química Grupo A.pdf',
      size: '2.8 MB',
      modified: '2023-05-19',
      owner: 'Prof. Carlos Ruiz',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },
    {
      id: '7-2',
      name: 'Informe Lab. Física Grupo B.pdf',
      type: 'file',
      path: 'root/INFORMES DE PRACTICAS DE LABORATORIO/Informe Lab. Física Grupo B.pdf',
      size: '3.1 MB',
      modified: '2023-05-18',
      owner: 'Prof. María Gómez',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },

    // CARPETA: INFORMES DE TUTORIAS
    {
      id: '8',
      name: 'INFORMES DE TUTORIAS',
      type: 'folder',
      path: 'root/INFORMES DE TUTORIAS',
      modified: '2023-05-15',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de INFORMES DE TUTORIAS
    {
      id: '8-1',
      name: 'Informe Tutorías Mayo.docx',
      type: 'file',
      path: 'root/INFORMES DE TUTORIAS/Informe Tutorías Mayo.docx',
      size: '1.5 MB',
      modified: '2023-05-14',
      owner: 'Prof. Ana López',
      icon: <FaRegFileWord className={styles.fileIconDoc} />,
      fileType: 'doc'
    },
    {
      id: '8-2',
      name: 'Seguimiento Estudiantes.xlsx',
      type: 'file',
      path: 'root/INFORMES DE TUTORIAS/Seguimiento Estudiantes.xlsx',
      size: '0.7 MB',
      modified: '2023-05-13',
      owner: 'Prof. Juan Pérez',
      icon: <FaRegFileExcel className={styles.fileIconXls} />,
      fileType: 'xls'
    },

    // CARPETA: INFORMES DE GIRAS ACADEMICAS Y SALIDAS
    {
      id: '9',
      name: 'INFORMES DE GIRAS ACADEMICAS Y SALIDAS',
      type: 'folder',
      path: 'root/INFORMES DE GIRAS ACADEMICAS Y SALIDAS',
      modified: '2023-05-10',
      owner: 'Coordinación',
      icon: <FiFolder className={styles.folderIcon} />
    },
    // Archivos dentro de INFORMES DE GIRAS ACADEMICAS Y SALIDAS
    {
      id: '9-1',
      name: 'Informe Gira Industrial.pdf',
      type: 'file',
      path: 'root/INFORMES DE GIRAS ACADEMICAS Y SALIDAS/Informe Gira Industrial.pdf',
      size: '6.3 MB',
      modified: '2023-05-09',
      owner: 'Prof. Carlos Ruiz',
      icon: <FaRegFilePdf className={styles.fileIconPdf} />,
      fileType: 'pdf'
    },
    {
      id: '9-2',
      name: 'Fotos Gira Industrial.zip',
      type: 'file',
      path: 'root/INFORMES DE GIRAS ACADEMICAS Y SALIDAS/Fotos Gira Industrial.zip',
      size: '24.5 MB',
      modified: '2023-05-08',
      owner: 'Prof. Ana López',
      icon: <RiFolderZipFill className={styles.fileIconZip} />,
      fileType: 'zip'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      // Filtrar archivos según la ruta actual
      const filteredFiles = mockFiles.filter(file => {
        // Si estamos en la raíz, mostrar solo carpetas principales
        if (currentPath === 'root') {
          return file.path.split('/').length === 2 && file.type === 'folder';
        }
        // Si estamos en una subcarpeta, mostrar archivos que coincidan exactamente con la ruta
        return file.path.startsWith(currentPath + '/') && 
               file.path.split('/').length === currentPath.split('/').length + 1 &&
               file.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      
      setFiles(filteredFiles);
      updateBreadcrumbs();
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentPath, searchQuery]);

  const updateBreadcrumbs = () => {
    const paths = currentPath.split('/');
    const crumbs = paths.map((path, index) => ({
      name: path === 'root' ? 'Inicio' : path,
      path: paths.slice(0, index + 1).join('/')
    }));
    setBreadcrumbs(crumbs);
  };

  const navigateToFolder = (path: string) => {
    setIsLoading(true);
    setCurrentPath(path);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.path);
    } else {
      alert(`Se abrirá el archivo: ${file.name}`);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`Archivo ${selectedFile.name} subido correctamente (simulado)`);
      setShowUploadModal(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = (file: FileItem) => {
    // Solo permitir eliminar archivos, no carpetas
    if (file.type === 'file' && file.owner === currentUser.name) {
      alert(`Archivo ${file.name} eliminado (simulado)`);
    } else if (file.type === 'folder') {
      alert('No puedes eliminar carpetas');
    } else {
      alert('Solo puedes eliminar tus propios archivos');
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Barra superior */}
      <header className={styles.topBar}>
        <div className={styles.logoContainer}>
          <FaUserShield className={styles.logoIcon} />
          <h1 className={styles.logoText}>SecureDocs ESPOCH</h1>
        </div>
        
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.profileContainer} onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <FiUser className={styles.profileIcon} />
          <span className={styles.profileName}>{currentUser.name}</span>
          
          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <div className={styles.profileMenuItem}>
                <FiUser className={styles.menuIcon} /> Mi perfil
              </div>
              <div className={styles.profileMenuItem}>
                <FiLogOut className={styles.menuIcon} /> Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        {/* Migas de pan */}
        <div className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              <button 
                onClick={() => navigateToFolder(crumb.path)}
                className={styles.breadcrumbLink}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>

        {/* Botones de acción */}
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionButton}
            onClick={() => currentPath !== 'root' && navigateToFolder(breadcrumbs[breadcrumbs.length - 2]?.path || 'root')}
            disabled={currentPath === 'root'}
          >
            <FiArrowLeft className={styles.buttonIcon} /> Atrás
          </button>
          
          <button 
            className={styles.actionButtonPrimary}
            onClick={() => setShowUploadModal(true)}
          >
            <FiUpload className={styles.buttonIcon} /> Subir archivo
          </button>
        </div>

        {/* Lista de archivos */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando archivos...</p>
          </div>
        ) : (
          <div className={styles.fileGrid}>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <div key={file.id} className={styles.fileCard}>
                  <div 
                    className={styles.fileIconContainer}
                    onClick={() => handleFileClick(file)}
                  >
                    {file.icon || <FiFile className={styles.fileIcon} />}
                  </div>
                  
                  <div className={styles.fileInfo}>
                    <h3 
                      className={styles.fileName}
                      onClick={() => handleFileClick(file)}
                    >
                      {file.name}
                    </h3>
                    <p className={styles.fileMeta}>
                      <span>{file.size}</span>
                      <span>Subido por: {file.owner}</span>
                      <span>{file.modified}</span>
                    </p>
                  </div>
                  
                  <div className={styles.fileActions}>
                    {file.type === 'file' && (
                      <>
                        <button 
                          className={styles.fileActionButton}
                          onClick={() => alert(`Descargando ${file.name}`)}
                        >
                          <FiDownload />
                        </button>
                        
                        {file.owner === currentUser.name && (
                          <button 
                            className={styles.fileActionButton}
                            onClick={() => handleDelete(file)}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <FiFolder className={styles.emptyIcon} />
                <p>No hay archivos en esta carpeta</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de subida de archivos */}
      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Subir archivo</h2>
            <div className={styles.uploadArea}>
              {selectedFile ? (
                <div className={styles.selectedFile}>
                  <FiFile className={styles.fileIcon} />
                  <span>{selectedFile.name}</span>
                  <button 
                    className={styles.removeFileButton}
                    onClick={() => setSelectedFile(null)}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <FiUpload className={styles.uploadIcon} />
                  <p>Arrastra tu archivo aquí o</p>
                  <input
                    type="file"
                    id="fileUpload"
                    className={styles.fileInput}
                    onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  />
                  <label htmlFor="fileUpload" className={styles.uploadButton}>
                    Seleccionar archivo
                  </label>
                </>
              )}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancel}
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className={styles.modalConfirm}
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Subir archivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}