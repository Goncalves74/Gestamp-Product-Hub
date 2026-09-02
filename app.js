
const body=document.body;document.querySelector(`[data-page="${body.dataset.page}"]`)?.classList.add('active');
const toggle=document.querySelector('.menu-toggle');toggle?.addEventListener('click',()=>document.querySelector('.sidebar').classList.toggle('open'));
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}
document.querySelector('#editBtn')?.addEventListener('click',()=>toast('Modo de edição demonstrativo ativado.'));
document.querySelector('#uploadBtn')?.addEventListener('click',()=>toast('Janela de carregamento simulada.'));
document.querySelectorAll('.dots').forEach(b=>b.onclick=()=>toast('Opções: abrir, histórico, copiar ligação.'));
document.querySelectorAll('.suggestion').forEach(b=>b.onclick=()=>location.href='copilot.html?q='+encodeURIComponent(b.dataset.question));
const gs=document.querySelector('#globalSearch');gs?.addEventListener('keydown',e=>{if(e.key==='Enter'&&gs.value.trim())location.href='copilot.html?q='+encodeURIComponent(gs.value.trim())});
document.querySelectorAll('.tree .toggle').forEach(b=>b.addEventListener('click',()=>{const node=b.closest('.tree-node');const branch=node.nextElementSibling;if(branch?.classList.contains('branch')){branch.classList.toggle('closed');b.textContent=branch.classList.contains('closed')?'+':'−'}}));
document.querySelector('#expandAll')?.addEventListener('click',()=>{document.querySelectorAll('.branch').forEach(x=>x.classList.remove('closed'));document.querySelectorAll('.tree .toggle').forEach(x=>x.textContent='−')});
const docSearch=document.querySelector('#docSearch'),typeFilter=document.querySelector('#typeFilter');function filterDocs(){const q=(docSearch?.value||'').toLowerCase(),t=typeFilter?.value||'';document.querySelectorAll('#docTable tbody tr').forEach(r=>r.style.display=(r.textContent.toLowerCase().includes(q)&&(!t||r.dataset.type===t))?'':'none')}docSearch?.addEventListener('input',filterDocs);typeFilter?.addEventListener('change',filterDocs);
const input=document.querySelector('#copilotInput'),send=document.querySelector('#sendPrompt'),messages=document.querySelector('#chatMessages');
const answers={
'referências':'Encontrei duas referências no projeto CX735: <b>EBPIA13V00 · Bracket LH</b> e <b>EBPIA14V00 · Bracket RH</b>. Ambas estão em fase de industrialização.',
'documentos':'No exemplo demonstrativo, existe <b>1 documento em revisão</b>: o Plano de Controlo PC_EBPIA13_Rev06. Os restantes documentos principais estão aprovados.',
'ppap':'O PPAP mais recente é <b>PPAP_CX735_EBPIA13_RevC.pdf</b>, com estado Aprovado e data demonstrativa de 28/08/2026.',
'alertas':'Resumo: 2 PPAP próximos da revisão, 7 documentos por aprovar e 4 AMFE atualizados a aguardar validação.'};
function ask(q){if(!q||!messages)return;messages.insertAdjacentHTML('beforeend',`<div class="message user"><div><p>${q.replace(/[<>]/g,'')}</p></div></div>`);const l=q.toLowerCase();let a=answers[Object.keys(answers).find(k=>l.includes(k))]||'Esta é uma demonstração visual. Numa versão real, o Copilot consultaria a base de dados, os documentos e as permissões do utilizador.';setTimeout(()=>{messages.insertAdjacentHTML('beforeend',`<div class="message bot"><div class="bot-avatar">✦</div><div><b>Copilot</b><p>${a}</p></div></div>`);messages.scrollTop=messages.scrollHeight},250);if(input)input.value=''}
send?.addEventListener('click',()=>ask(input.value.trim()));input?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(input.value.trim())}});document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>ask(b.dataset.prompt));
const params=new URLSearchParams(location.search);if(input&&params.get('q')){input.value=params.get('q');ask(input.value)}
