import bcrypt from 'bcrypt';
import { 
    createUser, 
    authenticateUser, 
    getAllUsersFromDB 
} from '../models/users.js';


// =========================
// REGISTER
// =========================
const showUserRegistrationForm = (req, res) => {
    res.render('../views/pages/register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        await createUser(name, email, passwordHash);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// =========================
// LOGIN
// =========================
const showLoginForm = (req, res) => {
    res.render('../views/pages/login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.user_id,
            name: user.name || null,
            email: user.email,
            role_name: user.role_name   
        };

        req.flash('success', 'Login successful!');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

// =========================
// LOGOUT
// =========================
const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/');
    });
};

// =========================
// DASHBOARD
// =========================
const showDashboard = async (req, res) => {
    try {
        const user = req.session.user;
        
        // 1. Asegúrate de obtener los datos de la base de datos
        // Usamos 'let' o 'const' para definirla correctamente
        const users = await getAllUsersFromDB(); 

        // 2. Renderiza pasando tanto el 'user' (sesión) como los 'users' (lista)
        res.render('../views/pages/dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            user: user,
            users: users // Esta variable ahora estará definida
        });
    } catch (error) {
        console.error('Error in showDashboard:', error);
        // Si hay un error, al menos enviamos un array vacío para que no falle la vista
        res.render('../views/pages/dashboard', {
            title: 'Dashboard',
            name: req.session.user.name,
            email: req.session.user.email,
            user: req.session.user,
            users: [] 
        });
    }
};

// =========================
// USERS PAGE (ADMIN ONLY)
// =========================
const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsersFromDB();
        res.render('../views/pages/users', { 
            title: 'Manage Users', 
            users: users,
            user: req.session.user 
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'Could not load users.');
        res.redirect('/dashboard');
    }
};

// =========================
// MIDDLEWARES
// =========================
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }
        next();
    };
};



// =========================
// EXPORTS
// =========================
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};