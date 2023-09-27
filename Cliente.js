const net = require('net');
const readline = require('readline');

// Define a porta e o endereço IP do servidor
const port = 3000;
const host = ' 172.25.254.233';

// Função para configurar a interação com o servidor
function iniciarInteracao() {
  // Cria uma instância do cliente de soquete
  const client = new net.Socket();

  // Conecta ao servidor
  client.connect(port, host, () => {
    console.log('Conectado ao servidor');

    // Configura a entrada de usuário via linha de comando
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Função para receber comandos do usuário
    function receberComando() {
      rl.question('Digite um comando (por exemplo, CALCULAR IMC 70 175 ou "sair" para encerrar): ', (comando) => {
        if (comando.toLowerCase() === 'sair') {
          // Se o usuário digitar "sair", encerra a conexão com o servidor e o cliente
          client.end();
          rl.close();
        } else {
          // Envie o comando para o servidor
          client.write(comando);
        }
      });
    }

    // Lida com os dados recebidos do servidor
    client.on('data', (data) => {
      console.log(`Dados recebidos do servidor: ${data}`);
      receberComando(); // Solicita o próximo comando após receber a resposta do servidor
    });

    // Lida com o evento de fechamento da conexão
    client.on('close', () => {
      console.log('Conexão com o servidor encerrada');
      rl.close();
    });

    // Lida com erros de conexão
    client.on('error', (err) => {
      console.error('Erro de conexão:', err.message);
      rl.close();
    });

    // Inicia o processo de receber comandos
    receberComando();
  });
}

// Inicia a interação do cliente
iniciarInteracao();
