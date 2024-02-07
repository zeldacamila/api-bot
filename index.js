const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/obtenerToken', async (req, res) => {
    const { id } = req.query; // Obtener el ID del parámetro de consulta

    if (!id) {
        return res.status(400).send('Se requiere un ID.');
    }

    // Iniciar Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navegar a la página de inicio de sesión de personas
    await page.goto('https://catalogo-vpfe-hab.dian.gov.co/User/PersonLogin');

    // Esperar a que el formulario de inicio de sesión sea visible
    await page.waitForSelector('form[method="post"]', { visible: true });

    // Seleccionar el tipo de identificación
    // Asumiendo que el ID del selector es "PersonIdentificationType" basado en el HTML proporcionado
    await page.select('#PersonIdentificationType', '10910094'); // '10910094' corresponde a 'Cédula de ciudadanía'

    // Introducir el número de cédula en el campo correspondiente
    // Asumiendo que el ID del campo es "PersonCode" basado en el HTML proporcionado
    await page.type('#PersonCode', `${id}`, { delay: 100 }); // Reemplaza 'tu_numero_de_cedula' con el número real

    // Hacer clic en el botón de enviar el formulario
    // Asumiendo que el botón se puede identificar por el texto "Entrar"
    await page.click('button.btn.btn-primary');

    // Asegúrate de manejar los errores adecuadamente
    // Por ejemplo, si la página no se carga o el selector no se encuentra

    // Cuando termines, cierra el navegador y envía una respuesta
    await browser.close();
    res.send('Token solicitado para el ID: ' + id);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Middleware para parsear el cuerpo de las solicitudes POST en formato JSON
app.use(bodyParser.json());

// Definir el endpoint que recibe el token
app.post('/recibirToken', (req, res) => {
    const { token } = req.body; // Extraer el token del cuerpo de la solicitud
    console.log('Token recibido:', token); // Mostrar el token en la consola
    res.send('Token recibido con éxito'); // Enviar una respuesta al cliente
});
