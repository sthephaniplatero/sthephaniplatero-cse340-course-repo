// controllers/errors.js

export const testErrorPage = (req, res) => {
    try {
        res.status(500).render('errors/test-error', {
            title: 'Test Error Page',
            message: 'Este es un error de prueba'
        });
    } catch (error) {
        console.error('Error en testErrorPage:', error);
        res.status(500).send('Error interno del servidor');
    }
};