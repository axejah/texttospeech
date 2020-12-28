const submitBtn = document.getElementById("submit-prompts");
const zipFileLink = document.getElementById("zipfile-link");
submitBtn.addEventListener("click", sendData);

function sendData() {
  if (document.getElementsByTagName("textarea")[0].value === "") {
    return alert("audio prompts zijn leeg");
  }

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
    .then((data) => getZipFile(data))
    .catch((err) => console.log(err));

  // clear form after submit
  document.getElementsByTagName("textarea")[0].value = "";
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

function getZipFile(data) {
  let url = data.zipfile;

  zipFileLink.href = url.slice(9, url.length);
  zipFileLink.style.visibility = "visible";
}
