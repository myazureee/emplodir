const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const os = require('os');
const session = require('express-session');
const winston = require('winston');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Konfigurieren des Winston-Loggers
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using https
}));

const db = mysql.createConnection({
    host: '127.0.0.1', // oder die IP-Adresse deines MySQL-Servers
    user: 'emplodir',
    password: 'YourSecurePassword',
    database: 'emplodir'
});

db.connect((err) => {
    if (err) {
        logger.error('Fehler beim Verbinden mit der Datenbank:', err.stack);
        return;
    }
    logger.info('Verbunden mit der Datenbank');
});

app.post('/login', (req, res) => {
    logger.info(`Login-Daten empfangen: ${JSON.stringify(req.body)}`);
    const { username, password } = req.body;
    const pnr = parseInt(username, 10); // Konvertiere pnr zu einem Integer
    const query = 'SELECT * FROM Login WHERE pnr = ? AND pw = ?';
    logger.info(JSON.stringify(req.body));

    db.query(query, [pnr, password], (error, results) => {
        if (error) {
            logger.error('Fehler bei der Datenbankabfrage:', error);
            res.status(500).json({ success: false, message: 'Datenbankfehler' });
            return;
        }
        logger.info('Ergebnisse der Abfrage:', JSON.stringify(results)); // Debugging-Zeile
        if (results.length > 0) {
            req.session.username = results[0].pnr; // Assuming you have a vorname field in your database
            logger.info('Sitzung gesetzt für Benutzer:', req.session.username); // Sitzung überprüfen
            req.session.save((err) => {
                if (err) {
                    logger.error('Fehler beim Speichern der Sitzung:', err);
                    res.status(500).json({ success: false, message: 'Fehler beim Speichern der Sitzung' });
                } else {
                    res.json({ success: true });
                }
            });
        } else {
            res.json({ success: false, message: 'Ungültige Anmeldedaten' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error('Fehler beim Abmelden:', err);
            return res.status(500).json({ success: false, message: 'Fehler beim Abmelden' });
        }
        res.json({ success: true });
    });
});

app.post('/query', (req, res) => {
    logger.info('SQL-Abfrage empfangen:', JSON.stringify(req.body));
    const { query } = req.body;

    db.query(query, (error, results) => {
        if (error) {
            logger.error('Fehler bei der Datenbankabfrage:', error);
            res.status(500).json({ success: false, message: 'Datenbankfehler' });
            return;
        }
        res.json({ success: true, data: results });
    });
});

app.get('/performance', (req, res) => {
    const query = 'SHOW GLOBAL STATUS LIKE "Threads_connected";';

    db.query(query, (error, results) => {
        if (error) {
            logger.error('Fehler bei der Datenbankabfrage:', error);
            res.status(500).json({ success: false, message: 'Datenbankfehler' });
            return;
        }
        res.json({ success: true, data: results });
    });
});

app.get('/ram-usage', (req, res) => {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usedMemoryPercentage = (usedMemory / totalMemory) * 100;

    res.json({ 
        success: true, 
        data: {
            totalMemory,
            freeMemory,
            usedMemory,
            usedMemoryPercentage
        }
    });
});

app.get('/internal', (req, res) => {
    logger.info('Überprüfung der Sitzung für Benutzer:', req.session.username); // Sitzung überprüfen
    logger.info('Sitzungsdaten:', JSON.stringify(req.session)); // Sitzung vollständig ausgeben
    if (!req.session.username) {
        logger.info('Keine gültige Sitzung, Weiterleitung zur about.html');
        return res.redirect('/about.html'); // Redirect to about page if not logged in
    }
    logger.info('Gültige Sitzung für Benutzer:', req.session.username);
    res.sendFile(path.join(__dirname, 'internal.html'));
});

app.get('/session-info', (req, res) => {
    logger.info('Anfrage für Sitzungsinformationen erhalten');
    if (req.session.username) {
        logger.info('Sitzungsinformationen:', req.session.username);
        res.json({ success: true, username: req.session.username });
    } else {
        logger.info('Keine Sitzung gefunden');
        res.json({ success: false });
    }
});

app.listen(3000, () => {
    logger.info('Server läuft auf http://localhost:3000');
});
