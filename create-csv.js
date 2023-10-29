import { Readable, Transform, pipeline } from 'node:stream';
import { promisify } from 'util'
import { createWriteStream } from 'node:fs'

const pipelineAsync = promisify(pipeline);

// step 1 - create/get data (api, database, files, etc...)
const readableStream = Readable({
  read: function() {
    for (let index = 0; index < 1e5; index++) {
      const person = {
        id: index,
        name: Date.now() + index
      }

      const data = JSON.stringify(person)
      this.push(data)
    }

    // avisa que acabaram os dados
    this.push(null)
  }
});

// step 2 - transform data to CSV
const writableMapToCSV = Transform({
  transform: function(chunk, enconding, cb) {
    const data = JSON.parse(chunk);
    const result = `${data.id}, ${data.name}\n`;

    cb(null, result);
  }
});

// step 3 - add Header
const setHeader = Transform({
  transform: function(chunk, enconding, cb) {
    this.count = this.count ?? 0;

    if (this.count) {
      return cb(null, chunk);
    }
    
    this.count += 1;
    
    const headerCSV = "id,name\n".concat(chunk);

    cb(null, headerCSV);
  }
});

pipelineAsync(
  readableStream,
  writableMapToCSV,
  setHeader,
  createWriteStream('my.csv') 
);