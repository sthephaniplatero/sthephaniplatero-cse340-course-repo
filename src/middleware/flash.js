/**
 * Flash Message Middleware
 */

const flash = (req, res, next) => {
    // 1. Asegurar que existe la estructura en la sesión
    if (!req.session.flash) {
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };
    }

    // 2. Definir la función req.flash
    req.flash = function(type, message) {
        if (type && message) {
            // SET: Almacenar nuevo mensaje
            if (!req.session.flash[type]) req.session.flash[type] = [];
            req.session.flash[type].push(message);
            return;
        }

        if (type && !message) {
            // GET ONE TYPE: Obtener y limpiar un tipo específico
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // GET ALL: Obtener y limpiar todos los mensajes
        const allMessages = { ...req.session.flash };
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };
        return allMessages;
    };

    // 3. CRÍTICO: Hacer disponible en todas las vistas (EJS)
    res.locals.flash = req.flash;

    next();
};

export default flash;