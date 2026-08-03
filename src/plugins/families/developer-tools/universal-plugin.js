import { developerToolDefinitions } from "./tool-definitions.js";
import { createToolUseTracker } from "../../../core/telemetry/tool-use.js";

let cleanup;
const labels={paste:["Paste","paste"],clear:["Clear","clear"],copy:["Copy result","copy"],download:["Download result","download"],generate:["Generate","simple"]};
const normalizeResult=(value)=>typeof value==="object"&&value!==null?value:{output:String(value??"")};
const values=(shell,definition)=>Object.fromEntries((definition.controls??[]).map(({id,component})=>[id,component==="field.checkbox"?shell.controls.get(id).input.checked:shell.controls.get(id).input.value]));

export function mount(root,context){
  const definition=developerToolDefinitions[context.toolId];
  if(!definition)throw new Error(`Unknown developer tool definition: ${context.toolId}`);
  const tracker=createToolUseTracker({telemetry:context.telemetry,toolId:context.toolId,category:"developer"});
  const generator=definition.kind==="generator",analyzer=definition.kind==="analyzer";
  const shell=context.components.create("tool.shell",{toolbarLabel:"Developer tool actions",actions:definition.actions.map(id=>({id,label:labels[id][0],icon:labels[id][1],variant:id==="generate"?"primary":"secondary"})),controls:definition.controls,editor:generator?null:{id:`${definition.id}-input`,label:"Input",placeholder:"Enter or paste a value…",rows:9,autofocus:true},output:analyzer?null:{id:`${definition.id}-output`,label:"Result",rows:9},resultLabel:"Results",metrics:(definition.metrics??[]).map(([id,label])=>({id,label,value:"—"}))});
  root.replaceChildren(shell.element);let last="";const handlers=[];const on=(element,event,handler)=>{element.addEventListener(event,handler);handlers.push(()=>element.removeEventListener(event,handler));};
  const update=({meaningful=false}={})=>{if(!generator&&!shell.input.value){last="";if(shell.output)shell.output.value="";if(shell.results)shell.results.update(Object.fromEntries((definition.metrics??[]).map(([id])=>[id,"—"])));shell.notice.clear();tracker.observe(false);return;}try{const options=values(shell,definition);const raw=generator?definition.generate(options.amount,options):analyzer?definition.analyze(shell.input.value,options):definition.transform(shell.input.value,options);const result=normalizeResult(raw);last=result.output??"";if(shell.output)shell.output.value=last;if(shell.results)shell.results.update(result);shell.notice.clear();tracker.observe(generator?meaningful:Boolean(shell.input.value.trim()));}catch(error){last="";if(shell.output)shell.output.value="";shell.notice.show(error.message||"The input could not be processed.",0);}};
  if(shell.input)on(shell.input,"input",()=>update());for(const control of shell.controls.values())on(control.input,"change",()=>update({meaningful:generator}));
  const paste=async()=>{try{shell.input.value=await context.clipboard.readText();update();shell.input.focus();context.telemetry.trackPaste({toolId:context.toolId,category:"developer"});}catch{shell.notice.show("Paste permission was not available.");}};
  const clear=()=>{shell.input.value="";update();shell.input.focus();context.telemetry.trackClear({toolId:context.toolId,category:"developer"});};
  const copy=async()=>{if(!last)return shell.notice.show("There is no result to copy.");try{await context.clipboard.writeText(last);shell.notice.show("Result copied.");context.telemetry.trackCopy({toolId:context.toolId,category:"developer"});}catch{shell.notice.show("Copy was not available.");}};
  const download=()=>{if(!last)return shell.notice.show("There is no result to download.");const url=URL.createObjectURL(new Blob([last],{type:"text/plain;charset=utf-8"})),link=document.createElement("a");link.href=url;link.download=`${context.toolId}-result.txt`;link.click();URL.revokeObjectURL(url);context.telemetry.trackDownload({toolId:context.toolId,category:"developer"});};
  const actions={paste,clear,copy,download,generate:()=>update({meaningful:true})};for(const [id,handler] of Object.entries(actions))if(shell.actions.has(id))on(shell.actions.get(id).element,"click",handler);update();
  cleanup=()=>{for(const remove of handlers)remove();tracker.cancel();shell.notice.clear();};
}
export function unmount(){cleanup?.();cleanup=undefined;}
