import Papa from 'papaparse';

export type FatalityRecord = {
  mine_id: string;
  mine_name: string;
  state: string;
  commodity: string;
  mine_type: string;
  accident_class: string;
  equipment: string;
  date: string;
  fatalities: number;
};

export async function loadFatalities(): Promise<FatalityRecord[]> {
  const response = await fetch('/fatalities.csv');
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<FatalityRecord>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data as FatalityRecord[]);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}
