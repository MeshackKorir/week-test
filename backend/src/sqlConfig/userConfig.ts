export const sqlConfig = {
    user:'sa',
    password:'09909090Mkk',
    database: 'TESTING',
    server: 'DESKTOP-B56002J\KIMWETICHKKORIR',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate:false
    }
};


console.log(sqlConfig);