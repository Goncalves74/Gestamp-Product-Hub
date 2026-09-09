const views=document.querySelectorAll('.view');
const navItems=document.querySelectorAll('.nav-item');
const subNavItems=document.querySelectorAll('.subnav');
const toast=document.getElementById('toast');
const modal=document.getElementById('modal');
const modalTitle=document.getElementById('modalTitle');
const modalText=document.getElementById('modalText');
const modalOptions=document.getElementById('modalOptions');

function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}
let activeDepartment='quality';
function showView(id){
  views.forEach(v=>v.classList.toggle('active',v.id===id));
  const shared=['complaints','claimsManagement'];
  navItems.forEach(n=>{const departmentActive=(n.classList.contains('quality-main')&&activeDepartment==='quality'&&shared.includes(id))||(n.classList.contains('logistics-main')&&activeDepartment==='logistics'&&shared.includes(id))||(n.classList.contains('production-main')&&id==='parametersManagement');n.classList.toggle('active',n.dataset.view===id||departmentActive)});
  subNavItems.forEach(n=>n.classList.toggle('active',n.dataset.view===id&&(!shared.includes(id)||n.dataset.area===activeDepartment)));
  window.scrollTo({top:0,behavior:'smooth'});document.getElementById('sidebar').classList.remove('open')
}
navItems.forEach(item=>item.addEventListener('click',()=>{if(item.classList.contains('quality-main'))activeDepartment='quality';if(item.classList.contains('logistics-main'))activeDepartment='logistics';item.closest('.nav-group')?.classList.toggle('open');showView(item.dataset.view)}));
subNavItems.forEach(item=>item.addEventListener('click',()=>{if(item.dataset.area==='quality'||item.dataset.area==='logistics'){activeDepartment=item.dataset.area;setComplaintArea(activeDepartment)}item.closest('.nav-group')?.classList.add('open');showView(item.dataset.view)}));
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

const partCatalog={
  EBPIA13V00:{designation:'Bracket LH',project:'CX735',client:'Ford',clientRef:'CLI-CX735-LH',vehicle:'K9',destinations:['Planta Cliente Norte','Vigo','Valência']},
  EBPIA14V00:{designation:'Bracket RH',project:'CX735',client:'Ford',clientRef:'CLI-CX735-RH',vehicle:'K9',destinations:['Planta Cliente Norte','Vigo','Valência']},
  EBPZA02V00:{designation:'Chassis Support',project:'P24004',client:'Renault',clientRef:'CLI-P24004-02',vehicle:'CMP',destinations:['Palência','Sovab']}
};
const complaintForm=document.getElementById('complaintForm');
const referenceSelect=document.getElementById('complaintReference');
function populatePart(){const part=partCatalog[referenceSelect.value];document.getElementById('complaintDesignation').value=part.designation;document.getElementById('complaintProject').value=part.project;document.getElementById('complaintClientName').value=part.client;document.getElementById('complaintClientRef').value=part.clientRef;document.getElementById('complaintVehicle').value=part.vehicle;document.getElementById('complaintDestination').innerHTML=part.destinations.map(destination=>`<option>${destination}</option>`).join('')}
referenceSelect.addEventListener('change',populatePart);
function setComplaintArea(area){
  activeDepartment=area;
  const logistics=area==='logistics';
  document.getElementById('complaintEyebrow').textContent=logistics?'LOGÍSTICA · CLIENTE':'QUALIDADE · CLIENTE';
  document.getElementById('complaintTitle').textContent=logistics?'Registo de Reclamações Logísticas':'Registo de Reclamações';
  document.getElementById('complaintSubtitle').textContent=logistics?'Registe ocorrências de transporte, embalagem, identificação e entrega.':'Registe a informação inicial recebida do cliente e encaminhe a reclamação para análise.';
  document.getElementById('complaintNumber').textContent=logistics?'RCL-2026-0041':'RCQ-2026-0084';
  document.getElementById('complaintOwner').textContent=logistics?'Carla Mendes':'Joana Freitas';
  document.getElementById('managementEyebrow').textContent=logistics?'LOGÍSTICA · ACOMPANHAMENTO':'QUALIDADE · ACOMPANHAMENTO';
  document.getElementById('managementTitle').textContent=logistics?'Gestão de Reclamações Logísticas':'Gestão de Reclamações';
  if(logistics){document.getElementById('claimOrigin').innerHTML='<option>Transporte</option><option>Embalagem</option><option>Expedição</option><option>Armazém</option><option>Fornecedor</option>';document.getElementById('defectCode').innerHTML='<option>Embalagem</option><option>Identificação</option><option>Quantidade</option><option>Transporte</option><option>Humidade</option>';document.getElementById('defectFamily').innerHTML='<option>Contentor incorreto</option><option>Etiqueta incorreta</option><option>Peças danificadas</option><option>Atraso de entrega</option><option>Contaminação/água</option>'}
  else{document.getElementById('claimOrigin').innerHTML='<option>Produção</option><option>Logística</option><option>Fornecedor</option><option>Engenharia</option>';document.getElementById('defectCode').innerHTML='<option>Geometria</option><option>Soldadura</option><option>Superfície</option><option>Identificação</option>';document.getElementById('defectFamily').innerHTML='<option>Desvios de geometria</option><option>Componente em falta</option><option>Dano superficial</option><option>Erro de processo</option>'}
  renderDepartmentClaims();
}
complaintForm.addEventListener('submit',event=>{event.preventDefault();showToast(`Reclamação ${activeDepartment==='logistics'?'logística':'de qualidade'} guardada e enviada para gestão.`);setTimeout(()=>showView('claimsManagement'),700)});
document.getElementById('saveComplaint').addEventListener('click',()=>complaintForm.requestSubmit());
document.getElementById('clearComplaint').addEventListener('click',()=>{complaintForm.reset();populatePart();showToast('Formulário limpo.')});
document.getElementById('printChecklist').addEventListener('click',()=>showToast('Check-list preparada para impressão.'));
document.getElementById('newClaimButton').addEventListener('click',()=>showView('complaints'));

const claimSearch=document.getElementById('claimSearch'),claimClient=document.getElementById('claimClient'),claimStatus=document.getElementById('claimStatus'),claimDateFrom=document.getElementById('claimDateFrom'),claimDateTo=document.getElementById('claimDateTo');
const claimsBody=document.querySelector('#claimsTable tbody');
const qualityRowsHtml=claimsBody.innerHTML;
const logisticsRowsHtml=`
  <tr data-client="Ford" data-status="Em tratamento" data-date="2026-09-08"><td><b>Ford</b><small>Valência</small></td><td><b>EBPIA13V00</b><small>Carla Mendes</small></td><td>K9</td><td>08/09/2026</td><td>LOG-2041</td><td>A</td><td>0</td><td>Contentores recebidos sem etiqueta</td><td><span class="tag error">Sim</span></td><td><span class="tag attention">Em tratamento</span></td><td>96</td><td><b>1 120 €</b></td><td>Pendente</td><td><button class="text-btn manage-claim">Gerir →</button></td></tr>
  <tr data-client="Stellantis" data-status="Aguardando dados" data-date="2026-09-05"><td><b>Stellantis</b><small>Vigo</small></td><td><b>EBPIA14V00</b><small>Pedro Alves</small></td><td>K9</td><td>05/09/2026</td><td>LOG-2038</td><td>B</td><td>0</td><td>Embalagem danificada no transporte</td><td><span class="tag neutral">Não</span></td><td><span class="tag info">Aguardando dados</span></td><td>48</td><td><b>760 €</b></td><td>ND-260921</td><td><button class="text-btn manage-claim">Gerir →</button></td></tr>
  <tr data-client="Renault" data-status="Encerrada" data-date="2026-09-02"><td><b>Renault</b><small>Sovab</small></td><td><b>EBPZA02V00</b><small>Carla Mendes</small></td><td>CMP</td><td>02/09/2026</td><td>LOG-2030</td><td>0</td><td>0</td><td>Quantidade expedida incorreta</td><td><span class="tag neutral">Não</span></td><td><span class="tag success">Encerrada</span></td><td>12</td><td><b>340 €</b></td><td>FT-260901</td><td><button class="text-btn manage-claim">Consultar →</button></td></tr>`;
let claimRows=[];
function openClaimDetail(){const detail=document.getElementById('claimDetail');detail.hidden=false;detail.scrollIntoView({behavior:'smooth'})}
function renderDepartmentClaims(){claimsBody.innerHTML=activeDepartment==='logistics'?logisticsRowsHtml:qualityRowsHtml;claimRows=[...claimsBody.querySelectorAll('tr')];document.querySelectorAll('.manage-claim').forEach(button=>button.addEventListener('click',openClaimDetail));filterClaims()}
function formatDate(date){if(!date)return'—';const [year,month,day]=date.split('-');return`${day}/${month}/${year}`}
function filterClaims(){const query=claimSearch.value.trim().toLowerCase(),from=claimDateFrom.value,to=claimDateTo.value;let visible=0;claimRows.forEach(row=>{const date=row.dataset.date;const show=(!query||row.textContent.toLowerCase().includes(query))&&(!claimClient.value||row.dataset.client===claimClient.value)&&(!claimStatus.value||row.dataset.status===claimStatus.value)&&(!from||date>=from)&&(!to||date<=to);row.style.display=show?'':'none';if(show)visible++});document.getElementById('visibleClaims').textContent=visible;document.getElementById('selectedPeriod').textContent=`${formatDate(from)} a ${formatDate(to)}`}
[claimSearch,claimClient,claimStatus,claimDateFrom,claimDateTo].forEach(control=>control.addEventListener(control.tagName==='SELECT'?'change':'input',filterClaims));
document.getElementById('closeClaimDetail').addEventListener('click',()=>document.getElementById('claimDetail').hidden=true);
document.getElementById('saveClaimManagement').addEventListener('click',()=>showToast('Acompanhamento, quantidades e custos guardados.'));
document.getElementById('printClaimsReport').addEventListener('click',()=>{
  const visibleRows=claimRows.filter(row=>row.style.display!=='none');
  document.getElementById('reportTitle').textContent=activeDepartment==='logistics'?'LISTA DE RECLAMAÇÕES LOGÍSTICAS':'LISTA DE REJEIÇÕES DE CLIENTES';
  document.getElementById('reportPeriod').textContent=`Período: ${formatDate(claimDateFrom.value)} a ${formatDate(claimDateTo.value)}`;
  document.getElementById('reportGeneratedAt').textContent=new Date().toLocaleDateString('pt-PT');
  document.getElementById('reportRows').innerHTML=visibleRows.map((row,index)=>{const c=row.cells;return`<tr><td>${c[0].innerHTML}</td><td>${c[1].innerHTML}</td><td><img src="${index%2?'product_real.png':'product_3d.png'}" alt=""></td><td>${c[2].textContent}</td><td>${[120,90,60,300][index]||0}</td><td>${c[6].textContent}</td><td>${[240,1500,605,3385][index]||0}</td><td>${c[3].textContent}</td><td>${c[4].textContent}<br><b>${c[8].textContent==='Sim'?'RECLAMAÇÃO':'ALERTA'}</b></td><td>${c[5].textContent}</td><td>${index?0:c[11].textContent}</td><td>${c[11].textContent}</td><td>${c[1].querySelector('b').textContent}</td><td>${c[7].textContent}</td></tr>`}).join('');
  window.print();
});

const parameterInputs=[...document.querySelectorAll('.parameter-input')];
const editParameters=document.getElementById('editParameters');
const saveParameters=document.getElementById('saveParameters');
const cancelParameters=document.getElementById('cancelParameters');
const parameterVersion=document.getElementById('parameterVersion');
const parameterStatus=document.getElementById('parameterStatus');
let parameterSnapshot=[];
function setParameterEditMode(editing){
  parameterInputs.forEach(input=>input.readOnly=!editing);
  saveParameters.hidden=!editing;cancelParameters.hidden=!editing;editParameters.hidden=editing;
}
editParameters.addEventListener('click',()=>{parameterSnapshot=parameterInputs.map(input=>input.value);setParameterEditMode(true);parameterInputs[0].focus();showToast('Modo de edição ativo. Os campos alteráveis estão destacados.');});
cancelParameters.addEventListener('click',()=>{parameterInputs.forEach((input,index)=>input.value=parameterSnapshot[index]);setParameterEditMode(false);showToast('Edição cancelada sem criar nova versão.');});
function updatePendingParameterCount(){document.getElementById('pendingParameterCount').textContent=document.querySelectorAll('#parameterHistoryRows .tag.attention').length}
function bindParameterActions(){
  document.querySelectorAll('.validate-parameter').forEach(button=>button.onclick=()=>{const row=button.closest('tr');row.querySelector('.tag').className='tag success';row.querySelector('.tag').textContent='Validada';button.outerHTML='<button class="text-btn view-parameter">Consultar →</button>';updatePendingParameterCount();showToast('Alteração validada por Rui Martins. A nova versão está vigente.');});
  document.querySelectorAll('.view-parameter').forEach(button=>button.onclick=()=>showView('parameters'));
}
saveParameters.addEventListener('click',()=>{
  const changed=parameterInputs.reduce((total,input,index)=>total+(input.value!==parameterSnapshot[index]?1:0),0);
  if(!changed){showToast('Não existem parâmetros alterados.');return}
  const nextVersion=Number(parameterVersion.textContent)+1;
  parameterVersion.textContent=nextVersion;parameterStatus.textContent='A aguardar validação';parameterStatus.className='tag attention';
  document.getElementById('parameterDate').textContent='09/09/2026 · 14:35';document.getElementById('parameterModifiedBy').textContent='António Gonçalves';document.getElementById('parameterValidatedBy').textContent='Pendente';
  document.getElementById('parameterHistoryRows').insertAdjacentHTML('afterbegin',`<tr><td><b>E718005V20</b><small>Estampagem · OP20</small></td><td>P0063 · P0024</td><td><b>v${nextVersion}</b></td><td>${changed} parâmetro${changed>1?'s':''} alterado${changed>1?'s':''}</td><td>António Gonçalves</td><td>09/09/2026 · 14:35</td><td>Rui Martins</td><td><span class="tag attention">A aguardar validação</span></td><td><button class="btn primary small validate-parameter">Validar</button></td></tr>`);
  setParameterEditMode(false);bindParameterActions();updatePendingParameterCount();showToast(`Versão ${nextVersion} criada e enviada para validação.`);
});
document.getElementById('parameterHistory').addEventListener('click',()=>showView('parametersManagement'));
document.getElementById('parameterSearch').addEventListener('input',event=>{const query=event.currentTarget.value.toLowerCase();document.querySelectorAll('#parameterHistoryRows tr').forEach(row=>row.style.display=row.textContent.toLowerCase().includes(query)?'':'none')});
bindParameterActions();updatePendingParameterCount();
setComplaintArea('quality');populatePart();
