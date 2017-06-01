const fs = require('fs');

const
    fileName = 'bd.json',
    readBD = () => new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (error, data) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.info(data);
                resolve(JSON.parse(data));
            }
        });
    }),
    writeFile = data => new Promise(function (resolve, reject) {
        fs.writeFile(fileName, JSON.stringify(data), error => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve();
            }
        });
    }),
    INIT_ID = 1,
    SPLICE_DELETE= 1,
    HTTP_STATUS_ERROR = 500,
    RADIX = 10,
    parseData = data => {
        const obj = {};

        Object.keys(data).forEach(key => {
            const value = data[key];

            obj[key] =
                value === 'true' ?
                    true :
                value === 'false' ?
                    false :
                isNaN(value) ?
                    value :
                    parseInt(value, RADIX);
        });

        return obj;
    },
    generateId = json => {
        let id = INIT_ID;
        const _find = item => item.id === id;

        while (json.find(_find)) {
            id++;
        }

        return id;
    },
    createPost = (app, name, json) => {
        const table = json[name];
        app.post(`/${name}`, (req, res) => {

            const obj = parseData(req.body);
            obj.id = generateId(table);

            table.push(obj);

            writeFile(json)
                .then(()=>{
                    res.send(obj);
                })
                .catch(error=>{
                    res.status(HTTP_STATUS_ERROR).send(error);
                })
        })
        console.info(`Created post /${name}`);
    },
    createPut = (app, name, json) => {
        const table = json[name];
        app.put(`/${name}/:id`, (req, res) => {

            const
                obj = table.find(({id}) => id === parseInt(req.params.id, RADIX)),
                data = parseData(req.body);

            for (let key in data) {
                obj[key] = data[key];
            }

            writeFile(json)
                .then(()=>{
                    res.send(obj);
                })
                .catch(error=>{
                    res.status(HTTP_STATUS_ERROR).send(error);
                })
        })
        console.info(`Created put /${name}/:id`);
    },
    createDelete = (app, name, json) => {
        const table = json[name];
        app.delete(`/${name}/:id`, (req, res) => {

            const obj = table.find(({id}) => id === parseInt(req.params.id, RADIX));
            let index = table.indexOf(obj);
            table.splice(index, SPLICE_DELETE);

            writeFile(json)
                .then(()=>{
                    res.send('success');
                })
                .catch(error=>{
                    res.status(HTTP_STATUS_ERROR).send(error);
                })
        })
        console.info(`Created delete /${name}/:id`);
    },
    createAll = (app, name, json) => {
        createDelete(app, name, json);
        createPost(app, name, json);
        createPut(app, name, json);
    };

module.exports = {
    readBD,
    createAll
};
