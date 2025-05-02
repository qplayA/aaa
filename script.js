
document.addEventListener("DOMContentLoaded", () => {
  let data = [];

  const normalize = str => str.toLowerCase().replace(/\s+/g, "").trim();

  const highlightQuestion = (text, terms) => {
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      highlighted = highlighted.replace(regex, '<span class="highlight-question">$1</span>');
    });
    return highlighted;
  };

  const highlightAnswer = (text, terms) => {
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      highlighted = highlighted.replace(regex, '<span class="highlight-answer">$1</span>');
    });
    return highlighted;
  };

  fetch("data.json")
    .then(response => response.json())
    .then(json => { data = json; });

  document.getElementById("search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = event.target.value;
      const terms = query.split(/\s+/).filter(t => t).map(t => normalize(t));

      const results = data.filter(q =>
        terms.every(term =>
          normalize(q.question).includes(term) ||
          normalize(q.answer).includes(term)
        )
      );

      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      results.forEach(q => {
        const div = document.createElement("div");
        div.className = "result";
        div.innerHTML =
          "<h3>" + highlightQuestion(q.question, terms) + "</h3>" +
          "<p>" + highlightAnswer(q.answer, terms) + "</p>";
        resultsDiv.appendChild(div);
      });
    }
  });
});
