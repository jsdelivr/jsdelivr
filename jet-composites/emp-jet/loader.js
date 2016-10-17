define(['ojs/ojcore', 
        'text!./empTable.html', 
        './empTable',
        'text!./empTableMetadata.json', 
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
