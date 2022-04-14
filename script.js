let container = document.querySelector(".container");

function login(){
    const usuario = {
        name: 'Marcus'
    };
    
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    const usuarioativo = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',usuario);
    
    const mantercoenxao = setInterval(manterConexao,5000);
    
    requisicao.then(mantercoenxao);
    requisicao.catch(erroLogin);
    
    
    function manterConexao(response) {
        console.log('usuario logado');
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status',usuario);
        //console.log(.status)
    }
    
    function erroLogin(erro) {
        const statusCode = erro.response.status;
        console.log("deu erro")
        console.log(statusCode);
    }
}
function buscarMensagens(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    
    promise.then(redenrizarMensagens);
    function redenrizarMensagens(resposta){
        let dados = resposta.data;
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
            container.innerHTML += 
            `<div class="entrada ${dados[i].type}">
                <span class="horario"><h1 horário>(${dados[i].time})</h1>
                </span>
                <span><h1><strong>${dados[i].from} </strong> reservadamente para <strong>${dados[i].to}: </strong>${dados[i].text}</h1></span>
            </div>`
           } else {
            `<div class="entrada ${dados[i].type}">
                <span class="horario"><h1 horário>(${dados[i].time})</h1>
                </span>
                <span><h1><strong>${dados[i].from} </strong>para <strong>${dados[i].to}: </strong>${dados[i].text}</h1></span>
            </div>`
           }
           let ultimamsg = document.querySelector('.container div:last-child');
           ultimamsg.scrollIntoView();
           ultimamsg = 0;
           
        }
    }

}
login();
setInterval(buscarMensagens,5000);