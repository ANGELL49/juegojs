class Usuario {
    constructor(nombre, correo, contraseña) {
        this.nombre = nombre;
        this.correo = correo;
        this.contraseña = contraseña;
    }

    toString() {
        return `${this.nombre}|${this.correo}|${this.contraseña}`;
    }

    static fromString(usuarioStr) {
        const [nombre, correo, contraseña] = usuarioStr.split('|');
        return new Usuario(nombre, correo, contraseña);
    }
    
    static guardarUsuario(usuario) {
        let usuarios = localStorage.getItem('usuarios');
        usuarios = usuarios ? `${usuarios}\n${usuario.toString()}` : usuario.toString();
        localStorage.setItem('usuarios', usuarios);
    }

    static cargarUsuarios() {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? usuarios.split('\n').map(Usuario.fromString) : [];
    }

    static esCorreoRegistrado(correo) {
        const usuarios = Usuario.cargarUsuarios();
        return usuarios.some(usuario => usuario.correo === correo);
    }

    static validarUsuario(correo, contraseña) {
        const usuarios = Usuario.cargarUsuarios();
        return usuarios.find(usuario => usuario.correo === correo && usuario.contraseña === contraseña);
    }
}

class JuegoPiedraPapelTijeras {
    constructor() {
        this.triunfos = 0;
        this.perdidas = 0;
        this.resultado = document.querySelector('.resultado');
        this.puntaje = document.getElementById('puntaje');
        this.init();
    }

    mostrarVista(vistaId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        const vista = document.getElementById(vistaId);
        if (vista) {
            vista.classList.remove('hidden');
            vista.classList.add('active');
        } else {
            console.error(`Vista con id '${vistaId}' no encontrada.`);
        }
    }

    aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    eleccion(jugada) {
        switch (jugada) {
            case 1:
                return "Piedra 💎";
            case 2:
                return "Papel 📋";
            case 3:
                return "Tijera ✂";
            default:
                return "MAL ELEGIDO";
        }
    }

    jugarRonda(jugador) {
        const pc = this.aleatorio(1, 3);
        const pcEleccion = this.eleccion(pc);
        const jugadorEleccion = this.eleccion(jugador);
    
        let mensaje = `PC elige: ${pcEleccion} | Tú eliges: ${jugadorEleccion}`;
    
        if (pc === jugador) {
            mensaje += " → EMPATE";
        } else if (
            (jugador === 1 && pc === 3) ||
            (jugador === 2 && pc === 1) ||
            (jugador === 3 && pc === 2)
        ) {
            mensaje += " → GANASTE";
            this.triunfos++;
        } else {
            mensaje += " → PERDISTE";
            this.perdidas++;
        }
    
        this.actualizarResultado(mensaje, jugadorEleccion, pcEleccion);
    }

    actualizarResultado(mensaje, jugadorEleccion, pcEleccion) {

        const mensajeElecciones = `PC elige: ${pcEleccion} | Tú eliges: ${jugadorEleccion}`;
        document.getElementById('mensajeElecciones').textContent = mensajeElecciones;

        this.resultado.innerHTML = mensaje;

        this.puntaje.textContent = `Triunfos: ${this.triunfos} | Pérdidas: ${this.perdidas}`;
    }

    init() {
        // Mostrar solo la vista principal al inicio
        this.mostrarVista('menuPrincipal');

        // Botón "Comenzar" en menú principal
        document.getElementById('iniciarJ').addEventListener('click', () => {
            this.mostrarVista('formInicioSesion'); 
        });

        // Inicio de sesión
        document.getElementById('formInicioSesion').addEventListener('submit', (e) => {
            e.preventDefault();

            const correo = document.getElementById('correo').value;
            const contraseña = document.getElementById('contraseña').value;

            const usuarios = Usuario.cargarUsuarios();

            // Buscar usuario por correo
            const usuarioExistente = usuarios.find(usuario => usuario.correo === correo);

            if (!usuarioExistente) {
                alert('Usuario no registrado. Por favor, regístrate.');
            } else if (usuarioExistente.contraseña !== contraseña) {
                alert('Usuario o contraseña incorrectxo. Por favor, intenta nuevamente.');
            } else {
                document.getElementById('mensajeBienvenida').textContent = `¡Bienvenido, ${usuarioExistente.nombre}!`;
                this.mostrarVista('juegoContenedor');
            }
        });

        // Ver el formulario de registro
        document.getElementById('linkRegistro').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarVista('formRegistroUsuario'); 
        });

        document.getElementById('formRegistroUsuario').addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('registroNombre').value;
            const correo = document.getElementById('registroCorreo').value;
            const contraseña = document.getElementById('registroContraseña').value;

            if (Usuario.esCorreoRegistrado(correo)) {
                alert('Este correo ya está registrado. Por favor, usa otro correo.');
            } else {
                const nuevoUsuario = new Usuario(nombre, correo, contraseña);
                Usuario.guardarUsuario(nuevoUsuario);

                alert('Registrado exitosamente.');
                this.mostrarVista('formInicioSesion');
            }
        });

        // Regreso al inicio de sesión desde registrar
        document.getElementById('linkInicioSesion').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarVista('formInicioSesion');
        });

        document.querySelectorAll('.elegir').forEach((button, index) => {
            button.addEventListener('click', () => this.jugarRonda(index + 1));
        });

        // Botón "Cerrar Sesión"
        document.getElementById('cerrarSesion').addEventListener('click', () => {
            this.mostrarVista('menuPrincipal');
        });
    }
}

// Iniciar el juego
new JuegoPiedraPapelTijeras();
