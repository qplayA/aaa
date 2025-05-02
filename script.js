
document.addEventListener("DOMContentLoaded", () => {
  let data = [];

  const normalize = str => str.toLowerCase().replace(/\s+/g, "").trim();

  const highlight = (text, terms, className) => {
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      highlighted = highlighted.replace(regex, '<span class="' + className + '">$1</span>');
    });
    return highlighted;
  };

  fetch("data.json")
    .then(response => response.json())
    .then(json => {
      data = json.map(q => ({
        ...q,
        _nq: normalize(q.question),
        _na: normalize(q.answer)
      }));
    });

  document.getElementById("search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = event.target.value;
      const terms = query.split(/\s+/).filter(t => t).map(normalize);

      const results = data.filter(q =>
        terms.every(term =>
          q._nq.includes(term) || q._na.includes(term)
        )
      );

      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      results.forEach(q => {
        const div = document.createElement("div");
        div.className = "result";
        div.innerHTML =
          "<h3>" + highlight(q.question, terms, 'highlight-question') + "</h3>" +
          "<p>" + highlight(q.answer, terms, 'highlight-answer') + "</p>";
        resultsDiv.appendChild(div);
      });
    }
  });
});
