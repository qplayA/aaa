
document.addEventListener("DOMContentLoaded", () => {
  let data = [];

  // normalize: 영어 대소문자 무시, 공백 제거
  const normalize = str => str.toLowerCase().replace(/\s+/g, "").trim();

  const highlight = (text, terms, className) => {
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      highlighted = highlighted.replace(regex, '<span class="' + className + '">$1</span>');
    });
    return highlighted;
  };

  const runSearch = (query, clearInput = false) => {
    const terms = query.split(/\s+/).filter(Boolean).map(normalize);
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

    if (clearInput && results.length > 0) {
      document.getElementById("search").value = '';
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  fetch("data.json")
    .then(res => res.json())
    .then(json => {
      data = json.map(q => ({
        ...q,
        _nq: normalize(q.question),
        _na: normalize(q.answer)
      }));
    });

  const input = document.getElementById("search");

  // 입력할 때는 debounce 검색
  input.addEventListener("input", debounce((e) => {
    runSearch(e.target.value);
  }, 300));

  // 엔터를 누르면 즉시 검색하고 입력창 비우기
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runSearch(input.value, true);
    }
  });
});
