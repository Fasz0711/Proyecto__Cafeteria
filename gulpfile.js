// src- Identifica y Lee los archivos que le indiquemos
// dest- Sirve para guardar los archivos procesados
// watch- Vigila los cambios en los archivos
// series- Ejecuta una tarea y hasta que no termine no ejecuta la siguiente
// parallel- Ejecuta una serie de funciones al mismo tiempo
const { src,dest, watch,series,parallel }= require('gulp'); // Usando {} Importa multiples funciones de gulp 

// sass- Compila el archivo scss
const sass = require('gulp-sass')( require ('sass')); // Sin {} Importa una función sass de gulp
const postcss = require('gulp-postcss'); // Permite usar plugins de postcss
const autoprefixer = require('autoprefixer'); // Agrega prefijos a las propiedades css
const sourcemaps = require('gulp-sourcemaps'); // Muestra el archivo original en el navegador
const cssnano = require('cssnano'); // Minifica el archivo css

//IMAGENES
const imagemin = require('gulp-imagemin');//Comprime iamgenes
const webp = require('gulp-webp'); // Convierte imagenes a webp
const avif = require('gulp-avif'); // Convierte imagenes a avif 

//
function css( done){  
    // pasos para procesar el css
    // 1. Donde esta el archivo scss, 2. Compilarlo, 3. Guardar el archivo

    //pipe sirve para pasarle una serie de funciones a un archivo
    src( 'src/scss/app.scss' ) // Identifica el archivo app.scss
        .pipe(sourcemaps.init()) // Inicia el mapeo del archivo
        .pipe(sass()) // Compila el archivo app.scss
        .pipe(postcss([autoprefixer(),cssnano])) // Agrega prefijos a las propiedades css
        .pipe(sourcemaps.write('.')) // Escribe el mapeo del archivo
        .pipe( dest('build/css') ) // Crea y guarda el archivo app.css en la carpeta build/css

    done();  // Termina la función
    
} 

//REDUCIR PESO EN IMAGENES
function imagenes(){
    // Pasos para procesar las imagenes
    return src('src/img/**/*') // Identifica todas las imagenes de la carpeta img
        .pipe(imagemin({optimizationLevel:3})) // Comprime las imagenes
        .pipe(dest('build/img')); // Copia las imagenes en la carpeta build/img

    //ESTO SOLO FUNCIONA PARA GULP 4, 
    //PARA CAMBIAR LA VERSION ACTUAL A GULP 4, SE DEBE CAMBIAR LA VERSION EN EL PACKAGE.JSON EJECUTANDO
    //npm i -D gulp@4
}

//Convierte las imagenes a webp
function versionWebp(){
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(dest('build/img'));
}

//Convierte las imagenes a avif
function versionAvif(){
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif())
        .pipe(dest('build/img'));
}


// Vigila los cambios en los archivos
function dev(){
    // Vigila los cambios en los archivos scss
    watch('src/scss/**/*.scss', css); // Vigila los cambios en todos los archivos scss y ejecuta la función css 
    watch('src/img/**/*',imagenes) // Vigila los cambios en todos los archivos img y ejecuta la función imagenes
}

exports.css = css; // Exporta la función css
exports.dev = dev; // Exporta la función dev
exports.imagenes = imagenes; // Exporta la función imagenes
exports.versionWebp = versionWebp; // Exporta la función versionWebp
exports.versionAvif = versionAvif; // Exporta la función versionAvif
exports.default = series(imagenes,versionWebp,versionAvif,css,dev); // Exporta  como default