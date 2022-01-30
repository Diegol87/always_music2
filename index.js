// Los datos que se encuentran en el código relacionados a database y a la tabla que se estan consultando son los correctos por lo que si se quiere probar los errores de conexión al servidor y a la tabla se deberán cambiar

const { Pool } = require('pg')

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'alwaysmusic',
    password: 'esadiz87',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
}

const pool = new Pool(config)

const comandos = process.argv.slice(2)

async function registrar() {
    pool.connect(async(error_conexion, client, release) => {
        if(error_conexion) return console.error('No se logro establecer conexion con la base de datos', error_conexion.code)
            const SQLQuery = {
                name: 'fetch-user',
                text: 'insert into estudiantes (Nombre, Rut, Curso, Nivel) values ($1, $2, $3, $4) RETURNING *;',
                values: [`${comandos[1]}`, `${comandos[2]}`, `${comandos[3]}`, `${comandos[4]}`]
            }

            try {
                const res = await client.query(SQLQuery)
                console.log(`El estudiante ${comandos[1]} fue registrado con exito`)
            } catch (error_consulta) {
                console.error('No se logro registrar el nuevo estudiante' ,error_consulta.code)
            }

            release()
            pool.end()
    })
}

async function buscar() {
    pool.connect(async(error_conexion, client, release) => {
        if(error_conexion) return console.error('No se logro establecer conexion con la base de datos', error_conexion.code)
            const SQLQuery = {
                name: 'fetch-user',
                text: 'select * from estudiantes where Rut = $1',
                values: [`${comandos[1]}`]
            }

            try {
                const res = await client.query(SQLQuery)
                console.log(`El estudiante con el rut ${comandos[1]} es: `, res.rows)
            } catch (error_consulta) {
                console.error('No se logra encontrar la tabla de estudiantes', error_consulta.code)
            }

            release()
            pool.end()
    })
}

async function buscarTabla() {
    pool.connect(async(error_conexion, client, release) => {
        if(error_conexion) return console.error('No se logro establecer conexion con la base de datos', error_conexion.code)
            const SQLQuery = {
                name: 'fetch-user',
                rowMode: 'array',
                text: 'select * from estudiantes',
            }

            try {
                const res = await client.query(SQLQuery)
                console.log('Listado de estudiantes: ', res.rows)
            } catch(error_consulta) {
                console.log('No se logra encontrar la tabla con los datos', error_consulta.code)
            }

            release()
            pool.end()
    })
}

async function editarEstudiante() {
    pool.connect(async(error_conexion, client, release) => {
        if(error_conexion) return console.error('No se logro establecer conexion con la base de datos', error_conexion.code)
            const SQLQuery = {
                name: 'fetch-user',
                rowMode: 'array',
                text: `update estudiantes set Nivel = '${comandos[4]}' where Rut = '${comandos[2]}'`,
            }

            try {
                const res = await client.query(SQLQuery)
                console.log(`El estudiante ${comandos[1]} se ha editado con exito`)
            } catch(error_consulta) {
                console.error(`El estudiante ${comandos[1]} no se logro editar`, error_consulta.code)
            }

            release()
            pool.end()
    })
}

async function eliminarEstudiante() {
    pool.connect(async(error_conexion, client, release) => {
        if(error_conexion) return console.error('No se logro establecer conexion con la base de datos', error_conexion.code)
            const SQLQuery = {
                name: 'fetch-user',
                rowMode: 'array',
                text: `delete from estudiantes where Rut = '${comandos[1]}'`,
            }

            try {
                const res = await client.query(SQLQuery)
                console.log(`El estudiante ${comandos[1]} fue eliminado con exito`)
            } catch(error_consultar) {
                console.error('No se logra encontrar la tabla en la base de datos', error_consultar.code)
            }

            release()
            pool.end()
    })
}

if(comandos[0] === 'nuevo') {
    registrar()
}

if(comandos[0] === 'consultar') {
    buscar()
}

if(comandos[0] === 'consultarTabla') {
    buscarTabla()
}

if(comandos[0] === 'editar') {
    editarEstudiante()
}

if(comandos[0] === 'eliminar') {
    eliminarEstudiante()
}