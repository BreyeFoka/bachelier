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
      const [number, name, serie, sexe, situation, mention] = studentRow;
      setStudentInfo({
        number,
        name,
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
        <h1 className='text-3xl w-36 font-semibold border rounded-xl bg-orange-500 text-white px-2 py-2'>Bachelier</h1>
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
          <p>Serie: {studentInfo.serie}</p>
          <p>Sexe: {studentInfo.sexe}</p>
          <p>Situation: {studentInfo.situation}</p>
          <p>Mention: {studentInfo.mention ? studentInfo.mention : 'passable'}</p>
        </div>

      ) : (
        studentNumber && <p>No student found with that number.</p>
      )}
      </div>
    </div>
  );
}

export default App;
