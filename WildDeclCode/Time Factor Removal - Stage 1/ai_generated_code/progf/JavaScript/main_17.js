/*!
 * TODO:
 *      Sanitize text input
 *      Implement Linguagens input
 *      Determine PARAM_B intervals
 *      Implement results card
 *      Add favicon.ico
 *      Dados de 2017 estao com problema
 */

var areasDict = {
    "CH": "Ciências Humanas",
    "CN": "Ciências da Natureza",
    "LC": "Linguagens",
    "MT": "Matemática"
}

async function fetchProva(ano, area, co_prova) {
    var path = "./data/provas/" + (ano) + "-" + (area) + "-" + (co_prova) + ".json";
    return await fetch(path).then(function response { return response.json(); });
}

async function fetchNotas(ano) {
    var path = "./data/notas/" + (ano) + "-NOTA.json";
    return await fetch(path).then(function response { return response.json(); });
}

async function fetchPROVASJSON() {
    var path = "./data/PROVAS.json";
    return await fetch(path).then(function response { return response.json(); });
}

async function fetchITENSJSON() {
    var path = "./data/ITENS.json";
    return await fetch(path).then(function response { return response.json(); });
}

document.addEventListener("DOMContentLoaded", async function () {

    var anoDropdown = document.getElementById("ano");
    var areaDropdown = document.getElementById("area");
    var provaDropdown = document.getElementById("prova");
    var linguaRadio = document.getElementById("lingua");
    var respostasSection = document.getElementById("respostas");
    var resultadosSection = document.getElementById("resultados");
    var gradeDiv = document.getElementById("grade");
    var submitButton = document.getElementById("submit")

    var PROVAS = await fetchPROVASJSON();

    var CONTEXT = {
        "anoDropdown": anoDropdown,
        "areaDropdown": areaDropdown,
        "linguaRadio": linguaRadio,
        "provaDropdown": provaDropdown,
        "respostasSection": respostasSection,
        "resultadosSection": resultadosSection,
        "gradeDiv": gradeDiv,
        "PROVAS": PROVAS,
        "dataProva": {}
    };

    // Fetch years for anoDropdown
    var years = Object.keys(PROVAS);
    years.forEach(function element { return createOption(anoDropdown, element); });
    
    anoDropdown.addEventListener("change", function e { return anoDropdownListener(CONTEXT); });
    areaDropdown.addEventListener("change", function e { return areaDropdownListener(CONTEXT); });
    // linguaRadio.addEventListener("change", e => linguaRadioListener(CONTEXT));
    provaDropdown.addEventListener("change", async function (e) { return await provaDropdownListener(CONTEXT); });
    submitButton.addEventListener("click", async function (e) { return await submitButtonListener(CONTEXT); });
    
})


function anoDropdownListener(CONTEXT) {
    var anoDropdown = CONTEXT["anoDropdown"];
    var areaDropdown = CONTEXT["areaDropdown"];
    var provaDropdown = CONTEXT["provaDropdown"];
    var linguaRadio = CONTEXT["linguaRadio"];
    var respostasSection = CONTEXT["respostasSection"];
    var resultadosSection = CONTEXT["resultadosSection"];

    var selectedYear = anoDropdown.value;
    var dataSelectedYear = CONTEXT["PROVAS"][selectedYear];
    if (dataSelectedYear) {
        areaDropdown.innerHTML = '<option value="">AREA</option>';
        provaDropdown.innerHTML = '<option value="">PROVA</option>';
        var areas = Object.keys(dataSelectedYear);
        areas.forEach(function element {
            var option = document.createElement("option");
            option.value = element;
            option.textContent = areasDict[element];
            areaDropdown.appendChild(option)
        });
        areaDropdown.disabled = false;
        provaDropdown.disabled = true;
        respostasSection.hidden = true;
        resultadosSection.hidden = true;
        linguaRadio.classList.add("hidden");
    } else {
        areaDropdown.innerHTML = '<option value="">AREA</option>';
        provaDropdown.innerHTML = '<option value="">PROVA</option>';
        areaDropdown.disabled = true;
        provaDropdown.disabled = true;
        respostasSection.hidden = true;
        resultadosSection.hidden = true;
        linguaRadio.classList.add("hidden");
    }
}

function areaDropdownListener(CONTEXT) {
    var anoDropdown = CONTEXT["anoDropdown"];
    var areaDropdown = CONTEXT["areaDropdown"];
    var provaDropdown = CONTEXT["provaDropdown"];
    var linguaRadio = CONTEXT["linguaRadio"];
    var PROVAS = CONTEXT["PROVAS"];
    var respostasSection = CONTEXT["respostasSection"];
    var resultadosSection = CONTEXT["resultadosSection"];

    var selectedArea = areaDropdown.value;
    var dataSelectedArea = PROVAS[anoDropdown.value][selectedArea];
    if (dataSelectedArea) {
        if (selectedArea === "LC")
            linguaRadio.classList.remove("hidden");
        else
            linguaRadio.classList.add("hidden");
        provaDropdown.innerHTML = '<option value="">PROVA</option>';
        var provas = Object.keys(dataSelectedArea);
        provas.forEach(function element { return createOption(provaDropdown, element); });
        provaDropdown.disabled = false;
        respostasSection.hidden = true;
        resultadosSection.hidden = true;

    } else {
        provaDropdown.innerHTML = '<option value="">PROVA</option>';
        areaDropdown.disabled = true;
        provaDropdown.disabled = true;
        respostasSection.hidden = true;
        resultadosSection.hidden = true;
        linguaRadio.classList.add("hidden");
    }
}

async function provaDropdownListener(CONTEXT) {
    var anoDropdown = CONTEXT["anoDropdown"];
    var areaDropdown = CONTEXT["areaDropdown"];
    var provaDropdown = CONTEXT["provaDropdown"];
    var PROVAS = CONTEXT["PROVAS"];
    var respostasSection = CONTEXT["respostasSection"];
    var resultadosSection = CONTEXT["resultadosSection"];
    var gradeDiv = CONTEXT["gradeDiv"];

    var selectedProva = provaDropdown.value;
    var dataSelectedProva = PROVAS[anoDropdown.value][areaDropdown.value][selectedProva];
    if (dataSelectedProva) {
        // Temos uma prova selecionada
        var dataProva = await fetchProva(anoDropdown.value, areaDropdown.value, dataSelectedProva);
        CONTEXT["dataProva"] = dataProva;
        var numItens = Object.keys(dataProva)
                            .filter(function q { return q.substring(1) !== '-1'; })
                            .map(function q { return Number(q.split('-')[0]); })
                            .sort(function (a, b) { return a - b; });
        gradeDiv.innerHTML = "";
        numItens.forEach(function item { return gradeDiv.appendChild(createQuestao(item)); });
        // TODO
        // Add click events to the spans
        addInputListeners();
        
        respostasSection.hidden = false;
        resultadosSection.hidden = true;
        gradeDiv.scrollIntoView({behavior: "smooth"});
    } else {
        // Nao temos uma prova selecionada
        CONTEXT["dataProva"] = {};
        respostasSection.hidden = true;
        resultadosSection.hidden = true;
    }
    
}

async function submitButtonListener(CONTEXT) {
    var gradeDiv = CONTEXT["gradeDiv"];
    // Form validation
    var questoes = gradeDiv.children;
    var gabarito = "";

    for (var q of questoes) {
        var qInput = q.lastElementChild.value;
        if (qInput) {
            gabarito += qInput;
        } else {
            console.log("Finish filling out form");
            return;
        }
    }
    gabarito = gabarito.toUpperCase();
    
    // Clear Questoes similares
    clearQuestoes();

    // Sanitize input
    // TODO

    // Calculate results
    var anoDropdown = CONTEXT["anoDropdown"];
    var areaDropdown = CONTEXT["areaDropdown"]
    var dataProva = CONTEXT["dataProva"];
    if (dataProva) {
        var results = await calculateResults({
            "respostas": gabarito,
            "ano": anoDropdown.value,
            "area": areaDropdown.value
        }, CONTEXT);
        // Display results
        await displayResults(results, CONTEXT);
        CONTEXT["resultadosSection"].hidden = false;
        CONTEXT["resultadosSection"].scrollIntoView({ behavior: "smooth" });

    } else {
        console.log("Something went wrong...");
        CONTEXT["resultadosSection"].hidden = true;
    }
}

function createOption(dropdown, element) {
    var option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    dropdown.appendChild(option)
}

function createQuestao(num) {
    var questao = document.createElement("div");
    questao.classList.add("flex");
    questao.classList.add("w-fit");
    questao.innerHTML = '
        <span class="w-10 h-9 flex justify-center items-center shadow rounded-l-md cursor-pointer bg-indigo-50 hover:bg-indigo-100" id="q-' + (num) + '">' + (num) + '</span>
        <input class="w-7 h-9 indent-2 shadow rounded-r-md" type="text" maxlength="1" name="q-' + (num) + '-i" id="q-' + (num) + '-i">
    
    '
    return questao;
}

// Supported via standard programming aids
function addInputListeners() {
    // Get all text input elements within the 'grade' container
    var textInputs = document.querySelectorAll('#grade input[type="text"]');

    // Attach input event listener to each text input
    textInputs.forEach(function (textInput, index) {
        textInput.addEventListener('input', () => {
            var maxLength = parseInt(textInput.getAttribute('maxlength'), 10);
            var currentLength = textInput.value.length;

            if (currentLength >= maxLength) {
                // Focus on the next text input if available
                if (index < textInputs.length - 1) {
                    textInputs[index + 1].focus();
                }
            }
        });

        textInput.addEventListener('paste', (event) => {
            event.preventDefault();

            var pastedText = event.clipboardData.getData('text');
            var maxLength = parseInt(textInput.getAttribute('maxlength'), 10);
            var currentLength = textInput.value.length;
            var remainingLength = maxLength - currentLength;

            // If pasted text is longer than the remaining length, split it into multiple inputs
            if (pastedText.length > remainingLength) {
                var startIndex = 0;
                var endIndex = 0;

                for (var i = index; i < textInputs.length; i++) {
                    var input = textInputs[i];
                    var inputMaxLength = parseInt(input.getAttribute('maxlength'), 10);

                    if (pastedText.length - endIndex > inputMaxLength) {
                        input.value = pastedText.substring(startIndex, startIndex + inputMaxLength);
                        startIndex += inputMaxLength;
                        endIndex += inputMaxLength;
                    } else {
                        input.value = pastedText.substring(startIndex + currentLength);
                        break;
                    }
                }

                // Focus on the next text input if available
                if (index < textInputs.length - 1) {
                    textInputs[index + 1].focus();
                }
            } else {
                textInput.value += pastedText;
            }
        });
    });

}

async function displayResults(results, CONTEXT) {
    var areaDropdown = CONTEXT["areaDropdown"];
    var PROVAS = CONTEXT["PROVAS"];
    document.getElementById("min-score").textContent = results["nota-min"];
    document.getElementById("mean-score").textContent = results["nota-mean"];
    document.getElementById("max-score").textContent = results["nota-max"];
    document.getElementById("raw-score").textContent = results["acertos"];
    document.getElementById("acertos-facil").textContent = results["acertos-facil"];
    document.getElementById("acertos-medio").textContent = results["acertos-medio"];
    document.getElementById("acertos-dificil").textContent = results["acertos-dificil"];
    document.getElementById("raw-erros").textContent = results["erros"];
    document.getElementById("erros-facil").textContent = results["erros-facil"];
    document.getElementById("erros-medio").textContent = results["erros-medio"];
    document.getElementById("erros-dificil").textContent = results["erros-dificil"];
    // Get all span elements within the 'grade' container
    var spanElements = document.querySelectorAll("#grade span");

    spanElements.forEach(function spanElement {
        spanElement.addEventListener('click', async () => {
            var questao = spanElement.id.split('-')[1]
            var hab = CONTEXT["dataProva"][questao]['CO_HABILIDADE'];
            var itensSimilares = await getItensSimilares(areaDropdown.value, hab);
            var itens = [];
            for (var key in itensSimilares) {
                var itensAno = itensSimilares[key];
                for (var item in itensAno) {
                    var firstProva = Object.keys(itensAno[item])[0];
                    var provaName = getProvaName(firstProva, PROVAS[key][areaDropdown.value]);
                    if (provaName)
                        itens.push("" + (key) + " " + (provaName) + " " + (itensAno[item][firstProva]) + "");
                }
            }
            document.getElementById('questoes-num').innerHTML = "Questão " + (questao) + "";
            document.getElementById('questoes-gab').innerHTML = CONTEXT["dataProva"][questao]["TX_GABARITO"];
            var param_B = CONTEXT["dataProva"][questao]["NU_PARAM_B"]
            document.getElementById('questoes-dif').innerHTML = (param_B < 1.5) ? "FACIL" : (param_B < 2) ? "MEDIO" : "DIFICIL" ;
            document.getElementById('questoes-hab').innerHTML = "H" + (hab) + "";
            addHabilidade(hab, itens);
            CONTEXT['resultadosSection'].scrollIntoView({ behavior: "smooth" });
        });
    });

}

async function calculateResults(data, CONTEXT) {
    var dataProvaTmp = CONTEXT["dataProva"];
    var dataProva = {};
    var lingua = -1
    if (data["area"] == "LC") {
        // Filter by chosen language
        var opcaoIngles = document.getElementById("ingles");
        var opcaoEspanhol = document.getElementById("espanhol");
        if (opcaoIngles.checked) {
            lingua = opcaoIngles.value;
        } else if (opcaoEspanhol.checked) {
            lingua = opcaoEspanhol.value;
        }
        Object.keys(dataProvaTmp)
              .filter(function q { return q.substring(1) !== "-" + (lingua) + ""; })
              .forEach(function q { return dataProva[q.split('-')[0]] = dataProvaTmp[q]; });
    } else {
        dataProva = dataProvaTmp;
    }
    CONTEXT["dataProva"] = dataProva;
    var respostas = data["respostas"];
    var results = {
        "acertos": 0,
        "acertos-facil": 0,
        "acertos-medio": 0,
        "acertos-dificil": 0,
        "erros": 0,
        "erros-facil": 0,
        "erros-medio": 0,
        "erros-dificil": 0,
        "habilidades": {}
    }
    var i = 0;
    var dificuldade = "";
    var param_B = 0;
    for (var key in dataProva) {
        param_B = dataProva[key]['NU_PARAM_B'];
        dificuldade = (param_B < 1.5) ? "facil" : (param_B < 2) ? "medio" : "dificil";
        results["habilidades"][key] = dataProva[key]['CO_HABILIDADE'];
        if (dataProva[key]['TX_GABARITO'] == 'X') {
            i++;
            continue;
        }
        if (respostas[i] === dataProva[key]['TX_GABARITO']){
            results["acertos"]++;
            results["acertos-" + (dificuldade) + ""]++;
            var currentColor = document.getElementById("q-" + (key) + "").getAttribute("class").split(' ').find(function c { return c.slice(0, 2) == "bg"; });
            document.getElementById("q-" + (key) + "").classList.replace(currentColor, "bg-green-100");
        } else {
            results["erros"]++;
            results["erros-" + (dificuldade) + ""]++;
            var currentColor = document.getElementById("q-" + (key) + "").getAttribute("class").split(' ').find(function c { return c.slice(0, 2) == "bg"; });
            document.getElementById("q-" + (key) + "").classList.replace(currentColor, "bg-red-100");
        }
        i++;
    }
    var NOTAS = await fetchNotas(data["ano"]);
    var rawScore = results["acertos"];
    var keyMin = "NU_NOTA_MIN_" + (data["area"]) + "";
    var keyMean = "NU_NOTA_MEAN_" + (data["area"]) + "";
    var keyMax = "NU_NOTA_MAX_" + (data["area"]) + "";
    results["nota-min"] = Math.round((NOTAS[rawScore][keyMin] + Number.EPSILON) * 100) / 100;
    results["nota-mean"] = Math.round((NOTAS[rawScore][keyMean] + Number.EPSILON) * 100) / 100;
    results["nota-max"] = Math.round((NOTAS[rawScore][keyMax] + Number.EPSILON) * 100) / 100;
    return results;
}

async function getItensSimilares(area, hab) {
    var ITENS = await fetchITENSJSON();
    return ITENS[area][hab];
}

function getProvaName(co_prova, data) {
    var invertedData = Object.entries(data).reduce(function (acc, [key, value]) {
        acc[value] = key;
        return acc;
    }, {});
    return invertedData[co_prova];
}

function addHabilidade(hab, itens) {
    var questoesCard = document.getElementById("questoes-similares");
    questoesCard.innerHTML = '';
    var ul = document.createElement("ul");
    ul.className = "list-disc my-4 mx-10"
    itens.forEach(function item {
        var li = document.createElement("li")
        li.innerText = item
        ul.appendChild(li);
    })
    questoesCard.appendChild(ul);
}

function clearQuestoes() {
    document.getElementById("questoes-num").innerHTML = 'Questão';
    document.getElementById("questoes-gab").innerHTML = '-';
    document.getElementById("questoes-hab").innerHTML = '-';
    document.getElementById("questoes-similares").innerHTML = 'Clique em uma questão acima para obter informações sobre ela!';
}