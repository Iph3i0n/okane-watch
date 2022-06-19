function GetColumnTitles(el: HTMLTableElement) {
  const result = [] as string[];
  const headers =
    el.querySelector("thead tr")?.querySelectorAll("th") ?? ([] as const);

  for (const head_cell of headers) {
    result.push((head_cell.textContent ?? "").trim());
  }

  return result;
}

function* GetCells(el: HTMLTableElement) {
  for (const row of el.querySelectorAll("tbody tr")) {
    let col_index = 0;
    for (const col of row.querySelectorAll("td, th")) {
      yield { col: col_index, cell: col };
      col_index++;
    }
  }
}

export function AddMetadataToTable(el: HTMLTableElement) {
  const headers = GetColumnTitles(el);

  for (const { col, cell } of GetCells(el)) {
    cell.setAttribute("aria-label", headers[col]);
  }
}
