const fs = require('fs');
const http = require('http');
const url  = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
console.log(json);
const laptopData = JSON.parse(json);
console.log(laptopData);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  if (pathName === '/products' || pathName === '/'){
    res.writeHead(200, {'Content-type': 'text/html' });
    fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) =>{
      let overviewoutput = data;
      fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) =>{
        console.log(data);
        const cards = laptopData.map(el => {
          return replaceHtml(data, el);
        }).join('');
        let output = overviewoutput.replace('{%CARDS%}', cards);
        res.end(output);
      });
    });
  }else if(pathName === '/laptop' && id < laptopData.length){
    res.writeHead(200, {'Content-type': 'text/html' });
    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) =>{
      const laptop = laptopData[id];
      const output = replaceHtml(data, laptop);
      res.end(output);
    });
  }else if((/\.(jpg|png|jpeg|gif)$/i).test(pathName)){
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data)=>{
      res.writeHead(200, {'Content-type': 'image/jpg' });
      res.end(data);
    });
  }
  else{
    res.writeHead(404, {'Content-type': 'text/html' });
    res.end('this is a not valid url!');
  }
  
})

server.listen(1337, '127.0.0.1', () =>{
  console.log('listening the request now');
});

function replaceHtml(original, laptop){
  let output = original.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}