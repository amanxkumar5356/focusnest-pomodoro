const FOCUS = 25 * 60, BREAK = 5 * 60;
const clock = document.querySelector("#clock");
const status = document.querySelector("#status");
const start = document.querySelector("#start");
const count = document.querySelector("#count");
const notify = document.querySelector("#notify");
const modes = [...document.querySelectorAll(".mode")];
let mode = "focus", left = FOCUS, running = false, timer = null, sessions = 0;

function draw(){
  clock.textContent = `${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`;
  start.textContent = running ? "Pause" : "Start";
  count.textContent = sessions;
  document.title = `${clock.textContent} — FocusNest`;
}
function stop(){if(timer) clearInterval(timer); timer=null; running=false;}
function choose(next){
  stop(); mode=next; left=mode==="focus"?FOCUS:BREAK;
  modes.forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  status.textContent=mode==="focus"?"Ready when you are":"Take a short breather"; draw();
}
modes.forEach(b=>b.addEventListener("click",()=>choose(b.dataset.mode)));
document.querySelector("#reset").addEventListener("click",()=>{stop();left=mode==="focus"?FOCUS:BREAK;status.textContent="Timer reset";draw();});
start.addEventListener("click",()=>{
  if(running){stop();status.textContent="Paused";draw();return;}
  if(notify.checked && "Notification" in window && Notification.permission==="default") Notification.requestPermission();
  running=true; status.textContent=mode==="focus"?"Stay with your task":"Enjoy your break"; draw();
  timer=setInterval(()=>{
    left--;
    if(left<=0){
      left=0; stop();
      if(mode==="focus"){sessions++;status.textContent="Focus complete. Time for a break!";}
      else status.textContent="Break complete. Ready to focus again?";
      if(notify.checked && "Notification" in window && Notification.permission==="granted")
        new Notification("FocusNest",{body:"Your timer session has finished."});
    }
    draw();
  },1000);
});
draw();
