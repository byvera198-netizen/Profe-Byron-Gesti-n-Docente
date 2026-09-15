import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {getChatGPTUser} from './chatgpt-auth';
import Workspace from './workspace';

export const dynamic='force-dynamic';
export default async function Home(){const session=(await cookies()).get('byron_session')?.value,workspaceUser=await getChatGPTUser();if(!session&&!workspaceUser)redirect('/acceso');return <Workspace/>;}
