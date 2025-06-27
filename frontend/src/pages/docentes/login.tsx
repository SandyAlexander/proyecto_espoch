import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiLogIn, FiMail, FiLock, FiHelpCircle } from 'react-icons/fi';
import { FaUserShield, FaCloud } from 'react-icons/fa';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, size: number, x: number, y: number, delay: number, duration: number}>>([]);
  const router = useRouter();

  useEffect(() => {
    const particlesArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 15 + 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 10
    }));
    setParticles(particlesArray);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // Guardar token y datos del usuario
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirección según el rol
      if (data.user.rol === 'admin') {
        router.push('/admin/admindashboard');
      } else if (data.user.rol === 'docente') {
        router.push('/docentes/home');
      } else {
        throw new Error('Rol no reconocido');
      }

    } catch (error: any) {
      alert(error.message || 'Error en el servidor');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.overlay}></div>

      <div className={styles.particlesContainer}>
        {particles.map(particle => (
          <div 
            key={particle.id}
            className={styles.particle}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          >
            <FaCloud />
          </div>
        ))}
      </div>

      <header className={styles.topBar}>
        <div className={styles.logoContainer}>
          <FaUserShield className={styles.logoIcon} />
          <h1 className={styles.logoText}>SecureDocs ESPOCH</h1>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>
              {"INICIAR SESIÓN".split('').map((char, index) => (
                <span key={index} className={styles.titleLetter} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
              ))}
            </h2>
            <p className={styles.loginSubtitle}>Acceso seguro al sistema de gestión documental</p>
          </div>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  placeholder="usuario@espoch.edu.ec"
                  required
                />
                <div className={styles.inputUnderline}></div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <FiLock className={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  placeholder="••••••••"
                  required
                />
                <div className={styles.inputUnderline}></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.loginButton} ${isHovering ? styles.buttonHover : ''}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  <span className={styles.buttonText}>Verificando...</span>
                </>
              ) : (
                <>
                  <FiLogIn className={styles.buttonIcon} />
                  <span className={styles.buttonText}>Ingresar</span>
                  <span className={styles.buttonEffect}></span>
                </>
              )}
            </button>
          </form>

          <div className={styles.helpLink}>
            <a href="#" className={styles.helpLinkAnchor}>
              <FiHelpCircle className={styles.helpIcon} />
              <span>¿Problemas para ingresar?</span>
            </a>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          <span>Sistema de Gestión Documental - </span>
          <a href="mailto:soporte@espoch.edu.ec" className={styles.footerLink}>
            soporte@espoch.edu.ec
          </a>
        </p>
      </footer>
    </div>
  );
}
