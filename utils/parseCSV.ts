import Papa, { ParseResult } from "papaparse";
import { v4 as uuidv4 } from 'uuid';
import { Guest } from "./uploadToFirestore";
import { Timestamp } from "firebase/firestore";

export const parseCSV = (csvFile: any): Promise<Guest[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true, // Should be enabled to be able to support csvs with different column orders
      complete: ({ data: csvData }: ParseResult<{ email: string, name: string, studentID: string, course: string, group: string, part: number }>) => {
        console.log("Raw CSV Data:", csvData); // Add this log to inspect raw CSV data
        // Filter out empty rows
        const nonEmptyRows =
          // 1. Convert the object into 2d arrays (e.g. { email: hello@foo.com, name: Foo } -> [[email, hello@foo.com], [name, Foo]])
          csvData.map(Object.entries)
          // 2. Filter out entries whose trimmed values (in index 1) are empty.
            .filter(row => row.every(r => r[1].trim().length != 0))
          // 3. Convert the 2d arrays back into objects
            .map<typeof csvData[0]>(Object.fromEntries);
            console.log("Non-empty Rows:", nonEmptyRows); // Log the filtered non-empty rows

        // Convert each row of the CSV into a Guest object
        const guests: Guest[] = nonEmptyRows.map((row) => ({
          certId: uuidv4(),
          name: row.name,
          email: row.email,
          studentID: row.studentID, // Example value, adjust as needed
          course: row.course, // Example value, adjust as needed
          part: row.part, // Example value, adjust as needed
          group: row.group // Example value, adjust as needed
        }));

        console.log("Parsed Guests:", guests); // Log the parsed guest list

        resolve(guests);
      },
      error: (error: any) => {
        console.error("CSV Parsing Error:", error);
        reject(error);
      },
    });
  });
};
