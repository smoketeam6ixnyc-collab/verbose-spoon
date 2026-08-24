import { NextResponse } from 'next/server'
export async function GET(){return NextResponse.json({releases:[{id:'demo-1',name:'Demo Air Runner 1',sizes:['9','10','10.5','11'],mode:'watch'},{id:'demo-2',name:'Demo Court Classic',sizes:['10','11'],mode:'human-confirmed'}]})}
