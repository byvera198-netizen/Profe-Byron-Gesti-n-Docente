import assert from 'node:assert/strict';

const origin='http://localhost:5173';
const email=`auth-${Date.now()}@example.test`,password='Clave-segura-2026';
const request=async(path,body,cookie='')=>{const res=await fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,Cookie:cookie},body:JSON.stringify(body)});return {res,body:await res.json()};};
const registered=await request('/api/auth/register',{name:'Docente de prueba',email,password});
assert.equal(registered.res.status,201);const cookie=registered.res.headers.get('set-cookie').split(';')[0];
const profile=await fetch(origin+'/api/workspace',{headers:{Cookie:cookie}});assert.equal(profile.status,200);assert.equal((await profile.json()).user.email,email);
const failed=await request('/api/auth/login',{email,password:'contraseña incorrecta'});assert.equal(failed.res.status,401);
const logged=await request('/api/auth/login',{email,password});assert.equal(logged.res.status,200);assert(logged.res.headers.get('set-cookie').includes('byron_session='));
console.log('PASS: registro por correo, inicio de sesión, sesión persistente y rechazo de contraseña incorrecta.');
