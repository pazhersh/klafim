import { read, utils } from "xlsx";

const input = document.querySelector('input');

input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const wb = read(data);
    const ws = wb.Sheets[wb.SheetNames[1]];
    const json = utils.sheet_to_json(ws, {
        skipHidden: false,
        blankrows: false,
        defval: ' '
    });

    const table = document.createElement('table');

    const headers = Object.keys(json[0]);

    const headerRow = document.createElement('tr');
    for (const header of headers) {
        const headerElement = document.createElement('th');
        headerElement.innerText = header;
        headerRow.append(headerElement);
    }
    table.appendChild(headerRow);

    for (const row of json) {
        const rowElement = document.createElement('tr');

        for (const header of headers) {
            const cellValue = row[header];
            const cellElement = document.createElement('td');
            cellElement.innerText = cellValue;

            rowElement.appendChild(cellElement);
        }

        table.appendChild(rowElement);
    }

    document.body.appendChild(table);
});