define(['ojs/ojcore', 
        'text!./emptable.html', 
        './emptable',
        'text!./emptablemetadata.json', 
        'ojs/ojcomposite'],
 function(oj, view, viewModel, metadata)
 {
 //console.log("oj: "+oj+ " :view: " + view + " :viewModel: "+viewModel+" :metadata: "+ metadata);
    oj.Composite.register('emp-jet', {
      view: {inline: view},
      viewModel: {inline: viewModel},
      metadata: {inline: JSON.parse(metadata)}
    });
 }
 );
