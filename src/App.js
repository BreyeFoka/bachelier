// import React, { useState, useEffect } from 'react';
// import * as pdfjsLib from 'pdfjs-dist/webpack';

// const App = () => {
//   const [studentNumber, setStudentNumber] = useState('');
//   const [studentInfo, setStudentInfo] = useState(null);
//   const [pdfTextContent, setPdfTextContent] = useState('');

//   useEffect(() => {
//     const fetchAndParsePDF = async () => {
//       const response = await fetch('/results.pdf');
//       const arrayBuffer = await response.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       let textContent = '';

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         const pageText = content.items.map(item => item.str).join(' ');
//         textContent += `${pageText}\n`;
//       }
//       setPdfTextContent(textContent);
//     };

//     fetchAndParsePDF();
//   }, []);

//   const searchStudent = () => {
//     const regex = new RegExp(`\\b${studentNumber}\\b`, 'i');
//     const lines = pdfTextContent.split('\n');
//     const studentLine = lines.find(line => regex.test(line));

//     if (studentLine) {
//       const [number, name, centre, serie, sexe, situation, mention] = studentLine.split(' ');
//       setStudentInfo({
//         number,
//         name,
//         centre,
//         serie,
//         sexe,
//         situation,
//         mention,
//       });
//     } else {
//       setStudentInfo(null);
//     }
//   };

//   return (
//     <div className="App flex flex-col space-x-5 my-3 mx-0 overflow-y-scroll no-scrollbar">
//       <div className='mt-3 flex flex-col'>
//         <h1 className='text-3xl w-36 font-semibold border rounded-xl bg-orange-500 text-white px-2 py-2'>Bachelier</h1>
//       </div>
//       <div className='mt-64 flex flex-col justify-center items-center align-center'>
//         <h1 className='text-3xl font-semibold align-center'>Veuillez entrer votre matricule</h1>
//         <div className='mt-3 flex flex-row space-x-4'>
//           <input
//             type="text"
//             placeholder="Matricule, ex: GASSC17"
//             className='bg-white border border-orange-500 rounded-xl px-2 py-2'
//             value={studentNumber}
//             onChange={(e) => setStudentNumber(e.target.value)}
//           />
//           <button onClick={searchStudent} className='bg-orange-500 text-white rounded-xl px-2 py-2'>Rechercher</button>
//         </div>
//         {studentInfo ? (
//           <div className='mt-3 space-y-3 flex flex-col text-xl font-bold border rounded-xl border-orange-500 px-2 py-2'>
//             <p>Number: {studentInfo.number}</p>
//             <p>Name: {studentInfo.name}</p>
//             <p>Centre: {studentInfo.centre}</p>
//             <p>Serie: {studentInfo.serie}</p>
//             <p>Sexe: {studentInfo.sexe}</p>
//             <p>Situation: {studentInfo.situation}</p>
//             <p>Mention: {studentInfo.mention ? studentInfo.mention : 'passable'}</p>
//           </div>
//         ) : (
//           studentNumber && <p className='text-white bg-orange-500 rounded-xl px-2 py-2'>Dsl Votre numero est erroné ou ne figure pas sur la liste des admis</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function App() {
  const [studentNumber, setStudentNumber] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [spreadsheetData, setSpreadsheetData] = useState([]);

  useEffect(() => {
    fetch('/results.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setSpreadsheetData(jsonData);
      });
  }, []);

  const searchStudent = () => {
    const studentRow = spreadsheetData.find(row => row[0] === studentNumber);

    if (studentRow) {
      const [number, name, centre, serie, sexe, situation, mention] = studentRow;
      setStudentInfo({
        number,
        name,
        centre,
        serie,
        sexe,
        situation,
        mention,
      });
    } else {
      setStudentInfo(null);
    }
  };
  return (
    <div className="App flex flex-col  space-x-5 my-3 mx-0 overflow-y-scroll no-scrollbar">
      <div className='mt-3 flex flex-col'>
        <h1 className='text-3xl w-36 font-semibold border rounded-xl bg-orange-500  text-white px-2 py-2'>Bachelier</h1>
      </div>
      <div className='mt-64 flex flex-col justify-center items-center align-center'>
        <h1 className='text-3xl font-semibold align-center'>Veuillez entrer votre matricule</h1>
        <div className='mt-3 flex flex-row space-x-4'>
        <input
          type="text"
          placeholder="Matricule, ex: GASSC17"
          className='bg-white border border-orange-500 rounded-xl px-2 py-2'
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
        />
        <button onClick={searchStudent} className='bg-orange-500 text-white rounded-xl px-2 py-2'>Rechercher</button>
      </div>
      {studentInfo ? (
        <div className='mt-3  space-y-3 flex flex-col text-xl font-bold border rounded-xl border-orange-500 px-2 py-2'>
          <p>Number: {studentInfo.number}</p>
          <p>Name: {studentInfo.name}</p>
          <p>Centre: {studentInfo.centre}</p>
          <p>Serie: {studentInfo.serie}</p>
          <p>Sexe: {studentInfo.sexe}</p>
          <p>Situation: {studentInfo.situation}</p>
          <p>Mention: {studentInfo.mention ? studentInfo.mention : 'passable'}</p>
        </div>

      ) : (
        studentNumber && <p className='text-white bg-orange-500 rounded-xl mt-3 px-2 py-2'>Dsl Votre numero est erroné ou ne figure pas sur la liste des admis</p>
      )}
      </div>
    </div>
  );
}

export default App;