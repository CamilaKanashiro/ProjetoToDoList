//Permitindo adicionar tarefas com a tecla Enter
document.getElementById("campoInserirTarefa").addEventListener("keydown", function(e) {
    if(e.key == "Enter"){
    e.preventDefault();
    document.getElementById("botaoAdicionar").click();
    }
});

inicializarAdicionandoListaDoLocalStorage ();

function inicializarAdicionandoListaDoLocalStorage () {
    if (localStorage.getItem('ListaDeTarefasSalva')) {
        var objetoTarefasNoLocalStorage = JSON.parse(localStorage.getItem('ListaDeTarefasSalva'));
        var quantidadeTarefasNoLocalStorage = objetoTarefasNoLocalStorage.tarefaESuasCaracteristicas.length;

        var quantidadeTarefasNoHtml = document.getElementsByClassName("tarefa").length; 

        while (quantidadeTarefasNoHtml < quantidadeTarefasNoLocalStorage) {
            var textDaTarefa = objetoTarefasNoLocalStorage.tarefaESuasCaracteristicas[quantidadeTarefasNoHtml].conteudo;
            var tarefaLocalStorageStatusChecked = objetoTarefasNoLocalStorage.tarefaESuasCaracteristicas[quantidadeTarefasNoHtml].inputChecked;

            criarNovaLiESuasPropriedadesIniciais(textDaTarefa, quantidadeTarefasNoHtml);

            var elementoLiTarefa = document.getElementsByClassName("tarefa")[quantidadeTarefasNoHtml];
            var elementoInputDaTarefa = document.getElementsByClassName("checkDaTarefa")[quantidadeTarefasNoHtml];
            elementoInputDaTarefa.checked = tarefaLocalStorageStatusChecked;
            verificarSeTarefaCheckedParaTacharOuRetirarLinhaTachada (tarefaLocalStorageStatusChecked, elementoLiTarefa);

            adicionarEventListenersNaNovaLi(quantidadeTarefasNoHtml);
        
            quantidadeTarefasNoHtml = document.getElementsByClassName("tarefa").length;
        }
    }
}

function adicionarNovaTarefa() {
    var textoDaNovaTarefa = document.getElementById("campoInserirTarefa").value;

    if (textoDaNovaTarefa != "") {
        var quantidadeTarefasNoHtml = document.getElementsByClassName("tarefa").length; 

        criarNovaLiESuasPropriedadesIniciais(textoDaNovaTarefa, quantidadeTarefasNoHtml);

        adicionarEventListenersNaNovaLi(quantidadeTarefasNoHtml);

        document.getElementById("campoInserirTarefa").value = "";

        salvaAtualizacoesNoLocalStorage();
    }
}

function adicionarEventListenersNaNovaLi(quantidadeTarefasNoHtml) {
    document.getElementsByClassName("checkDaTarefa")[quantidadeTarefasNoHtml].addEventListener("click", function(e) {
        alterarStatusTarefa(e);
    });

    document.getElementsByClassName("fa fa-trash")[quantidadeTarefasNoHtml].addEventListener("click", function(e) {
        deletarTarefa(e);
    });
}

function criarNovaLiESuasPropriedadesIniciais(textoDaTarefa, quantidadeTarefasNoHtml) {    
    var novaLi = document.createElement("li");
    novaLi.classList.add("tarefa");
    document.getElementById("tarefasListadasNaTela").appendChild(novaLi);

    document.getElementsByClassName("tarefa")[quantidadeTarefasNoHtml].innerHTML = '<input type="checkbox" class="checkDaTarefa">' 
    + textoDaTarefa + '<a class="fa fa-trash" title="Deletar tarefa"></a>';
}

function alterarStatusTarefa(e) {
    var elementoInputDaTarefa = e.srcElement;
    var tarefaStatusChecked = elementoInputDaTarefa.checked;
    var elementoLiTarefa = elementoInputDaTarefa.parentElement;
    console.log(elementoLiTarefa);

    verificarSeTarefaCheckedParaTacharOuRetirarLinhaTachada (tarefaStatusChecked, elementoLiTarefa);

    salvaAtualizacoesNoLocalStorage();
}

function verificarSeTarefaCheckedParaTacharOuRetirarLinhaTachada (tarefaStatusChecked, elementoLiTarefa) {
    if (tarefaStatusChecked) {
        elementoLiTarefa.style.textDecorationLine = "line-through";
    } else {
        elementoLiTarefa.style.textDecorationLine = "none";
    }
}

function deletarTarefa(e) {
    var elementoLataDeLixo = e.srcElement;
    var elementoLiTarefa = elementoLataDeLixo.parentElement;
    var textoTarefa = elementoLiTarefa.textContent;
    console.log(textoTarefa);
    if (confirm("Tem certeza que você quer apagar a tarefa: "+ textoTarefa +"?")) {
        elementoLiTarefa.parentNode.removeChild(elementoLiTarefa);
        salvaAtualizacoesNoLocalStorage();
    }
}

function salvaAtualizacoesNoLocalStorage() {
    var objetoASerSalvoNoStorage = {
        tarefaESuasCaracteristicas: [],
    };

    var todasAsTarefas = document.querySelectorAll(".tarefa");

    for (var tarefa of todasAsTarefas) {
        var tagInputDaTarefa = tarefa.childNodes[0];
        var jsonDasCaracteristicasDessaTarefa = {
            inputChecked: tagInputDaTarefa.checked,
            conteudo: tarefa.textContent,
        };
        objetoASerSalvoNoStorage.tarefaESuasCaracteristicas.push(jsonDasCaracteristicasDessaTarefa);
    }
    localStorage.setItem('ListaDeTarefasSalva', JSON.stringify(objetoASerSalvoNoStorage));
}
