// ✅ Inicializa EmailJS
emailjs.init("VWEv3xUnqizxBrP-F");

// -----------------------------
// 🔹 Funções principais do comprovante
// -----------------------------
function getComprovanteData() {
  const campos = ["nome", "cpf", "email", "telefone", "data", "origem", "destino", "pagamento", "valor"];
  const data = {};
  campos.forEach(campo => {
    data[campo] = document.querySelector(`#${campo}`)?.value || "";
  });
  return data;
}

function updateComprovanteUI(data) {
  const camposUI = {
    nome: "#pdf-nome",
    cpf: "#pdf-cpf",
    email: "#pdf-email",
    telefone: "#pdf-telefone",
    data: "#pdf-data",
    origem: "#pdf-origem",
    destino: "#pdf-destino",
    pagamento: "#pdf-pagamento",
    valor: "#pdf-valor"
  };

  for (let campo in camposUI) {
    const el = document.querySelector(camposUI[campo]);
    if (!el) continue;

    let valor = data[campo];
    if (campo === "data" && valor) {
      valor = new Date(valor).toLocaleString("pt-BR");
    }

    if (valor) {
      el.parentElement.style.display = "list-item";
      el.textContent = valor;
    } else {
      el.parentElement.style.display = "none";
    }
  }

  document.getElementById("comprovante-pdf").style.display = "block";
}

function baixarPDF() {
  const element = document.getElementById("comprovante-pdf");
  const nome = document.getElementById("nome").value || "passageiro";

  const opt = {
    margin: [10, 10, 10, 10],
    filename: "Comprovante de Corrida - " + nome + ".pdf",
    html2canvas: { scale: 2, useCORS: true, scrollY: 0, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };

  html2pdf().set(opt).from(element).save();
}

function enviarEmail() {
  const data = getComprovanteData();
  updateComprovanteUI(data);

  const campos = {
    nome: "Nome do Passageiro",
    cpf: "CPF",
    data: "Data",
    origem: "Origem",
    destino: "Destino",
    pagamento: "Forma de Pagamento",
    valor: "Valor"
  };

  let emailBody = "<ul>";
  for (let key in campos) {
    if (data[key]) {
      let valor = key === "data" ? new Date(data[key]).toLocaleString("pt-BR") : data[key];
      emailBody += `<li><strong>${campos[key]}:</strong> ${valor}</li>`;
    }
  }
  emailBody += "</ul>";

  const emailData = {
    nome: data.nome || "",
    emailBody: emailBody,
    email: data.email || ""
  };

  emailjs
    .send("service_f81ljjf", "template_29nrnva", emailData)
    .then(() => alert("✅ Comprovante enviado por e-mail!"))
    .catch(err => {
      console.error("Erro:", err);
      alert("❌ Erro ao enviar comprovante.");
    });
}

function entrarNaConversa() {
  const telefone = document.querySelector("#telefone").value.replace(/\D/g, "");
  if (!telefone || telefone.length < 10) return alert("Por favor, insira um telefone válido.");
  window.open(`https://wa.me/${telefone}`, "_blank");
}

// -----------------------------
// 📱 Eventos
// -----------------------------
document.getElementById("btn-comprovante").addEventListener("click", () => {
  const data = getComprovanteData();
  updateComprovanteUI(data);
  requestAnimationFrame(() => {
    baixarPDF();
  });
});

document.getElementById("btn-email").addEventListener("click", enviarEmail);
document.getElementById("btn-conversa").addEventListener("click", entrarNaConversa);

// -----------------------------
// 💸 Funções do QR Code PIX
// -----------------------------
function emv(id, value) {
  const len = String(value.length).padStart(2, "0");
  return id + len + value;
}

function crc16(str) {
  let crc = 0xffff;
  for (let c of str) {
    crc ^= c.charCodeAt(0) << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function gerarPayloadPix(valor) {
  const chavePix = "08573589876"; // ✅ Chave Pix
  const nome = "Ronaldo Ceola"; // Máx. 25 caracteres
  const cidade = "SAO PAULO"; // Máx. 15 caracteres

  // 🔹 Monta o Merchant Account Info corretamente
  const gui = emv("00", "BR.GOV.BCB.PIX");
  const key = emv("01", chavePix);
  const mai = emv("26", gui + key);

  const payload =
    emv("00", "01") + // Payload Format Indicator
    mai +
    emv("52", "0000") + // Merchant Category Code
    emv("53", "986") + // Currency (BRL)
    (valor ? emv("54", parseFloat(valor).toFixed(2)) : "") + // Amount
    emv("58", "BR") + // Country
    emv("59", nome.substring(0, 25)) + // Nome
    emv("60", cidade.substring(0, 15)) + // Cidade
    emv("62", emv("05", "***")) + // Additional Data
    "6304"; // CRC placeholder

  const crc = crc16(payload);
  return payload + crc;
}

// -----------------------------
// 🔹 Evento: Gerar QR Code PIX
// -----------------------------
document.getElementById("generate").addEventListener("click", () => {
  let valorInput = document.getElementById("amount").value.trim();
  valorInput = valorInput.replace(",", ".");
  let valorNumerico = parseFloat(valorInput);
  if (isNaN(valorNumerico)) valorNumerico = 0;

  const payload = gerarPayloadPix(valorNumerico);
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
      <head>
        <title>QR Code PIX</title>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f8f9fa;
            padding: 30px;
          }
          #qrcode {
            margin: 20px auto;
            width: 220px;
            height: 220px;
          }
          .valor {
            font-size: 18px;
            margin-top: 10px;
          }
          textarea {
            width: 90%;
            height: 60px;
            margin-top: 15px;
            font-size: 14px;
            padding: 5px;
            resize: none;
          }
        </style>
      </head>
      <body>
        <h2>Pagamento PIX</h2>
        <div id="qrcode"></div>
        <p class="valor">Valor: R$ ${valorNumerico.toFixed(2)}</p>
        <textarea readonly>${payload}</textarea>
        <p>Copie o código acima ou escaneie o QR Code no app do seu banco.</p>

        <script>
          new QRCode(document.getElementById('qrcode'), {
            text: "${payload}",
            width: 220,
            height: 220
          });
        </script>
      </body>
    </html>
  `);

  console.log("✅ Valor numérico:", valorNumerico);
  console.log("✅ Payload PIX:", payload);
});
