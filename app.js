import { files, groupOrder, groupLabels } from "./data.js";

const list = document.getElementById("list");

const toDisplayName = (fileName) => {
  const base = fileName.replace(/\.[^.]+$/, "");
  const withoutId = base.split(".ID_")[0];
  return withoutId.replace(/_/g, " ");
};

const getGroupKey = (displayName) => {
  const match = displayName.match(/^[A-Za-z]+(?:_[A-Za-z]+)?\d*/);
  if (!match) {
    return "Misc";
  }
  return match[0].replace(/\d+$/, "");
};

if (!files.length) {
  list.innerHTML = "<p class=\"empty\">Пока файлов нет. Добавь их в папку files и обнови data.js.</p>";
} else {
  const grouped = {};
  files.forEach((file) => {
    const displayName = toDisplayName(file);
    const groupKey = getGroupKey(displayName);
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push({
      file,
      displayName,
    });
  });

  const fragments = [];
  groupOrder.forEach((key) => {
    const items = grouped[key];
    if (!items || items.length === 0) {
      return;
    }
    const groupTitle = groupLabels[key] || key;
    const rows = items
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map(
        (item) => `
        <div class="file">
          <div class="file-left">
            <div class="file-icon">ZIP</div>
            <div>
              <p class="file-name">${item.displayName}</p>
              <p class="file-size">${item.file}</p>
            </div>
          </div>
          <a class="download" href="files/${item.file}" download>Скачать</a>
        </div>
      `
      )
      .join("");

    fragments.push(`
      <div class="group">
        <div class="group-title">${groupTitle}</div>
        ${rows}
      </div>
    `);
  });

  list.innerHTML = fragments.join("");
}
