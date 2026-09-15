import {cookies} from 'next/headers';
import {hashToken,run} from '../../../lib/server';
export async function GET(){const token=(await cookies()).get('byron_session')?.value;if(token)await run('DELETE FROM sessions WHERE id=?',await hashToken(token));return new Response(null,{status:302,headers:{Location:'/signout-with-chatgpt?return_to=/','Set-Cookie':'byron_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'}});}
