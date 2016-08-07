void function(window, document){
  window.onload = widget;
  function widget(){
    var hook = document.getElementById('cancer-spot-widget');
    if(!hook) {
      console.warn("No element with 'cancer-spot-widget' id found.  Aborting widget script.")
      return;
    }
    hook.innerHTML = "<a href='http://www.cancerspot.co'><img style='height: 100px; width: auto' src='http://cancerspot.co/img/lone_icon.png'></a>";
  }
}(window, document)