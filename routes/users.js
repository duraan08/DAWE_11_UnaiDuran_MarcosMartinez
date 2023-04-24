var express = require('express');
var router = express();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.email){
    console.log("Usuario que ha iniciado la sesion: " + req.session.email);
    res.redirect("/admin");
  }
  else {
    res.send("<h1>Please login first</h1>");
  }
});

module.exports = router;
/*----------------------------------*/
// Concatenar paths
var path = require("path");
// Modulo para realizas validaciones en formularios
const { check, validationResult } = require('express-validator');
// Modulo para conectar con una base de datos MongoDB
const mongojs = require('mongojs')
// Objeto exportado de mongojs para identificar un elemento de una tabla de una BD
var ObjectId = mongojs.ObjectId;

// Conexion con la base de datos: nombre de la BD y de la tabla
const db = mongojs('clientesapp', ['users'])

// Middleware que carga ficheros estaticos de un directorio (public en este caso).
// Es decir, podemos cargar los elementos que haya en public/
router.use(express.static(path.join(__dirname, "public")));

// View Engine
router.set('view engine', 'ejs'); // motor de plantillas
router.set('views', path.join(__dirname, "views")); // carpeta donde guardar las vistas

// Middleware para el parseo de req.body
router.use(express.json()); // coge los datos en crudo y los pasa a json

// Que parsee datos que lleguen en la query HTTP y los deje como un objeto JSON
router.use(express.urlencoded({extended: false}));

// Declaracion y definicion de variables globales: en este caso errors
router.use(function (req, res, next) {
  res.locals.errors = null;
  next();
});

router.post('/add', [
      check("first_name", "El nombre es obligatorio").notEmpty(),
      check("last_name", "El apellido es obligatorio").notEmpty(),
      check("email", "El email es obligatorio").notEmpty()
    ],
    function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('index', {
          title:'clientes',
          users: users,
          errors: errors.array()
        });
      } else {
        var newUser = {
          "first_name" : req.body.first_name,
          "last_name" : req.body.last_name,
          "email" : req.body.email,
        };
        db.users.insertOne(newUser, function(err, resp) {
          if(err) {
            console.log(err);
          } else {
            db.users.insertOne(newUser);
          }
          res.redirect('/');
        });
        console.log(newUser)
      }
    });

router.delete('/delete/:id', function(req, res) {
  db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
    if(err) {
      console.log(err);
    }
    res.redirect(303, '/');
  });
});

router.post('/find/:id', function(req, res){
  db.users.find({_id: ObjectId(req.params.id)}, function(err, result){
    if (err){
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.post('/update/:id', function(req, res){
  db.users.update({_id: ObjectId(req.params.id)},
      {$set: {"first_name": req.body.first_name, "last_name": req.body.last_name, "email": req.body.email}},
      function(err, result){
        if (err){
          console.log(err);
        }
        res.redirect('/');
      });
});

router.get("/", function(req, res) { // peticion y respuesta como parametros
  db.users.find(function(err, docs) {
    if(err) {
      console.log(err);
    } else {
      console.log(docs);
      // para rellenar la plantilla
      res.render('index', {
        title: 'clientes',
        users: docs
      });
    }
  });

});
