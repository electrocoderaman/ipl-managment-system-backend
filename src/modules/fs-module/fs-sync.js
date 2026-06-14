import fs from "node:fs";

// 1. WRITE
// fs.writeFileSync("test.txt", "Hello from sync fs!");

// 2. READ

// const data =  fs.readFileSync("test.txt","utf-8");
// fs.appendFileSync("test.txt", "\n hey how are you this is aman");

// fs.mkdirSync('myFolder/innerFolder',{recursive:true})

// console.log(data);

// fs.unlinkSync('test.txt')

// fs.renameSync('newText.txt','test1.txt')

// fs.cpSync('.env', 'finalTest.txt')

fs.rmSync("myFolder", { recursive: true  });
