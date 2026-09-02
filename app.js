const views=document.querySelectorAll('.view');
const navItems=document.querySelectorAll('.nav-item');
const toast=document.getElementById('toast');
const modal=document.getElementById('modal');
const modalTitle=document.getElementById('modalTitle');
const modalText=document.getElementById('modalText');
const modalOptions=document.getElementById('modalOptions');

function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}
function showView(id){views.forEach(v=>v.classList.toggle('active',v.id===id));navItems.forEach(n=>n.classList.toggle('active',n.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'});document.getElementById('sidebar').classList.remove('open')}
navItems.forEach(item=>item.addEventListener('click',()=>showView(item.dataset.view)));
document.getElementById('menu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth'})));

const modes={
  view:{title:'Consultar peça existente',text:'Pesquise por projeto, referência SAP, referência cliente, veículo ou designação.',options:[['CX735 · EBPIA13V00','Bracket LH · Ford · Em desenvolvimento'],['CX735 · EBPIA14V00','Bracket RH · Ford · Em desenvolvimento'],['P24004 · EBPZA02V00','Chassis Support · Produção']]},
  new:{title:'Criar nova peça',text:'Escolha como pretende iniciar a nova Planificação Avançada.',options:[['Novo projeto','Criar projeto, equipa e primeira peça'],['Projeto existente','Herdar cliente, equipa e dados comuns'],['Peça semelhante','Copiar apenas a estrutura reutilizável']]},
  change:{title:'Introduzir alteração',text:'A versão vigente será preservada e as diferenças seguirão para IT/SAP.',options:[['Alteração de produto','Desenho, material, índice ou referência'],['Alteração de processo','Rota, meios, cadência ou parâmetros'],['Alteração logística','Fornecedor, embalagem ou expedição']]}
};
document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{const mode=modes[btn.dataset.mode];modalTitle.textContent=mode.title;modalText.textContent=mode.text;modalOptions.innerHTML=mode.options.map((o,i)=>`<button data-option="${i}"><b>${o[0]}</b><span>${o[1]}</span></button>`).join('');modal.classList.add('open');modal.setAttribute('aria-hidden','false')}));
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
document.querySelectorAll('.modal-close,.modal-close-action').forEach(b=>b.addEventListener('click',closeModal));
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.querySelector('.modal-confirm').addEventListener('click',()=>{closeModal();showToast('Fluxo demonstrativo iniciado.')});
document.querySelectorAll('.edit-demo').forEach(b=>b.addEventListener('click',()=>showToast('Permissão de edição validada para esta área.')));
document.querySelectorAll('.open-doc').forEach(b=>b.addEventListener('click',()=>showToast('Abriria o documento vigente no repositório corporativo.')));
document.getElementById('sapChange').addEventListener('click',()=>showToast('Pedido SAP em preparação: 2 alterações registadas.'));
document.getElementById('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.currentTarget.value.trim()){showView('pa');showToast(`Resultado selecionado: CX735 · EBPIA13V00`)}});
document.querySelector('.close-banner').addEventListener('click',e=>e.currentTarget.parentElement.remove());

const qualityContent={
  'Documentação':{intro:'Documentos da Qualidade, respetivas revisões, responsáveis e estado de aprovação.',items:[['Plano de Controlo','Rev. 06 · Aprovado'],['AMFE Processo','Rev. 07 · Aprovado'],['Estudo de capacidade','Pendente de validação'],['Relatório dimensional','Documento em falta'],['PPAP','Em preparação'],['Certificado de material','Rev. 02 · Vigente']]},
  'Processo':{intro:'Características, operações e controlos associados ao processo produtivo.',items:[['Estampagem OP20','Capacidade validada'],['Corte OP30','Amostragem definida'],['Soldadura OP40','Parâmetros em revisão'],['Controlo OP60','Meios aprovados']]},
  'Componentes':{intro:'Documentação obrigatória dos componentes e matérias-primas da árvore do produto.',items:[['COMP-001','Corpo estampado principal'],['COMP-002','Porca M8 soldada'],['WSS-M1A367-A50','Chapa galvanizada · 1,8 mm']]},
  'Outros':{intro:'Registos complementares, observações e evidências associadas ao dossier.',items:[['Fotografias','2 ficheiros'],['Amostras iniciais','Entrega prevista 12/10/2026'],['Observações','1 registo ativo']]},
  'Árvore do Produto':{intro:'Estrutura sincronizada automaticamente com a Planificação Avançada.',items:[['EBPIA13V00','Produto final'],['COMP-001','1 unidade'],['WSS-M1A367-A50','1,82 kg'],['COMP-002','2 unidades']]}
};
const qualityTabs=document.querySelectorAll('[data-quality-tab]');
const qualityGeneral=document.getElementById('qualityGeneral');
const qualityGrid=document.getElementById('qualityGrid');
const qualityDynamic=document.getElementById('qualityDynamic');
function openQualityTab(name){
  qualityTabs.forEach(tab=>tab.classList.toggle('active',tab.dataset.qualityTab===name));
  const isGeneral=name==='Geral';
  qualityGeneral.hidden=!isGeneral;qualityGrid.hidden=!isGeneral;qualityDynamic.hidden=isGeneral;
  if(!isGeneral){const content=qualityContent[name];qualityDynamic.innerHTML=`<div class="section-head"><div><h2>${name}</h2><p>${content.intro}</p></div><button class="btn ghost">＋ Adicionar registo</button></div><div class="quality-cards">${content.items.map(item=>`<article><b>${item[0]}</b><span>${item[1]}</span></article>`).join('')}</div>`}
}
qualityTabs.forEach(tab=>tab.addEventListener('click',()=>openQualityTab(tab.dataset.qualityTab)));
document.querySelector('.quality-docs-link').addEventListener('click',()=>openQualityTab('Documentação'));
