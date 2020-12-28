const submitBtn = document.getElementById("submit-prompts");
submitBtn.addEventListener("click", sendData);

function sendData() {
  let data = convertToArray();
  fetch("/generateAudio", {
    method: "POST",
    body: JSON.stringify({
      promptArray: data,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

function convertToArray() {
  let text = document.getElementsByTagName("textarea")[0].value;

  // convert tab delimited text to an array for each \n line
  let output = text
    .replaceAll("\t", ",")
    .split("\n")
    .map((arr) => arr.split(","))
    .filter((arr) => arr != "");

  return output;
}
