const mysql = require("mysql");
const dotenv = require("dotenv");
const readLineSync = require("readline-sync");

dotenv.config();

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

function takeInputs() {
  // Student Name
  let studentName;

  do {
    studentName = readLineSync.question(
      "Enter student Name (max-length: 30): "
    );
  } while (studentName.length == 0 || studentName.length > 30);

  // College name
  let collegeName;

  do {
    collegeName = readLineSync.question(
      "Enter college Name (max-length: 50): "
    );
  } while (collegeName.length == 0 || collegeName.length > 50);

  // Diff rounds
  // Round 1
  let round1Marks;

  do {
    round1Marks = parseFloat(
      readLineSync.question("Enter round 1 marks (max-marks: 10): ")
    );
  } while (isNaN(round1Marks) || round1Marks < 0 || round1Marks > 10);

  // Round 2
  let round2Marks;

  do {
    round2Marks = parseFloat(
      readLineSync.question("Enter round 2 marks (max-marks: 10): ")
    );
  } while (isNaN(round2Marks) || round2Marks < 0 || round2Marks > 10);

  // Round 3
  let round3Marks;

  do {
    round3Marks = parseFloat(
      readLineSync.question("Enter round 3 marks (max-marks: 10): ")
    );
  } while (isNaN(round3Marks) || round3Marks < 0 || round3Marks > 10);

  // Technical round
  let technicalRoundMarks;

  do {
    technicalRoundMarks = parseFloat(
      readLineSync.question("Enter technical round marks (max-marks: 20): ")
    );
  } while (
    isNaN(technicalRoundMarks) ||
    technicalRoundMarks < 0 ||
    technicalRoundMarks > 20
  );

  // Calling Insert Query function
  insertQuery(
    studentName,
    collegeName,
    round1Marks,
    round2Marks,
    round3Marks,
    technicalRoundMarks
  );
}

function insertQuery(
  studentName,
  collegeName,
  round1Marks,
  round2Marks,
  round3Marks,
  technicalRoundMarks
) {
  // Calculating total marks
  totalMarks = round1Marks + round2Marks + round3Marks + technicalRoundMarks;

  // Calculating result
  result = "";
  if (totalMarks >= 35) result = "Selected";
  else result = "Rejected";

  let query = `INSERT INTO candidates (studentName, collegeName, round1Marks, round2Marks, round3Marks, technicalRoundMarks, totalMarks, result) VALUES("${studentName}", "${collegeName}", ${round1Marks}, ${round2Marks}, ${round3Marks}, ${technicalRoundMarks}, ${totalMarks}, "${result}");`;

  con.query(query, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }

    rankQuery();
  });
}

function rankQuery() {
  let query2 = `SELECT 
                  StudentName, 
                  CollegeName, 
                  Round1Marks, 
                  Round2Marks, 
                  Round3Marks, 
                  TechnicalRoundMarks, 
                  TotalMarks, 
                  Result,
                  DENSE_RANK() OVER (ORDER BY TotalMarks DESC) AS Ranking
              FROM candidates;`;

  // Sending query2
  con.query(query2, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }

    console.table(result);
  });
}

// Main program
takeInputs();
module.exports = con;
