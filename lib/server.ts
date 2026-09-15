import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { cookies } from 'next/headers';
export const db=()=>{if(!env.DB)throw new AppError('El almacenamiento no está disponible.',503);return env.DB;};
export class AppError extends Error{constructor(message:string,public status=400){super(message);}}
export const uid=()=>crypto.randomUUID();
export const now=()=>new Date().toISOString();
export const parse=(r:any)=>({...r,...JSON.parse(r.payload||'{}')});
export async function identity(){const token=(await cookies()).get('byron_session')?.value;if(token){const hash=await hashToken(token),s=await one('SELECT * FROM sessions WHERE id=? AND expires>?',hash,Date.now());if(s)return {userId:s.user,displayName:s.name,email:s.email,fullName:s.name};}const u=await getChatGPTUser();if(u)return u;throw new AppError('Inicia sesión para continuar.',401);}
export async function hashToken(t:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
const base64=(v:Uint8Array)=>btoa(String.fromCharCode(...v));
const base64Bytes=(v:string)=>Uint8Array.from(atob(v),x=>x.charCodeAt(0));
export async function passwordHash(password:string,salt:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:base64Bytes(salt),iterations:210000},key,256);return base64(new Uint8Array(bits));}
export function passwordSalt(){return base64(crypto.getRandomValues(new Uint8Array(16)));}
export function safeEqual(a:string,b:string){if(a.length!==b.length)return false;let result=0;for(let i=0;i<a.length;i++)result|=a.charCodeAt(i)^b.charCodeAt(i);return result===0;}
export async function createSession(user:string,email:string,name:string){const token=uid()+uid();await run('INSERT INTO sessions(id,user,email,name,expires) VALUES(?,?,?,?,?)',await hashToken(token),user,email.toLowerCase(),name,Date.now()+7*86400000);return token;}
export function sessionCookie(token:string,req:Request){return 'byron_session='+token+'; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800'+(new URL(req.url).protocol==='https:'?'; Secure':'');}
export async function all(sql:string,...params:any[]){return (await db().prepare(sql).bind(...params).all()).results as any[];}
export async function one(sql:string,...params:any[]){return await db().prepare(sql).bind(...params).first() as any;}
export async function run(sql:string,...params:any[]){return db().prepare(sql).bind(...params).run();}
export async function scope(institution:string){const user=await identity();let member=await one('SELECT * FROM members WHERE institution=? AND email=?',institution,user.email.toLowerCase());if(!member||member.status!=='aprobada')throw new AppError('No tienes acceso aprobado a esta institución.',403);if(member.user!==user.userId){if(member.user)throw new AppError('La membresía pertenece a otra identidad.',403);await run('UPDATE members SET user=? WHERE id=? AND user IS NULL',user.userId,member.id);member.user=user.userId;}const tutor=JSON.parse(member.tutor_courses||'[]') as string[],assigned=await all("SELECT course FROM records WHERE institution=? AND kind='assignment' AND deleted=0 AND json_extract(payload,'$.teacherId')=?",institution,member.id);return {user,member,admin:member.role==='administrador',director:member.role==='directivo',tutor,allowedCourses:[...new Set([...tutor,...assigned.map(a=>a.course)])]};}
export function canRead(s:any,r:any){return s.admin||s.director||r.kind==='subject'||(r.kind==='course'&&s.allowedCourses.includes(r.id))||(['student','meeting'].includes(r.kind)&&s.allowedCourses.includes(r.course))||r.owner===s.member.id||s.tutor.includes(r.course);}
export function canWrite(s:any,r:any){if(s.admin)return true;if(['course','subject','student'].includes(r.kind))return false;if(r.kind==='meeting')return s.director||s.tutor.includes(r.course);if(r.kind==='commitment')return r.owner===s.member.id||s.director||s.tutor.includes(r.course);return r.owner===s.member.id;}
export async function log(inst:string,actor:string,action:string,target:string,detail:any={}){return db().prepare('INSERT INTO audit(id,institution,actor,action,target,detail,created) VALUES(?,?,?,?,?,?,?)').bind(uid(),inst,actor,action,target,JSON.stringify(detail),now());}
export function responseError(e:any){console.error('Application operation failed',e?.message);return Response.json({error:e instanceof AppError?e.message:'No se pudo completar la operación. Intenta de nuevo.'},{status:e instanceof AppError?e.status:500});}
export function originCheck(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new AppError('Solicitud no autorizada.',403);if(req.headers.get('sec-fetch-site')==='cross-site')throw new AppError('Solicitud no autorizada.',403);}
export async function body(req:Request){originCheck(req);const t=await req.text();if(t.length>2_000_000)throw new AppError('El archivo excede el tamaño permitido.');try{return JSON.parse(t);}catch{throw new AppError('Datos inválidos.');}}
export async function record(id:string,inst:string){const r=await one('SELECT * FROM records WHERE id=? AND institution=? AND deleted=0',id,inst);if(!r)throw new AppError('El registro no existe.',404);return parse(r);}
