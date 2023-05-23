const axios = require('axios');

const app = axios.create({
    baseURL: 'http://8.130.71.253:3000/',
    timeout: 1000,
});

function request(url,data={},method='get'){
    return new Promise((resolve, reject)=>{
        if(method.toLocaleLowerCase() == 'get'){
            app.get(url,{
                params:data
            }).then((res) => {
                resolve(res.data);
            }).catch((err)=>{
                reject(err);
            })
        }else if(method.toLocaleLowerCase()==='post'){
            app.post(url, data).then((res)=>{
                resolve(res.data);
            }).catch((err)=>{
                reject(err);
            })
        }
    })
}

module.exports = request;
