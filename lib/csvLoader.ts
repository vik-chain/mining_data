import Papa from 'papaparse';

export type AccidentRecord = {
  mine_id: string;
  state: string;
  mine_type: string;        // "coal" | "metal_nonmetal"
  contractor: boolean;
  year: number;
  accident_category: string;
  fatal: boolean;
};

export async function loadAccidents(): Promise<AccidentRecord[]> {
  const response = await fetch('/msha_accidents.csv');
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<AccidentRecord>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transform: (value: string) => {
        if (value === 'True') return true;
        if (value === 'False') return false;
        return value;
      },
      complete: (results) => {
        resolve(results.data as AccidentRecord[]);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}
