/**
 * Apps Script - Recebe foto + dados da landing e salva em
 * Google Sheets + Google Drive (pasta "Diagnostico-Flores").
 *
 * COMO USAR (passo único, ~2 minutos):
 * 1. Acesse https://script.google.com  -> "Novo Projeto"
 * 2. Apague o código padrão e cole TODO este arquivo
 * 3. Clique em "Implantar" -> "Nova implantação"
 * 4. Tipo: "App da Web"
 *    - Executar como: você
 *    - Quem tem acesso: "Qualquer pessoa"
 * 5. Clique em "Implantar", autorize com sua conta Google
 * 6. Copie a URL gerada (termina em /exec)
 * 7. Cole essa URL na constante WEBHOOK_URL no index.html
 *
 * Pronto. Cada envio cria:
 * - 1 linha na planilha "Diagnostico Flores - Submissoes"
 * - 1 imagem na pasta "Diagnostico-Flores - Fotos" do seu Drive
 * - link da imagem na própria linha da planilha
 */

const NOME_PLANILHA = 'Diagnostico Flores - Submissoes';
const NOME_PASTA    = 'Diagnostico-Flores - Fotos';

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const ts = new Date();

    // 1. Pasta no Drive (cria se não existir)
    const pasta = obterOuCriarPasta_(NOME_PASTA);

    // 2. Salva imagem
    let linkFoto = '';
    if (dados.imagem && dados.imagem.indexOf('base64,') > -1) {
      const partes = dados.imagem.split('base64,');
      const meta = partes[0];
      const b64 = partes[1];
      const mime = (meta.match(/data:([^;]+);/) || [])[1] || 'image/jpeg';
      const ext = mime.split('/')[1] || 'jpg';
      const nomeArq = Utilities.formatDate(ts, 'America/Sao_Paulo', 'yyyy-MM-dd_HH-mm-ss')
        + '_' + sanitizar_(dados.nome || 'cliente') + '.' + ext;
      const blob = Utilities.newBlob(Utilities.base64Decode(b64), mime, nomeArq);
      const arquivo = pasta.createFile(blob);
      arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      linkFoto = arquivo.getUrl();
    }

    // 3. Planilha (cria se não existir)
    const planilha = obterOuCriarPlanilha_(NOME_PLANILHA);
    const aba = planilha.getSheets()[0];
    if (aba.getLastRow() === 0) {
      aba.appendRow(['Data/Hora', 'Nome', 'WhatsApp', 'Descricao', 'Foto']);
      aba.setFrozenRows(1);
      aba.getRange('A1:E1').setFontWeight('bold').setBackground('#fce4ec');
    }
    aba.appendRow([
      Utilities.formatDate(ts, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss'),
      dados.nome || '',
      dados.whatsapp || '',
      dados.descricao || '',
      linkFoto,
    ]);

    return resposta_({ ok: true, link: linkFoto });
  } catch (err) {
    return resposta_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return resposta_({ ok: true, msg: 'Webhook ativo' });
}

function resposta_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function obterOuCriarPasta_(nome) {
  const it = DriveApp.getFoldersByName(nome);
  return it.hasNext() ? it.next() : DriveApp.createFolder(nome);
}

function obterOuCriarPlanilha_(nome) {
  const arquivos = DriveApp.getFilesByName(nome);
  if (arquivos.hasNext()) {
    return SpreadsheetApp.open(arquivos.next());
  }
  return SpreadsheetApp.create(nome);
}

function sanitizar_(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'cliente';
}
