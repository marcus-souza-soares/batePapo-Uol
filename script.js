let container = document.querySelector(".container");
let cadastro = prompt("Qual é seu nome? ");
let verificar_nome = false;
let usuario;

function login(){

    usuario = {
        name: cadastro
    };
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);


    requisicao.catch(function (){
        alert("Nome ja em uso! tente outro.");
        location. reload();
    })






    
   
    const usuarioativo = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    
    let mantercoenxao = setInterval(manterConexao,5000);
    
    requisicao.then(mantercoenxao);
    requisicao.catch(erroLogin);
    
    
    function manterConexao() {
        console.log('usuario logado');
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
        //console.log(.status)
    }
    
    function erroLogin(erro) {
        const statusCode = erro.response.status;
        console.log("deu erro");
        console.log(statusCode);
    }
}
function buscarMensagens(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    
    promise.then(redenrizarMensagens);

    function redenrizarMensagens(resposta){
        let dados = resposta.data;
        let ultimamsg;
        console.log(dados);
        container.innerHTML = "";
        for (i = 0; i < dados.length; i ++){
            if (dados[i].type === 'status'){
                container.innerHTML += 
                `<div class="entrada ${dados[i].type}">
                    <span class="horario"><h1 horário>(${dados[i].time})</h1>
                    </span>
                    <span><h1><strong>${dados[i].from} </strong>${dados[i].text}</h1></span>
                </div>`
            } else if (dados[i].type === 'private_message'){
               // Verifica se a mensagem privada é minha ou pra mim.
                if (dados[i].from === cadastro || dados[i].to === cadastro){
                    container.innerHTML += 
                    `<div class="entrada ${dados[i].type}">
                        <span class="horario"><h1 horário>(${dados[i].time})</h1>
                        </span>
                        <span><h1><strong>${dados[i].from} </strong> reservadamente para <strong>${dados[i].to}: </strong>${dados[i].text}</h1></span>
                    </div>`
                }
            } else if (dados[i].type === 'message') {
            container.innerHTML += 
            `<div class="entrada ${dados[i].type}">
                <span class="horario"><h1 horário>(${dados[i].time})</h1>
                </span>
                <span><h1><strong>${dados[i].from} </strong>para <strong>${dados[i].to}: </strong>${dados[i].text}</h1></span>
            </div>`
            }
            if ((dados[dados.length-1].type == 'message') || (dados[dados.length-1].type == 'private-message')){
                ultimamsg = document.querySelector('.container div:last-child');
                let verifica_message = []

                verifica_message.push(ultimamsg).from;

                if ((dados[dados.length-1].from != dados[dados.length-2].from) && (dados[dados.length-1].text != dados[dados.length-2].text)){
                    ultimamsg.scrollIntoView();
                    ultimamsg = 0;
                }
            }
        }
    }
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
login();