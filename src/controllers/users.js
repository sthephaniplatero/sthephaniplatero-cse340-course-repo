import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';


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

        // 🔐 SESSION CORRECTA
        req.session.user = {
            id: user.user_id,
            name: user.name || null,
            email: user.email,
            role_name: user.role_name   // ✅ IMPORTANTE
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
    console.log('Logout ejecutado');

    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }

        res.redirect('/');
    });
};


// =========================
// AUTH MIDDLEWARE
// =========================
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('../views/pages/dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};


// =========================
// ROLE MIDDLEWARE (FIXED)
// =========================
const requireRole = (role) => {
    return (req, res, next) => {

        console.log("SESSION USER:", req.session.user);

        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // ✅ FIX: usamos role_name correctamente
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
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
    requireRole
};