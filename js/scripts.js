const addressFrom = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade");

// Validação da entrada do CEP
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  //Permitir apenas números
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

// Get evento do endereço
cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  //Checar se temos o length correto
  if (inputValue.length === 8) {
    getAddress(inputValue);
  }
});

// Get o endereço customizado da API
const getAddress = async (cep) => {
  toggleLoader();
  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  // Mostrar error se CEP não encontrado e resetar
  if (data.erro === "true") {
    if (!addressInput.hasAttribute("disabled")) {
        toggleDisabled();
    }
    addressFrom.reset();
    toggleLoader();
    //Mostar Mensagem
    toggleMessage("CEP inválido tente novamente");
    return;
  }

  if (addressInput.value === "") {
    toggleDisabled();
  }
  
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  toggleLoader();
};

//Adicionar ou remover atributo desativado
const toggleDisabled = () => {
    if (regionInput.hasAttribute("disabled")) {
      formInputs.forEach((input) => {
        input.removeAttribute("disabled");
      });
    } else {
      formInputs.forEach((input) => {
        input.setAttribute("disabled", "disabled");
      });
    }
  };

// Mostrar o Loader
const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

//Mostrar o esconder Mensagem
const toggleMessage = (msg) => {
  const messageElement = document.querySelector("#message");
  const messageElementText = document.querySelector("#message p");

  messageElementText.innerText = msg;

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

// Fechar Menssagem
closeButton.addEventListener("click", () => toggleMessage());

//Simulação de Salvar endereço
addressFrom.addEventListener("submit", (e) => {
    e.preventDefault();

    toggleLoader();
    
    setTimeout(() => {
        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!!!");

        addressFrom.reset();

        toggleDisabled();
    }, 1500);
});
