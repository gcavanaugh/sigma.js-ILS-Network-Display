  function init() {
  /**
   * First, let's instanciate sigma.js :
   */
  var sigInst = sigma.init($('#sigma-example')[0]).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 14,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    defaultNodeColor: '#3366CC',
    labelThreshold: 1
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 5,
    minEdgeSize: 0.1,
    maxEdgeSize: 50
  }).mouseProperties({
    maxRatio: 10
  });

  // (requires "sigma.parseGexf.js" to be executed)
  sigInst.parseGexf('/data/since2005.gexf');

  /**
   * Now, here is the code that shows the popup :
   */
  (function(){
    var popUp;

    // This function is used to generate the attributes list from the node attributes.
    // Since the graph comes from GEXF, the attibutes look like:
    // [
    //   { attr: 'Lorem', val: '42' },
    //   { attr: 'Ipsum', val: 'dolores' },
    //   ...
    //   { attr: 'Sit',   val: 'amet' }
    // ]
    function attributesToString(attr) {
      return '<ul>' +
        attr.map(function(o){
          return '<li>' + o.attr + ' : ' + o.val + '</li>';
        }).join('') +
        '</ul>';
    }

    function showNodeInfoAndHideRest(event) {
      popUp && popUp.remove();

    var nodes = event.content;
    var neighbors = {};
    sigInst.iterEdges(function(e){
      if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
        neighbors[e.source] = 1;
        neighbors[e.target] = 1;
      }
    }).iterNodes(function(n){
      if(!neighbors[n.id]){
        n.hidden = 1;
      }else{
        n.hidden = 0;
      }
    }).draw(2,2,2);

      var node;

      sigInst.iterNodes(function(n){
        node = n;
      },[event.content[0]]).draw(2,2,2);

      popUp = $(
        '<div class="node-info-popup"></div>'
      ).append(
        // The GEXF parser stores all the attributes in an array named
        // 'attributes'. And since sigma.js does not recognize the key
        // 'attributes' (unlike the keys 'label', 'color', 'size' etc),
        // it stores it in the node 'attr' object :
        attributesToString( node['attr']['attributes'] )
      ).attr(
        'id',
        'node-info'+sigInst.getID()
      ).css({
        'display': 'inline-block',
        'border-radius': 3,
        'padding': 5,
        'background': '#fff',
        'color': '#000',
        'box-shadow': '0 0 4px #666',
        'position': 'absolute',
        'left': node.displayX,
        'top': node.displayY+15
      });

      $('ul',popUp).css('margin','0 0 0 20px');

      $('#sigma-example').append(popUp);
    }


    function hideNodeInfoAndShowRest(event) {
      popUp && popUp.remove();
      popUp = false;
      sigInst.iterEdges(function(e){
      e.hidden = 0;
    }).iterNodes(function(n){
      n.hidden = 0;
    }).draw(2,2,2);
    }



    sigInst.bind('overnodes',showNodeInfoAndHideRest).bind('outnodes',hideNodeInfoAndShowRest).draw();
  })();
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', init, false);
} else {
  window.onload = init;
}