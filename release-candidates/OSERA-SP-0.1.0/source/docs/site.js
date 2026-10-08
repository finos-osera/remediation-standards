(function () {
  const search = document.getElementById("catalogueSearch");
  const packFilter = document.getElementById("packFilter");
  const categoryFilter = document.getElementById("categoryFilter");
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
  fillFilter(categoryFilter, Array.from(new Set(rows.map((row) => row.dataset.category))).sort());
  fillFilter(statusFilter, Array.from(new Set(rows.map((row) => row.dataset.status))).sort());

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    const selectedPack = packFilter ? packFilter.value : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "";
    const selectedStatus = statusFilter ? statusFilter.value : "";

    rows.forEach((row) => {
      const haystack = `${row.dataset.title || ""} ${row.dataset.content || ""} ${row.dataset.type || ""} ${row.dataset.category || ""} ${row.dataset.pack || ""} ${row.dataset.status || ""}`.toLowerCase();
      const matchesSearch = query === "" || haystack.includes(query);
      const matchesPack = selectedPack === "" || row.dataset.pack === selectedPack;
      const matchesCategory = selectedCategory === "" || row.dataset.category === selectedCategory;
      const matchesStatus = selectedStatus === "" || row.dataset.status === selectedStatus;
      row.hidden = !(matchesSearch && matchesPack && matchesCategory && matchesStatus);
    });
  }

  search.addEventListener("input", applyFilters);
  if (packFilter) packFilter.addEventListener("change", applyFilters);
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);
})();
