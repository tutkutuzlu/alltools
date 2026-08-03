import{colorToolDefinitions}from"./definitions.js";
import{createToolUseTracker}from"../../../core/telemetry/tool-use.js";

let cleanup;
const action=(id,label,icon="copy",variant="secondary")=>({id,label,icon,variant});
const makePreview=()=>{const section=document.createElement("section");section.className="color-preview-panel";section.setAttribute("aria-label","Color preview");section.setAttribute("aria-live","polite");const swatches=document.createElement("div");swatches.className="color-swatch-grid";section.append(swatches);return{section,swatches,update(result){swatches.replaceChildren();for(const value of result.colors??[]){const item=document.createElement("div");item.className="color-swatch";item.style.setProperty("--swatch-color",value);const sample=document.createElement("span");sample.className="color-swatch__sample";sample.setAttribute("aria-hidden","true");const label=document.createElement("code");label.textContent=value;item.append(sample,label);swatches.append(item);}if(result.gradient)section.style.setProperty("--preview-gradient",result.gradient);else section.style.removeProperty("--preview-gradient");section.classList.toggle("color-preview-panel--gradient",Boolean(result.gradient));}}};

export function mount(root,context){
 const definition=colorToolDefinitions[context.toolId];if(!definition)throw new Error(`Unknown color tool: ${context.toolId}`);
 const tracker=createToolUseTracker({telemetry:context.telemetry,toolId:context.toolId,category:"color"});
 const inputs=definition.inputs??[];const controls=[...(definition.controls??[])];
 for(const extra of inputs.slice(1))controls.unshift({id:extra.id,label:extra.label,component:"field.input",placeholder:extra.placeholder,value:extra.value??extra.placeholder});
 if(definition.kind==="picker")controls.unshift({id:"native",label:"Native color picker",component:"field.color",value:"#3366CC"});
 const actions=[action("paste","Paste","paste"),action("clear","Clear","clear"),action("copy","Copy result")];if(definition.download)actions.push(action("download","Download CSS","download"));
 const first=inputs[0];const shell=context.components.create("tool.shell",{toolbarLabel:"Color tool actions",actions,controls,editor:{id:first.id,component:"field.input",type:"text",label:first.label,placeholder:first.placeholder,value:first.value??first.placeholder,autofocus:true},output:{id:`${definition.id}-output`,component:"field.textarea",label:"Result",rows:5}});
 const preview=makePreview();shell.element.insertBefore(preview.section,shell.notice.element);root.replaceChildren(shell.element);
 let last="";const handlers=[];const on=(element,event,handler)=>{element.addEventListener(event,handler);handlers.push(()=>element.removeEventListener(event,handler));};
 const values=()=>inputs.map((item,index)=>index===0?shell.input.value:shell.controls.get(item.id).input.value);
 const options=()=>Object.fromEntries([...shell.controls].map(([id,control])=>[id,control.input.type==="checkbox"?control.input.checked:control.input.value]));
 const update=()=>{const entered=values();if(!entered.every(value=>String(value).trim())){last="";shell.output.value="";preview.update({colors:[]});shell.notice.clear();tracker.observe(false);return;}try{const result=definition.convert(entered[0],options(),entered);last=result.output;shell.output.value=last;preview.update(result);shell.notice.clear();tracker.observe(true);}catch(error){last="";shell.output.value="";preview.update({colors:[]});shell.notice.show(error.message||"The color could not be processed.",0);tracker.observe(false);}};
 on(shell.input,"input",update);for(const [id,control] of shell.controls){const handler=id==="native"?()=>{shell.input.value=control.input.value;update();}:update;on(control.input,"input",handler);on(control.input,"change",handler);}
 const paste=async()=>{try{shell.input.value=await context.clipboard.readText();update();shell.input.focus();context.telemetry.trackPaste({toolId:context.toolId,category:"color"});}catch{shell.notice.show("Paste permission was not available.");}};
 const clear=()=>{shell.input.value="";for(const item of inputs.slice(1))shell.controls.get(item.id).input.value="";update();shell.input.focus();context.telemetry.trackClear({toolId:context.toolId,category:"color"});};
 const copy=async()=>{if(!last)return shell.notice.show("There is no result to copy.");try{await context.clipboard.writeText(last);shell.notice.show("Result copied.");context.telemetry.trackCopy({toolId:context.toolId,category:"color"});}catch{shell.notice.show("Copy was not available.");}};
 const download=()=>{if(!last)return shell.notice.show("There is no CSS to download.");const url=URL.createObjectURL(new Blob([last+"\n"],{type:"text/css;charset=utf-8"})),link=document.createElement("a");link.href=url;link.download="alltools-gradient.css";link.click();URL.revokeObjectURL(url);context.telemetry.trackDownload({toolId:context.toolId,category:"color"});};
 for(const[id,handler]of Object.entries({paste,clear,copy,download}))if(shell.actions.has(id))on(shell.actions.get(id).element,"click",handler);
 update();cleanup=()=>{for(const remove of handlers)remove();tracker.cancel();shell.notice.clear();};
}
export function unmount(){cleanup?.();cleanup=undefined;}
