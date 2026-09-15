import {cookies} from 'next/headers';
import {hashToken,run} from '../../../lib/server';
export async function GET(req:Request){const token=(await cookies()).get('byron_session')?.value;if(token)await run('DELETE FROM sessions WHERE id=?',await hashToken(token));return new Response(null,{status:302,headers:{Location:'/acceso','Set-Cookie':'byron_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'+(new URL(req.url).protocol==='https:'?'; Secure':'')}});}
