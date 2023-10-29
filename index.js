import { createServer } from 'node:http'
import { readFileSync, createReadStream } from 'node:fs'

// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
// createServer((req, res) => {
// // # Example 1
//   // const file = readFileSync('big.file')

//   // res.write(file);
//   // res.end();

// // # Example 2
//   // createReadStream('big.file').pipe(res);

// }).listen(3000, () => console.log('running at 3000'))

// # Example 3
// socket
// node -e "process.stdin.pipe(require('net').connect(8080))"
// import net from 'node:net';
// net.createServer(socket => socket.pipe(process.stdout)).listen(8080);

// Evitando vazamento de memoria
import { pipeline, Readable, Writable} from 'node:stream';
import { promisify } from 'node:util';

const pipelineAsync = promisify(pipeline);

const readableStream = Readable({
  read: function() {
    this.push('Hello Dude 1')
    this.push('Hello Dude 2')
    this.push(null)
  }
});

const writable = Writable({
  write: function(chunk, enconding, callback) {
    console.log('msg', chunk.toString())
    callback()
  }
})

// await pipelineAsync(readableStream, process.stdout)
await pipelineAsync(readableStream, writable)

console.log('processo acabou')