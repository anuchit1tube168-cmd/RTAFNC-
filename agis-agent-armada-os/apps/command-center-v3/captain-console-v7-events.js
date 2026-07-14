(()=>{'use strict';
if(!window.AGISSProcessor||window.AGISSProcessor.__agisV7Wrapped)return;
const bus=new EventTarget();
const emit=(type,detail)=>bus.dispatchEvent(new CustomEvent(type,{detail:{...detail,at:new Date().toISOString()}}));
const originalCall=window.AGISSProcessor.call.bind(window.AGISSProcessor);
window.AGISSProcessor.call=async function(action,payload={}){
  const requestId=`REQ-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  emit('processor:request',{requestId,action,payload});
  try{
    const response=await originalCall(action,payload);
    emit('processor:response',{requestId,action,payload,response,ok:Boolean(response&&response.ok)});
    return response;
  }catch(error){
    emit('processor:error',{requestId,action,payload,error:String(error)});
    throw error;
  }
};
window.AGISSProcessor.__agisV7Wrapped=true;
window.AGISOperationsBus={
  on(type,handler){bus.addEventListener(type,event=>handler(event.detail));},
  emit(type,detail){emit(type,detail);}
};
})();