let container = document.querySelector(".container");
let cadastro = prompt("Qual é seu nome? ");
let verificar_nome = false;
let usuario;
let lista_message = [];
let dados_messagem;


//variaveis para as menssagens
let participante;
let visibilidade;

function login(){

    usuario = {
        name: cadastro
    };


    

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    const usuarioativo = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    
    let mantercoenxao = setInterval(manterConexao,5000);
    
    requisicao.then(mantercoenxao);

    requisicao.catch(function (){
        alert("Nome ja em uso! tente outro.");
        location. reload();
    })
    

  

    
    function manterConexao() {
        console.log('usuario logado');
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
        //console.log(.status)
    }
    
    /// O principal continua daqui

   

}






  //função paara a lista de participantes
  const promise_participantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');



  function participantes (usuarios) {
    let lista = document.querySelector(".participantes ul");
    
    console.log(usuarios.data.length);
    for (i = 1; i < usuarios.data.length; i++){
            
        console.log(usuarios.data[i].name);
        lista.innerHTML += ` 
        <li>
            <span>
                <img src="imagens/pessoas.png">
            </span>
            <span>
                <h2 onclick="selecionarParticipante(this)">${usuarios.data[i].name}</h2>
            </span>
        </li>` 
      }
      console.log(lista);
  }
  promise_participantes.then(participantes);


login();



function buscarMensagens(){
    
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    
    promise.then(redenrizarMensagens);

    function redenrizarMensagens(resposta){
        dados_messagem = resposta.data;
        console.log(dados_messagem);
        container.innerHTML = "";
        for (i = 0; i < dados_messagem.length; i ++){
            if (dados_messagem[i].type === 'status'){
                container.innerHTML += 
                `<div class="entrada ${dados_messagem[i].type}">
                    <span class="horario"><h1 horário>(${dados_messagem[i].time})</h1>
                    </span>
                    <span><h1><strong>${dados_messagem[i].from} </strong>${dados_messagem[i].text}</h1></span>
                </div>`
            } else if (dados_messagem[i].type === 'private_message'){
               // Verifica se a mensagem privada é minha ou pra mim.
                if (dados_messagem[i].from === cadastro || dados_messagem[i].to === cadastro){
                    container.innerHTML += 
                    `<div class="entrada ${dados_messagem[i].type}">
                        <span class="horario"><h1 horário>(${dados_messagem[i].time})</h1>
                        </span>
                        <span><h1><strong>${dados_messagem[i].from} </strong> reservadamente para <strong>${dados_messagem[i].to}: </strong>${dados_messagem[i].text}</h1></span>
                    </div>`
                }
            } else if (dados_messagem[i].type === 'message') {
            container.innerHTML += 
            `<div class="entrada ${dados_messagem[i].type}">
                <span class="horario"><h1 horário>(${dados_messagem[i].time})</h1>
                </span>
                <span><h1><strong>${dados_messagem[i].from} </strong>para <strong>${dados_messagem[i].to}: </strong>${dados_messagem[i].text}</h1></span>
            </div>`
            }
        }
        if ((dados_messagem[dados_messagem.length-1].type == 'message') || (dados_messagem[dados_messagem.length-1].type == 'private-message')){
            let ultimamsg = document.querySelector(".container div:last-child");
            lista_message.push(dados_messagem[dados_messagem.length-1]);
    
            if (lista_message.length < 3){
                if (lista_message.length == 1){
                    lista_message.push(dados_messagem[dados_messagem.length-1]);
                    ultimamsg.scrollIntoView();
                } else if (lista_message[0] != lista_message[1]){
                        lista_message.push(dados_messagem[dados_messagem.length-1]);
                        ultimamsg.scrollIntoView();
                        lista_message.splice(0,1);
                }
            }
        } 
    }
}



//// menu lateral 
function menulateral (){
    let fundo = document.querySelector(".plano-de-fundo02");
    fundo.classList.toggle("sumir");

    let menu = document.querySelector(".menu-lateral");
    menu.classList.toggle("sumir");
}

function selecionarParticipante(elemento){
    participante = elemento.innerHTML;
} 

function selecionarVisibilidade(elemento) {
    visibilidade = elemento.innerHTML; 
}

function enviarMensagem(){
    let enviar = document.querySelector(".enviar");


    let texto = enviar.value;
    let mensagem = {
            from: cadastro,
            to: "Todos",
            text: texto,
            type: "message"
        }
    
    const postar_mensagem =  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);

    

    postar_mensagem.then(function (){
        console.log("mensagem enviada");
        enviar = document.querySelector(".enviar").value = '';
    })
    postar_mensagem.catch(function (){
        console.log("mensagem não enviada");
    })
}





setInterval(buscarMensagens,3000);
