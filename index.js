const toolbarOpenImg = "https://www.seekpng.com/png/full/13-134135_question-mark-emblem-bo-question-mark-clip-art.png";
const toolbarCloseImg = "https://web.archive.org/web/20240930185035if_/https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Black_close_x.svg/800px-Black_close_x.svg.png" 
//"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Black_close_x.svg/800px-Black_close_x.svg.png";

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
  
  return (rect.right - 8 > 0 && rect.left + 8 < viewWidth);
}

function addImageProcess(src){
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const toolbar = document.getElementById("toolbar");
const toolbarImg = document.querySelector("#toolbar #img");
const toolbarBg = document.getElementById("toolbarBG");
const infoDiv = document.getElementById("info");
const loading = document.getElementById("loading");

const bg = document.getElementById("bg");

let children = bg.children;
children = [...children];

let numImgLoaded = 0;

/*
async function queueImageLoad(element){
  await element.decode();
  numImgLoaded++;
  if (numImgLoaded == children.length + 1){
    finishLoading();
  }
}
*/

let rowCount = 0;

let i = 1;

(async function(){
  for (const node of children) {
    //await addImageProcess(node.src);
    await addImageProcess(node.src).then(() => {

    }).catch(() => {
      console.log("Error loading image: " + node.src);
      node.src = "./greenery.webp";
    });
  }

  for (const node of children) {
    node.style.order = i;

    const clone = node.cloneNode(true);

    clone.style.order = i + children.length;

    bg.appendChild(clone);

    if (!checkVisible(node)){
      
      let newElem = document.createElement("hr");
      newElem.style.order = i;

      bg.insertBefore(newElem, node);


      let newElem2 = document.createElement("hr");
      newElem2.style.order = i + children.length;

      bg.insertBefore(newElem2, clone);

      rowCount++;
    }

    if (i == children.length - 1) {
      let newElem = document.createElement("hr");
      newElem.style.order = i + children.length;

      node.after(newElem);
    }

    i++;
    
    loading.innerText = `Showcase Loading ${i}/${children.length + 1}`;
  }

  let isToolbarOpen = false;
  
  toolbar.addEventListener("click", e => {
    isToolbarOpen = !isToolbarOpen;
    if (isToolbarOpen){
      toolbarBg.style.height = "200vw";
      toolbarBg.style.left = "-50vw";
      toolbarBg.style.top = "-50vw";
      toolbarBg.style.background = "rgba(70,70,70,0.9)";

      toolbarImg.src = toolbarCloseImg;

      infoDiv.classList.add("open");
    } else {
      toolbarBg.style.height = null;
      toolbarBg.style.left = null;
      toolbarBg.style.top = null;
      toolbarBg.style.background = null;

      toolbarImg.src = toolbarOpenImg;

      infoDiv.classList.remove("open");
    }
  });
  
  
  setTimeout(function(){
    loading.classList.add("done");

    setTimeout(function(){
      bg.classList.add("animating");
      setTimeout(function(){
        toolbarImg.src = toolbarOpenImg;
        toolbar.classList.add("loaded");
      },2000);
    }, 1000);
  }, 3000);

  document.documentElement.style.setProperty('--numberOfRows', rowCount);

  console.log(getComputedStyle(document.documentElement).getPropertyValue('--numberOfRows'));
})();
