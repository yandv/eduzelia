import XLSX from "xlsx";
import path from "path";
import fs from "fs";


var workbook = XLSX.utils.book_new(); // cria um novo workbook

var worksheet = XLSX.utils.json_to_sheet([
  { Nome: "João", Idade: 25, Cidade: "São Paulo" },
  { Nome: "Maria", Idade: 30, Cidade: "Rio de Janeiro" }
]);


XLSX.utils.book_append_sheet(workbook, worksheet, "MinhaPlanilha"); // adiciona o meu worksheet no workbook

XLSX.writeFile(workbook, "planilha.xlsx"); // salva o workbook


// const convertExceltoCSV = (execelfile, csvfile) =>{
// const workSheetsFromFile = XLSX.parse(fs.readFileSync(execelfile))



// }

// let execelfile = path.resolve(__dirname, "sample.xlsx");

// let csvfile = path.resolve(__dirname, "resultado.csv");

// convertExceltoCSV(execelfile, csvfile);