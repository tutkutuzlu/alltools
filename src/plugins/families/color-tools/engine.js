const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
const round=(value,digits=2)=>Number(value.toFixed(digits));
const byte=value=>Math.round(clamp(value,0,255));

export function parseHex(input){
  const value=String(input??"").trim().replace(/^#/,"");
  if(!/^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value))throw new Error("Enter a valid 3, 4, 6 or 8 digit HEX color.");
  const expanded=value.length<=4?[...value].map(char=>char+char).join(""):value;
  return{r:parseInt(expanded.slice(0,2),16),g:parseInt(expanded.slice(2,4),16),b:parseInt(expanded.slice(4,6),16),a:expanded.length===8?round(parseInt(expanded.slice(6,8),16)/255,4):1};
}
export function rgbToHex({r,g,b,a=1},includeAlpha=a<1){
  const hex=[r,g,b].map(value=>byte(value).toString(16).padStart(2,"0")).join("").toUpperCase();
  return`#${hex}${includeAlpha?Math.round(clamp(a)*255).toString(16).padStart(2,"0").toUpperCase():""}`;
}
export function parseRgb(input){
  const match=String(input??"").trim().match(/^(?:rgba?\()?\s*(-?[\d.]+)%?\s*[,\s]+\s*(-?[\d.]+)%?\s*[,\s]+\s*(-?[\d.]+)%?(?:\s*[,/]\s*(-?[\d.]+%?))?\s*\)?$/i);
  if(!match)throw new Error("Enter RGB as rgb(255, 128, 0) or 255, 128, 0.");
  const values=match.slice(1,4).map(Number);if(values.some(value=>!Number.isFinite(value)||value<0||value>255))throw new Error("RGB channels must be between 0 and 255.");
  let a=match[4]===undefined?1:parseFloat(match[4]);if(match[4]?.includes("%"))a/=100;if(!Number.isFinite(a)||a<0||a>1)throw new Error("Alpha must be between 0 and 1.");
  return{r:values[0],g:values[1],b:values[2],a};
}
const hue=(value)=>((value%360)+360)%360;
export function rgbToHsl({r,g,b,a=1}){const rn=r/255,gn=g/255,bn=b/255,max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn),d=max-min,l=(max+min)/2;let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));if(max===rn)h=60*(((gn-bn)/d)%6);else if(max===gn)h=60*((bn-rn)/d+2);else h=60*((rn-gn)/d+4);}return{h:round(hue(h),2),s:round(s*100,2),l:round(l*100,2),a};}
export function hslToRgb({h,s,l,a=1}){h=hue(h);s=clamp(s/100);l=clamp(l/100);const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let p=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return{r:byte((p[0]+m)*255),g:byte((p[1]+m)*255),b:byte((p[2]+m)*255),a};}
export function parseHsl(input){const match=String(input??"").trim().match(/^(?:hsla?\()?\s*(-?[\d.]+)(?:deg)?\s*[,\s]+\s*(-?[\d.]+)%\s*[,\s]+\s*(-?[\d.]+)%(?:\s*[,/]\s*(-?[\d.]+%?))?\s*\)?$/i);if(!match)throw new Error("Enter HSL as hsl(210, 50%, 40%).");const h=Number(match[1]),s=Number(match[2]),l=Number(match[3]);let a=match[4]===undefined?1:parseFloat(match[4]);if(match[4]?.includes("%"))a/=100;if(![h,s,l,a].every(Number.isFinite)||s<0||s>100||l<0||l>100||a<0||a>1)throw new Error("Saturation and lightness use 0–100%; alpha uses 0–1.");return{h:hue(h),s,l,a};}
export function rgbToHsv({r,g,b,a=1}){const rn=r/255,gn=g/255,bn=b/255,max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn),d=max-min;let h=0;if(d){if(max===rn)h=60*(((gn-bn)/d)%6);else if(max===gn)h=60*((bn-rn)/d+2);else h=60*((rn-gn)/d+4);}return{h:round(hue(h),2),s:round((max?d/max:0)*100,2),v:round(max*100,2),a};}
export function hsvToRgb({h,s,v,a=1}){h=hue(h);s=clamp(s/100);v=clamp(v/100);const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;const p=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return{r:byte((p[0]+m)*255),g:byte((p[1]+m)*255),b:byte((p[2]+m)*255),a};}
export function parseHsv(input){const match=String(input??"").trim().match(/^(?:hsva?\()?\s*(-?[\d.]+)(?:deg)?\s*[,\s]+\s*(-?[\d.]+)%\s*[,\s]+\s*(-?[\d.]+)%(?:\s*[,/]\s*(-?[\d.]+%?))?\s*\)?$/i);if(!match)throw new Error("Enter HSV as hsv(210, 50%, 80%).");const result={h:hue(Number(match[1])),s:Number(match[2]),v:Number(match[3]),a:match[4]===undefined?1:parseFloat(match[4])};if(match[4]?.includes("%"))result.a/=100;if(!Object.values(result).every(Number.isFinite)||result.s<0||result.s>100||result.v<0||result.v>100||result.a<0||result.a>1)throw new Error("Saturation and value use 0–100%; alpha uses 0–1.");return result;}
export function rgbToCmyk({r,g,b,a=1}){const rn=r/255,gn=g/255,bn=b/255,k=1-Math.max(rn,gn,bn);if(k===1)return{c:0,m:0,y:0,k:100,a};return{c:round((1-rn-k)/(1-k)*100,2),m:round((1-gn-k)/(1-k)*100,2),y:round((1-bn-k)/(1-k)*100,2),k:round(k*100,2),a};}
export function cmykToRgb({c,m,y,k,a=1}){return{r:byte(255*(1-c/100)*(1-k/100)),g:byte(255*(1-m/100)*(1-k/100)),b:byte(255*(1-y/100)*(1-k/100)),a};}
export function parseCmyk(input){const match=String(input??"").trim().match(/^(?:cmyk\()?\s*(-?[\d.]+)%?\s*[,\s]+\s*(-?[\d.]+)%?\s*[,\s]+\s*(-?[\d.]+)%?\s*[,\s]+\s*(-?[\d.]+)%?\s*\)?$/i);if(!match)throw new Error("Enter CMYK as cmyk(0%, 50%, 100%, 0%).");const [c,m,y,k]=match.slice(1).map(Number);if(![c,m,y,k].every(value=>Number.isFinite(value)&&value>=0&&value<=100))throw new Error("CMYK channels must be between 0 and 100%.");return{c,m,y,k,a:1};}
export function parseColor(input){const value=String(input??"").trim();if(/^#?[0-9a-f]{3,8}$/i.test(value))return parseHex(value);if(/^rgba?/i.test(value)||/^\s*\d+\s*[, ]/.test(value))return parseRgb(value);if(/^hsla?/i.test(value))return hslToRgb(parseHsl(value));if(/^hsva?/i.test(value))return hsvToRgb(parseHsv(value));if(/^cmyk/i.test(value))return cmykToRgb(parseCmyk(value));throw new Error("Use a valid HEX, RGB, HSL, HSV or CMYK color.");}
export const formatRgb=({r,g,b,a=1})=>a<1?`rgba(${byte(r)}, ${byte(g)}, ${byte(b)}, ${round(a,3)})`:`rgb(${byte(r)}, ${byte(g)}, ${byte(b)})`;
export const formatHsl=({h,s,l,a=1})=>a<1?`hsla(${round(h)}, ${round(s)}%, ${round(l)}%, ${round(a,3)})`:`hsl(${round(h)}, ${round(s)}%, ${round(l)}%)`;
export const formatHsv=({h,s,v,a=1})=>`hsv(${round(h)}, ${round(s)}%, ${round(v)}%${a<1?`, ${round(a,3)}`:""})`;
export const formatCmyk=({c,m,y,k})=>`cmyk(${round(c)}%, ${round(m)}%, ${round(y)}%, ${round(k)}%)`;
export function relativeLuminance(color){const channels=[color.r,color.g,color.b].map(v=>{const n=v/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return .2126*channels[0]+.7152*channels[1]+.0722*channels[2];}
export function contrastRatio(first,second){const [light,dark]=[relativeLuminance(first),relativeLuminance(second)].sort((a,b)=>b-a);return(light+.05)/(dark+.05);}
export function wcagReport(first,second){const ratio=contrastRatio(first,second);return{ratio:round(ratio,2),normalAA:ratio>=4.5,normalAAA:ratio>=7,largeAA:ratio>=3,largeAAA:ratio>=4.5};}
export function mixColors(first,second,weight=.5){weight=clamp(weight);return{r:byte(first.r*(1-weight)+second.r*weight),g:byte(first.g*(1-weight)+second.g*weight),b:byte(first.b*(1-weight)+second.b*weight),a:round(first.a*(1-weight)+second.a*weight,4)};}
export function rotateHue(color,degrees){const hsl=rgbToHsl(color);return hslToRgb({...hsl,h:hsl.h+degrees});}
export function adjustLightness(color,amount){const hsl=rgbToHsl(color);return hslToRgb({...hsl,l:clamp(hsl.l+amount,0,100)});}
export function deterministicPalette(input,count=5,mode="analogous"){const base=parseColor(input),steps={analogous:[-60,-30,0,30,60],triadic:[0,120,240,60,180],complementary:[0,180,30,210,60],palette:[0,35,75,145,215,285]}[mode]??[0];return Array.from({length:count},(_,index)=>rgbToHex(rotateHue(base,steps[index%steps.length])));}
export function gradientCss(colors,direction="90deg"){if(!Array.isArray(colors)||colors.length<2)throw new Error("Provide at least two gradient colors.");const parsed=colors.map(parseColor).map(color=>rgbToHex(color,color.a<1));return`linear-gradient(${direction}, ${parsed.map((color,index)=>`${color} ${round(index/(parsed.length-1)*100)}%`).join(", ")})`;}
const colorNames={black:"#000000",white:"#FFFFFF",red:"#FF0000",green:"#008000",blue:"#0000FF",yellow:"#FFFF00",orange:"#FFA500",purple:"#800080",pink:"#FFC0CB",gray:"#808080",grey:"#808080",navy:"#000080",teal:"#008080",aqua:"#00FFFF",cyan:"#00FFFF",magenta:"#FF00FF",lime:"#00FF00",maroon:"#800000",olive:"#808000",silver:"#C0C0C0",gold:"#FFD700",coral:"#FF7F50",indigo:"#4B0082",violet:"#EE82EE",transparent:"#00000000"};
export function lookupColorName(input){const value=String(input??"").trim().toLowerCase();if(colorNames[value])return{name:value,hex:colorNames[value]};const rgb=parseColor(value);const hex=rgbToHex(rgb);const found=Object.entries(colorNames).find(([,candidate])=>candidate===hex);return{name:found?.[0]??"Custom color",hex};}
export function seededRandomColors(seed,count=5){let state=2166136261;for(const char of String(seed||"AllTools")){state^=char.charCodeAt(0);state=Math.imul(state,16777619);}return Array.from({length:count},()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return`#${(state&0xFFFFFF).toString(16).padStart(6,"0").toUpperCase()}`;});}
export function alphaComposite(foreground,background){const a=clamp(foreground.a);return{r:byte(foreground.r*a+background.r*(1-a)),g:byte(foreground.g*a+background.g*(1-a)),b:byte(foreground.b*a+background.b*(1-a)),a:1};}
