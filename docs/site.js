(function () {
  const search = document.getElementById("catalogueSearch");
  const packFilter = document.getElementById("packFilter");
  const statusFilter = document.getElementById("statusFilter");
  if (!search) return;

  const rows = Array.from(document.querySelectorAll(".standard-row"));

  function fillFilter(select, values) {
    if (!select) return;
    values.forEach((value) => {
      if (!value) return;
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  fillFilter(packFilter, Array.from(new Set(rows.map((row) => row.dataset.pack))).sort());
  fillFilter(statusFilter, Array.from(new Set(rows.map((row) => row.dataset.status))).sort());

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    const selectedPack = packFilter ? packFilter.value : "";
    const selectedStatus = statusFilter ? statusFilter.value : "";

    rows.forEach((row) => {
      const haystack = `${row.dataset.title || ""} ${row.dataset.content || ""} ${row.dataset.type || ""} ${row.dataset.pack || ""} ${row.dataset.status || ""}`.toLowerCase();
      const matchesSearch = query === "" || haystack.includes(query);
      const matchesPack = selectedPack === "" || row.dataset.pack === selectedPack;
      const matchesStatus = selectedStatus === "" || row.dataset.status === selectedStatus;
      row.hidden = !(matchesSearch && matchesPack && matchesStatus);
    });
  }

  search.addEventListener("input", applyFilters);
  if (packFilter) packFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);
})();
